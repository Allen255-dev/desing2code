import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { planId } = body;

        if (!planId || planId !== 'pro') {
            return new NextResponse('Invalid plan', { status: 400 });
        }

        // Get user from DB
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        let stripeCustomerId = user.stripeCustomerId;

        // Create Stripe customer if doesn't exist
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: session.user.email,
                name: session.user.name ?? undefined,
            });
            stripeCustomerId = customer.id;
            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId },
            });
        }

        // Create Checkout Session
        const stripeSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [
                {
                    price: process.env.STRIPE_PRO_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/pricing?payment=cancelled`,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.log('[STRIPE_CHECKOUT]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

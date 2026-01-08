import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET ?? ""
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse('User ID is missing in metadata', { status: 400 });
        }

        await prisma.user.update({
            where: { id: session.metadata.userId },
            data: {
                stripeSubscriptionId: (subscription as any).id,
                plan: 'pro',
                planExpiryDate: new Date((subscription as any).current_period_end * 1000),
            },
        });
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        await prisma.user.update({
            where: { stripeSubscriptionId: (subscription as any).id },
            data: {
                planExpiryDate: new Date((subscription as any).current_period_end * 1000),
            },
        });
    }

    if (event.type === 'customer.subscription.deleted') {
        await prisma.user.update({
            where: { stripeSubscriptionId: session.id },
            data: {
                plan: 'starter',
                planExpiryDate: null,
                stripeSubscriptionId: null,
            },
        });
    }

    return new NextResponse(null, { status: 200 });
}

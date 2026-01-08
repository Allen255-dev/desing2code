import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user has any OAuth accounts (Google, GitHub, etc.)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { accounts: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If user has OAuth accounts, they can't change password
        if (user.accounts.length > 0) {
            const providers = user.accounts.map(acc => acc.provider).join(', ');
            return NextResponse.json(
                {
                    error: `Password management is handled by your authentication provider (${providers}). Please use your ${providers} account to change your password.`,
                    isOAuthUser: true,
                },
                { status: 400 }
            );
        }

        // For credential-based users (future implementation)
        // This would require bcrypt and credential provider setup
        return NextResponse.json(
            {
                error: 'Password change is not yet implemented for credential-based accounts.',
                isOAuthUser: false,
            },
            { status: 501 }
        );

    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json(
            { error: 'Failed to change password' },
            { status: 500 }
        );
    }
}

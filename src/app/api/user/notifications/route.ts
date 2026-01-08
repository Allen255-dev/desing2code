import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { emailNotifications, projectUpdates, marketingEmails } = body;

        // Validate input
        if (
            typeof emailNotifications !== 'boolean' ||
            typeof projectUpdates !== 'boolean' ||
            typeof marketingEmails !== 'boolean'
        ) {
            return NextResponse.json(
                { error: 'Invalid notification preferences' },
                { status: 400 }
            );
        }

        // For now, we'll just validate and return success
        // The actual preferences are stored client-side in localStorage
        // To persist to database, you would need to add fields to the User model

        return NextResponse.json({
            success: true,
            preferences: {
                emailNotifications,
                projectUpdates,
                marketingEmails,
            },
        });
    } catch (error) {
        console.error('Notification preferences error:', error);
        return NextResponse.json(
            { error: 'Failed to update notification preferences' },
            { status: 500 }
        );
    }
}

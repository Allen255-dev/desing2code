import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function DELETE(
    req: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const project = await prisma.project.findUnique({
            where: { id: params.projectId },
        });

        if (!project || project.userId !== user.id) {
            return new NextResponse('Unauthorized or not found', { status: 401 });
        }

        await prisma.project.delete({
            where: { id: params.projectId },
        });

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('[PROJECT_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

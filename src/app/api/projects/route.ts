import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Use auth() instead of getServerSession()
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Use auth() instead of getServerSession()
    const session = await auth();
    
    // Get userId from session
    const userId = session?.user?.id;

    // Check authorization
    if (!session || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch projects
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
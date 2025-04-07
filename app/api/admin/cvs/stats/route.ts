import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
interface User {
  id: string;
  name: string | null;
  email: string | null;
  cvs: Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export async function GET() {
  try {
    // Admin kontrolü
    await requireAdmin();

    const stats = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cvs: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    // Array formatında dönüştür
    const formattedStats = stats.map((user: User) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      cvCount: user.cvs.length,
      lastCvDate: user.cvs.length > 0 
        ? user.cvs[user.cvs.length - 1].updatedAt 
        : null
    }));

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
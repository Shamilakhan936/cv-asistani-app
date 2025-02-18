import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    // Admin kontrolü
    await requireAdmin();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            cvs: true,
            optimizations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('API Response:', JSON.stringify(users, null, 2));

    return NextResponse.json(users);
  } catch (error) {
    console.error('CV istatistikleri getirme hatası:', error);
    if (error instanceof Error && error.message === 'Yetkisiz erişim') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'CV istatistikleri getirilemedi' },
      { status: 500 }
    );
  }
} 
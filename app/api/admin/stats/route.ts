import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Kullanıcının admin olup olmadığını kontrol et
    const dbUser = await prisma.user.findUnique({
      where: { clerk_id: userId },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // İstatistikleri getir
    const [
      userCount,
      activeOperations,
      completedOperations,
      cvCount
    ] = await Promise.all([
      // Toplam kullanıcı sayısı
      prisma.user.count(),
      
      // Aktif işlem sayısı
      prisma.photoOperation.count({
        where: {
          status: 'PENDING'
        }
      }),

      // Tamamlanan işlem sayısı
      prisma.photoOperation.count({
        where: {
          status: 'COMPLETED'
        }
      }),

      // Toplam CV sayısı
      prisma.cV.count()
    ]);

    return NextResponse.json({
      users: userCount,
      activeOperations,
      completedOperations,
      cvs: cvCount
    });
  } catch (error) {
    console.error('[ADMIN_STATS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
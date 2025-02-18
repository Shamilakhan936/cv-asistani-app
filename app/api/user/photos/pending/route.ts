import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // Kullanıcının bekleyen operasyonlarını getir
    const pendingOperation = await prisma.photoOperation.findFirst({
      where: {
        user: {
          clerk_id: session.userId
        },
        status: {
          in: ['PENDING', 'PROCESSING']
        }
      },
      include: {
        photos: {
          where: {
            type: 'ORIGINAL'
          },
          select: {
            id: true,
            url: true,
            created_at: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (!pendingOperation) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      id: pendingOperation.id,
      status: pendingOperation.status,
      createdAt: pendingOperation.created_at,
      photos: pendingOperation.photos.map(photo => ({
        id: photo.id,
        url: photo.url,
        createdAt: photo.created_at
      }))
    });

  } catch (error) {
    console.error('Bekleyen fotoğraf getirme hatası:', error);
    return NextResponse.json(
      { error: 'Bekleyen fotoğraflar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
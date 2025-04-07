import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { logger } from '@/lib/logger';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    logger.info('Yeni fotoğraf yükleme isteği alındı');

    const session = await auth();
    if (!session?.userId) {
      logger.warn('Yetkisiz erişim denemesi');
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { photos, styles } = body;

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      logger.warn('Geçersiz fotoğraf verisi', { photos });
      return NextResponse.json(
        { error: 'Geçerli fotoğraf verileri bulunamadı' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { clerk_id: session.userId }
    });

    if (!user) {
      logger.error('Kullanıcı bulunamadı', { clerkUserId: session.userId });
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    logger.debug('Yeni operation oluşturuluyor', { userId: user.id });

    // Yeni operation oluştur
    const operation = await prisma.photoOperation.create({
      data: {
        id: randomUUID(),
        user_id: user.id,
        status: 'PENDING',
        can_cancel: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Fotoğrafları kaydet
    const photoPromises = photos.map(async (photo: { url: string }) => {
      return prisma.photo.create({
        data: {
          id: randomUUID(),
          url: photo.url,
          type: 'ORIGINAL',
          metadata: { styles },
          operation_id: operation.id,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    });

    await Promise.all(photoPromises);

    logger.info('Fotoğraf yükleme başarılı', { 
      operationId: operation.id,
      photoCount: photos.length 
    });

    return NextResponse.json({
      success: true,
      operationId: operation.id,
      photoCount: photos.length
    });
  } catch (error) {
    logger.error('Fotoğraf kaydetme hatası', { error });
    return NextResponse.json(
      { error: 'Fotoğraflar kaydedilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
export const dynamic = 'force-dynamic';
export async function POST(
  request: Request,
  { params }: { params: { photoId: string } }
) {
  try {
    // Kullanıcı kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const { photoId } = params;

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { clerk_id: session.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // İşlemi kontrol et
    const operation = await prisma.photoOperation.findFirst({
      where: {
        id: photoId,
        user_id: user.id,
        can_cancel: true
      }
    });

    if (!operation) {
      return NextResponse.json(
        { error: 'İşlem bulunamadı veya iptal edilemez' },
        { status: 404 }
      );
    }

    // 30 dakika kontrolü
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const operationDate = new Date(operation.created_at);
    if (operationDate < thirtyMinutesAgo) {
      return NextResponse.json(
        { error: 'İptal süresi dolmuş' },
        { status: 400 }
      );
    }

    // Önce fotoğrafları sil
    await prisma.photo.deleteMany({
      where: {
        operation_id: photoId
      }
    });

    // Sonra işlemi sil
    await prisma.photoOperation.delete({
      where: {
        id: photoId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('İptal hatası:', error);
    return NextResponse.json(
      { error: 'Fotoğraf işlemi iptal edilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
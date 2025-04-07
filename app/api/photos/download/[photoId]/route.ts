import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
export const dynamic = 'force-dynamic';
export async function GET(
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

    // Fotoğrafı bul
    const photo = await prisma.photo.findUnique({
      where: { id: params.photoId },
      include: {
        operation: true
      }
    });

    if (!photo) {
      return NextResponse.json(
        { error: 'Fotoğraf bulunamadı' },
        { status: 404 }
      );
    }

    // Fotoğrafın URL'ini döndür
    return NextResponse.json({ url: photo.url });
  } catch (error) {
    console.error('Fotoğraf indirme hatası:', error);
    return NextResponse.json(
      { error: 'Fotoğraf indirilemedi' },
      { status: 500 }
    );
  }
} 
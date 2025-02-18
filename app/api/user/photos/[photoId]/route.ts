import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: Request,
  { params }: { params: { photoId: string } }
) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

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

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Fotoğraf getirme hatası:', error);
    return NextResponse.json(
      { error: 'Fotoğraf getirilemedi' },
      { status: 500 }
    );
  }
} 
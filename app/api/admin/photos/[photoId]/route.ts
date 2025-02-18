import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { photoId: string } }
) {
  try {
    // Admin kontrolü
    await requireAdmin();

    // Fotoğrafı sil
    const photo = await prisma.photo.delete({
      where: { id: params.photoId }
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Fotoğraf silme hatası:', error);
    if (error instanceof Error && error.message === 'Yetkisiz erişim') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Fotoğraf silinemedi' },
      { status: 500 }
    );
  }
} 
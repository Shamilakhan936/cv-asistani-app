import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { photoId: string } }
) {
  try {
    const { photoId } = params;

    // Fotoğraf işlemini bul ve güncelle
    const operation = await prisma.photoOperation.update({
      where: {
        id: photoId,
      },
      data: {
        can_cancel: false,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ operation });
  } catch (error) {
    console.error('Timeout hatası:', error);
    return NextResponse.json(
      { error: 'İptal süresi güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
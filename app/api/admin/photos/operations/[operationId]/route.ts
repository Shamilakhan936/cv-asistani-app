import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { operationId: string } }
) {
  try {
    // Admin kontrolü
    await requireAdmin();

    const { operationId } = params;

    // Önce fotoğrafları sil
    await prisma.photo.deleteMany({
      where: {
        operation_id: operationId
      }
    });

    // Sonra işlemi sil
    await prisma.photoOperation.delete({
      where: {
        id: operationId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('İşlem silme hatası:', error);
    if (error instanceof Error && error.message === 'Yetkisiz erişim') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'İşlem silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
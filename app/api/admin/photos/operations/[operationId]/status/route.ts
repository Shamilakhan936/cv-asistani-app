import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: { operationId: string } }
) {
  try {
    // Admin kontrolü
    await requireAdmin();

    const { status } = await request.json();

    // Geçerli durumları kontrol et
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz durum' },
        { status: 400 }
      );
    }

    // İşlemi güncelle
    const operation = await prisma.photoOperation.update({
      where: {
        id: params.operationId
      },
      data: {
        status,
        updated_at: new Date()
      }
    });

    return NextResponse.json(operation);
  } catch (error) {
    console.error('Durum güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Durum güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
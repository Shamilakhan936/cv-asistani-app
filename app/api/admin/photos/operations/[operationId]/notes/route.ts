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

    const { notes } = await request.json();

    // İşlemi güncelle
    const operation = await prisma.photoOperation.update({
      where: {
        id: params.operationId
      },
      data: {
        notes,
        updated_at: new Date()
      }
    });

    return NextResponse.json(operation);
  } catch (error) {
    console.error('Not güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Notlar güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
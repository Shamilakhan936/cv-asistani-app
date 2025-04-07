import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Admin kontrolü
    await requireAdmin();

    // En son işlemi getir
    const operation = await prisma.photoOperation.findFirst({
      where: {
        user_id: params.userId
      },
      include: {
        photos: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (!operation) {
      return NextResponse.json(null);
    }

    // Fotoğrafları grupla
    const formattedOperation = {
      id: operation.id,
      status: operation.status,
      notes: operation.notes,
      photos: {
        original: operation.photos.filter(p => p.type === 'ORIGINAL'),
        generated: operation.photos.filter(p => p.type === 'AI_GENERATED')
      }
    };

    return NextResponse.json(formattedOperation);
  } catch (error) {
    console.error('İşlem getirme hatası:', error);
    return NextResponse.json(
      { error: 'İşlem getirilemedi' },
      { status: 500 }
    );
  }
} 
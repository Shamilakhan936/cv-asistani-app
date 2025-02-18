import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Admin kontrolü
    await requireAdmin();

    // Tüm fotoğrafları getir
    const photos = await prisma.photo.findMany({
      where: {
        operation: {
          user_id: params.userId
        }
      },
      include: {
        operation: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Fotoğrafları formatla
    const formattedPhotos = photos.map(photo => ({
      id: photo.id,
      url: photo.url,
      type: photo.type,
      createdAt: photo.created_at,
      status: photo.operation.status,
      metadata: photo.metadata
    }));

    return NextResponse.json(formattedPhotos);
  } catch (error) {
    console.error('Fotoğraf getirme hatası:', error);
    return NextResponse.json(
      { error: 'Fotoğraflar getirilemedi' },
      { status: 500 }
    );
  }
} 
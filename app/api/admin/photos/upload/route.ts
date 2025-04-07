import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
export const dynamic = 'force-dynamic';
interface UploadRequest {
  userId: string;
  photos: Array<{
    url: string;
  }>;
  styles: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export async function POST(request: Request) {
  try {
    // Admin kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const { userId, photos, styles } = await request.json() as UploadRequest;

    // Kullanıcıyı kontrol et
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Yeni bir operation oluştur
    const operation = await prisma.photoOperation.create({
      data: {
        userId: targetUser.id,
        status: 'PENDING',
        canCancel: true
      }
    });

    // Her fotoğraf için kayıt oluştur
    const createdPhotos = await Promise.all(
      photos.map(async (photo) => {
        return prisma.photo.create({
          data: {
            url: photo.url,
            type: 'ORIGINAL',
            metadata: { styles },
            operationId: operation.id
          }
        });
      })
    );

    return NextResponse.json({ 
      success: true, 
      operationId: operation.id,
      photoCount: createdPhotos.length 
    });
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Fotoğraflar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
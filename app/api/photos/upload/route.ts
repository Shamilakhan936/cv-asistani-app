import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Yeni bir operasyon oluştur
    const operation = await prisma.photoOperation.create({
      data: {
        userId: session.userId,
        status: 'UPLOADING',
        canCancel: true
      }
    });

    // Dosyayı Vercel Blob'a yükle
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Fotoğrafı veritabanına kaydet
    const photo = await prisma.photo.create({
      data: {
        url: blob.url,
        type: 'ORIGINAL',
        operationId: operation.id
      }
    });

    // Operasyon durumunu güncelle
    await prisma.photoOperation.update({
      where: { id: operation.id },
      data: { status: 'UPLOADED' }
    });

    return NextResponse.json({
      success: true,
      operationId: operation.id,
      photo: {
        id: photo.id,
        url: photo.url
      }
    });
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Fotoğraf yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
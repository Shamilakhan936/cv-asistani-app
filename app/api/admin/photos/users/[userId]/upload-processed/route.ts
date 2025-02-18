import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Base64'e çevir
    const base64 = buffer.toString('base64');
    const base64File = `data:${file.type};base64,${base64}`;

    // Cloudinary'ye yükle
    const timestamp = new Date().getTime();
    const fileName = `${params.userId}_processed_${timestamp}`;
    
    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'processed',
      public_id: fileName,
      resource_type: 'auto'
    });

    // Bekleyen veya işlenen operasyonu bul
    const operation = await prisma.photoOperation.findFirst({
      where: {
        user_id: params.userId,
        status: {
          in: ['PENDING', 'PROCESSING']  // Her iki durumda da izin ver
        }
      }
    });

    if (!operation) {
      return NextResponse.json(
        { error: 'Aktif işlem bulunamadı. İşlem tamamlanmış veya iptal edilmiş olabilir.' },
        { status: 404 }
      );
    }

    // İşlenmiş fotoğrafı kaydet
    const photo = await prisma.photo.create({
      data: {
        id: randomUUID(),
        url: result.secure_url,
        type: 'AI_GENERATED',
        operation_id: operation.id,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({ photo });
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Fotoğraf yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
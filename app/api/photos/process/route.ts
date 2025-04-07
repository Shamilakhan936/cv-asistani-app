import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import Replicate from 'replicate';
export const dynamic = 'force-dynamic';
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // Request body'den verileri al
    const { operationId } = await request.json();

    // Operasyonu bul
    const operation = await prisma.photoOperation.findUnique({
      where: { id: operationId },
      include: {
        photos: {
          where: { type: 'ORIGINAL' }
        }
      }
    });

    if (!operation) {
      return NextResponse.json({ error: 'İşlem bulunamadı' }, { status: 404 });
    }

    if (operation.userId !== session.userId) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    // İşlem durumunu güncelle
    await prisma.photoOperation.update({
      where: { id: operationId },
      data: { status: 'PROCESSING' }
    });

    // Her orijinal fotoğraf için AI işlemini başlat
    const processPromises = operation.photos.map(async (photo) => {
      try {
        const output = await replicate.run(
          "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
          {
            input: {
              image: photo.url,
              prompt: "professional headshot photo, corporate style, clean background",
              num_outputs: 1
            }
          }
        );

        if (Array.isArray(output) && output.length > 0) {
          // AI tarafından oluşturulan fotoğrafı kaydet
          await prisma.photo.create({
            data: {
              url: output[0],
              type: 'AI_GENERATED',
              operationId: operationId
            }
          });
        }
      } catch (error) {
        console.error('AI işleme hatası:', error);
        throw error;
      }
    });

    // Tüm işlemlerin tamamlanmasını bekle
    await Promise.all(processPromises);

    // İşlem durumunu güncelle
    await prisma.photoOperation.update({
      where: { id: operationId },
      data: {
        status: 'COMPLETED',
        canCancel: false
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fotoğraf işleme hatası:', error);
    return NextResponse.json(
      { error: 'Fotoğraflar işlenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
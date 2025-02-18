import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    // Kullanıcı kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // Formdata'dan dosyayı al
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya uzantısını kontrol et
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['jpg', 'jpeg', 'png'].includes(extension)) {
      return NextResponse.json(
        { error: 'Geçersiz dosya formatı. Sadece JPG ve PNG dosyaları kabul edilir.' },
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
    const fileName = `${session.userId}_${timestamp}`;
    
    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'photos',
      public_id: fileName,
      resource_type: 'auto'
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
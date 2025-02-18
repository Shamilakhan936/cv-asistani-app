import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import Replicate from 'replicate';

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET() {
  try {
    // Cloudinary bağlantısını test et
    const cloudinaryTest = await cloudinary.api.ping();
    
    // Replicate bağlantısını test et
    const replicateTest = await replicate.models.list();

    return NextResponse.json({
      status: 'success',
      cloudinary: cloudinaryTest,
      replicate: 'connected'
    });
  } catch (error) {
    console.error('API Test Hatası:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Bir hata oluştu'
    }, { status: 500 });
  }
} 
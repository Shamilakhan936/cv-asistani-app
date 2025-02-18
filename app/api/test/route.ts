import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Prisma bağlantısını test et
    const userCount = await prisma.user.count();
    
    // Başarılı yanıt
    return NextResponse.json({
      status: 'success',
      message: 'Prisma bağlantısı başarılı',
      data: {
        userCount,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    });

  } catch (error) {
    // Hata detaylarını logla
    console.error('Test API Hatası:', error);
    
    // Hata yanıtı
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
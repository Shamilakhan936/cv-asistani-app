import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
// DELETE: Tüm CV şablonlarını temizle
export async function DELETE(request: Request) {
  try {
    // Güvenlik kontrolü - sadece yerel ortamda çalışsın
    const host = request.headers.get('host') || '';
    if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Setup secret kontrolü
    const setupSecret = request.headers.get('x-setup-secret');
    if (setupSecret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Tüm şablonları temizle
    await prisma.$executeRaw`TRUNCATE TABLE "cv_templates" CASCADE`;

    return NextResponse.json({ 
      success: true, 
      message: 'Tüm CV şablonları başarıyla silindi'
    });
  } catch (error) {
    console.error('Error clearing CV templates:', error);
    return NextResponse.json({ 
      error: 'Failed to clear CV templates',
      details: (error as Error).message
    }, { status: 500 });
  }
} 
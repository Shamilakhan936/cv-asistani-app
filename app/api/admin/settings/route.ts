import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Ayarlar alınırken hata:', error);
    return NextResponse.json(
      { error: 'Ayarlar alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    const settings = await prisma.settings.upsert({
      where: {
        id: 1
      },
      update: {
        cloudinaryCloudName: data.cloudinary.cloudName,
        cloudinaryApiKey: data.cloudinary.apiKey,
        cloudinaryUploadPresetCV: data.cloudinary.uploadPresetCV,
        cloudinaryUploadPresetBlog: data.cloudinary.uploadPresetBlog,
        replicateApiToken: data.replicate.apiToken,
        googleClientId: data.google.clientId,
        googleClientSecret: data.google.clientSecret
      },
      create: {
        cloudinaryCloudName: data.cloudinary.cloudName,
        cloudinaryApiKey: data.cloudinary.apiKey,
        cloudinaryUploadPresetCV: data.cloudinary.uploadPresetCV,
        cloudinaryUploadPresetBlog: data.cloudinary.uploadPresetBlog,
        replicateApiToken: data.replicate.apiToken,
        googleClientId: data.google.clientId,
        googleClientSecret: data.google.clientSecret
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Ayarlar güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Ayarlar güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
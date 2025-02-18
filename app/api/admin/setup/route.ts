import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const SETUP_SECRET = process.env.SETUP_SECRET;

export async function POST(request: Request) {
  try {
    const { secret, userId } = await request.json();

    // Setup secret kontrolü
    if (!SETUP_SECRET || secret !== SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // Kullanıcıyı admin yap
    const admin = await prisma.user.upsert({
      where: { 
        id: userId
      },
      update: {
        role: 'ADMIN'
      },
      create: {
        id: userId,
        role: 'ADMIN'
      }
    });

    return NextResponse.json({
      message: 'Admin yetkisi verildi',
      admin: {
        id: admin.id,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Admin yetkisi verilemedi' },
      { status: 500 }
    );
  }
} 
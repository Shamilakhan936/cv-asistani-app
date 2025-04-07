import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

// Tüm etiketleri getir
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Etiketler getirilirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Etiketler getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// Yeni etiket oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Yetki kontrolü
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok.' },
        { status: 403 }
      );
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Etiket adı gereklidir.' },
        { status: 400 }
      );
    }

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Etiket oluşturulurken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Etiket oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 
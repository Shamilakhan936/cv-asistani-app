import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
// Tek bir etiketi getir
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { slug: params.slug },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Etiket bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Etiket getirilirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Etiket getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// Etiket güncelle
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
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

    // Yeni slug oluştur
    const newSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const tag = await prisma.tag.update({
      where: { slug: params.slug },
      data: {
        name,
        slug: newSlug
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Etiket güncellenirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Etiket güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// Etiket sil
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Yetki kontrolü
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok.' },
        { status: 403 }
      );
    }

    await prisma.tag.delete({
      where: { slug: params.slug }
    });

    return NextResponse.json({ message: 'Etiket başarıyla silindi.' });
  } catch (error) {
    console.error('Etiket silinirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Etiket silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 
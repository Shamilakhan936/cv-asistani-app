import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import prisma from '@/lib/prisma';

// Kategoriyi sil
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    // Kategoriyi bul
    const category = await prisma.category.findUnique({
      where: { slug: params.slug }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Önce blog yazısı-kategori ilişkilerini sil
    await prisma.categoryOnPost.deleteMany({
      where: { categoryId: category.id }
    });

    // Kategoriyi sil
    await prisma.category.delete({
      where: { id: category.id }
    });

    return NextResponse.json(
      { message: 'Kategori başarıyla silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Kategori silinirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
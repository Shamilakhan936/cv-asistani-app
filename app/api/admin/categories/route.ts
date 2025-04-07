import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
export const dynamic = 'force-dynamic';
// Kategori oluşturma
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, description } = data;

    const slug = slugify(name, { lower: true, strict: true });

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Kategori oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Kategori oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Kategori güncelleme
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, name, description } = data;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Kategori güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Kategori güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Kategori silme
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Kategori ID\'si gerekli' },
        { status: 400 }
      );
    }

    // Önce kategori-blog post ilişkilerini silelim
    await prisma.blogPostCategory.deleteMany({
      where: { categoryId: id }
    });

    // Sonra kategoriyi silelim
    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
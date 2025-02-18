import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Blog yazısını getir
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: {
        author: {
          select: { name: true }
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog yazısı getirilirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Blog yazısı getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// Blog yazısını güncelle
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

    const {
      title,
      content,
      excerpt,
      seoTitle,
      seoDesc,
      published,
      categoryIds,
      tagIds
    } = await request.json();

    // Mevcut blog yazısını bul
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: {
        categories: true,
        tags: true
      }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı.' },
        { status: 404 }
      );
    }

    // Yeni slug oluştur (başlık değiştiyse)
    const slug =
      title !== existingPost.title
        ? title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : existingPost.slug;

    // Blog yazısını güncelle
    const updatedPost = await prisma.blogPost.update({
      where: { id: existingPost.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        seoTitle,
        seoDesc,
        published,
        categories: {
          deleteMany: {},
          create: categoryIds.map((categoryId: string) => ({
            category: {
              connect: { id: categoryId }
            }
          }))
        },
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId: number) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Blog yazısı güncellenirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Blog yazısı güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// Blog yazısını sil
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

    // Mevcut blog yazısını bul
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı.' },
        { status: 404 }
      );
    }

    // Blog yazısını sil
    await prisma.blogPost.delete({
      where: { id: existingPost.id }
    });

    return NextResponse.json({ message: 'Blog yazısı başarıyla silindi.' });
  } catch (error) {
    console.error('Blog yazısı silinirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Blog yazısı silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 
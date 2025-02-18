import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';

// Blog yazısı oluşturma
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, content, excerpt, published, seoTitle, seoDesc, categories, tags } = data;

    const slug = slugify(title, { lower: true, strict: true });

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published,
        seoTitle,
        seoDesc,
        author: {
          connect: { id: data.authorId }
        },
        categories: {
          create: categories.map((categoryId: string) => ({
            category: {
              connect: { id: categoryId }
            }
          }))
        },
        tags: {
          create: tags.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog yazısı oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Blog yazısı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Blog yazısı güncelleme
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, title, content, excerpt, published, seoTitle, seoDesc, categories, tags } = data;

    // Önce mevcut kategorileri ve etiketleri silelim
    await prisma.blogPostCategory.deleteMany({
      where: { postId: id }
    });
    
    await prisma.blogPostTag.deleteMany({
      where: { postId: id }
    });

    // Şimdi blog yazısını güncelleyelim
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        published,
        seoTitle,
        seoDesc,
        categories: {
          create: categories.map((categoryId: string) => ({
            category: {
              connect: { id: categoryId }
            }
          }))
        },
        tags: {
          create: tags.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog yazısı güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Blog yazısı güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Blog yazısı silme
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog yazısı ID\'si gerekli' },
        { status: 400 }
      );
    }

    // Önce ilişkili kayıtları silelim
    await prisma.blogPostCategory.deleteMany({
      where: { postId: id }
    });
    
    await prisma.blogPostTag.deleteMany({
      where: { postId: id }
    });

    // Şimdi blog yazısını silelim
    await prisma.blogPost.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog yazısı silme hatası:', error);
    return NextResponse.json(
      { error: 'Blog yazısı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
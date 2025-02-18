import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Yayınlanmış blog yazılarını getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('sayfa')) || 1;
    const POSTS_PER_PAGE = 9;

    const [posts, totalPosts] = await Promise.all([
      prisma.blogPost.findMany({
        where: { published: true },
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
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE
      }),
      prisma.blogPost.count({
        where: { published: true }
      })
    ]);

    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    return NextResponse.json({
      posts,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Blog yazıları getirilirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Blog yazıları getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// Yeni blog yazısı oluştur
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

    // Slug oluştur
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Blog yazısını oluştur
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        seoTitle,
        seoDesc,
        published,
        author: {
          connect: { id: session.user.id }
        },
        categories: {
          create: categoryIds.map((categoryId: string) => ({
            category: {
              connect: { id: categoryId }
            }
          }))
        },
        tags: {
          create: tagIds.map((tagId: number) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog yazısı oluşturulurken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Blog yazısı oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 
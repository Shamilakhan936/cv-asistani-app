import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
export const dynamic = 'force-dynamic';
const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

type CategorySchema = z.infer<typeof categorySchema>;

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { error: 'Kategoriler getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmanız gerekiyor.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmuyor.' },
        { status: 403 }
      );
    }

    const json = await request.json();
    const validatedData = categorySchema.parse(json) as CategorySchema;

    // Slug oluştur
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı.', details: error.format() },
        { status: 400 }
      );
    }

    console.error('Category creation error:', error);
    return NextResponse.json(
      { error: 'Kategori oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 
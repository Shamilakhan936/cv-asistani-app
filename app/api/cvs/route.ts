import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// POST: Yeni bir CV oluştur
export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const cv = await prisma.cV.create({
      data: {
        title: data.title,
        templateId: data.templateId,
        content: data.content,
        userId,
      },
    });

    return NextResponse.json(cv);
  } catch (error) {
    console.error('CV save error:', error);
    return NextResponse.json(
      { error: 'CV kaydedilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// GET: Kullanıcının CV'lerini listele
export async function GET() {
  try {
    // Oturum kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcının CV'lerini getir
    const cvs = await prisma.cV.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ cvs });
  } catch (error) {
    console.error('Error fetching CVs:', error);
    return NextResponse.json({ error: 'Failed to fetch CVs' }, { status: 500 });
  }
} 
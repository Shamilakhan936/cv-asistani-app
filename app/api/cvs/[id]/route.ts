import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
export const dynamic = 'force-dynamic';
// GET: Belirli bir CV'yi getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'CV ID is required' }, { status: 400 });
    }

    // CV'yi getir
    const cv = await prisma.cV.findUnique({
      where: {
        id,
        userId: session.userId,
      },
    });

    // CV bulunamadıysa
    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    return NextResponse.json({ cv });
  } catch (error) {
    console.error('Error fetching CV:', error);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}

// DELETE: Belirli bir CV'yi sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'CV ID is required' }, { status: 400 });
    }

    // CV'nin kullanıcıya ait olup olmadığını kontrol et
    const cv = await prisma.cV.findUnique({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // CV'yi sil
    await prisma.cV.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json({ error: 'Failed to delete CV' }, { status: 500 });
  }
}

// PATCH: Belirli bir CV'yi güncelle
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'CV ID is required' }, { status: 400 });
    }

    // İstek gövdesini al
    const body = await request.json();
    const { title, content, isPublished } = body;

    // CV'nin kullanıcıya ait olup olmadığını kontrol et
    const cv = await prisma.cV.findUnique({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // CV'yi güncelle
    const updatedCV = await prisma.cV.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json({ 
      success: true,
      cv: updatedCV
    });
  } catch (error) {
    console.error('Error updating CV:', error);
    return NextResponse.json({ error: 'Failed to update CV' }, { status: 500 });
  }
} 
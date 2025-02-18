import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import prisma from '@/lib/prisma';

interface Session {
  user: {
    id: string;
    role: string;
  };
}

// Yorumları getir
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Yeni yorum ekle
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to comment' },
        { status: 401 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        postId: post.id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// Yorum sil
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to delete a comment' },
        { status: 401 }
      );
    }

    const { commentId } = await request.json();

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        author: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (comment.authorId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You are not authorized to delete this comment' },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
} 
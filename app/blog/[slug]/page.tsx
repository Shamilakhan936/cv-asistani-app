import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import prisma from '@/lib/prisma';
import Comments from '@/components/blog/Comments';
import { calculateReadingTime } from '@/lib/readingTime';
import { Clock } from 'lucide-react';
import MDPreview from '@/components/blog/MDPreview';
import RelatedPosts from '@/components/blog/RelatedPosts';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  name: string | null;
  image: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  createdAt: Date;
  seoTitle: string | null;
  seoDesc: string | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  categories: {
    category: Category;
  }[];
  tags: {
    tag: Tag;
  }[];
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      published: true,
      createdAt: true,
      seoTitle: true,
      seoDesc: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      categories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return post;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Yazı Bulunamadı - CV Asistanı Blog',
    };
  }

  return {
    title: post.seoTitle || `${post.title} - CV Asistanı Blog`,
    description: post.seoDesc || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  const categoryIds = post.categories.map(c => c.category.id);
  const tagIds = post.tags.map(t => t.tag.id);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            {post.author.image && (
              <img
                src={post.author.image}
                alt={post.author.name || ''}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span>{post.author.name}</span>
          </div>
          <span>
            {format(new Date(post.createdAt), 'd MMMM yyyy', {
              locale: tr,
            })}
          </span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime} dakika</span>
          </div>
        </div>
        {post.categories.length > 0 && (
          <div className="flex gap-2 mb-4">
            {post.categories.map(({ category }) => (
              <a
                key={category.slug}
                href={`/blog/kategori/${category.slug}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {category.name}
              </a>
            ))}
          </div>
        )}
        {post.tags.length > 0 && (
          <div className="flex gap-2">
            {post.tags.map(({ tag }) => (
              <a
                key={tag.slug}
                href={`/blog/etiket/${tag.slug}`}
                className="text-sm text-blue-600 hover:underline"
              >
                #{tag.name}
              </a>
            ))}
          </div>
        )}
      </header>

      <div className="prose max-w-none mb-8">
        <MDPreview content={post.content} />
      </div>

      <RelatedPosts postId={post.id} categoryIds={categoryIds} tagIds={tagIds} />

      <Comments postSlug={params.slug} />
    </article>
  );
} 
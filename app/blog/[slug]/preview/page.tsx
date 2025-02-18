import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import prisma from '@/lib/prisma';
import { calculateReadingTime } from '@/lib/readingTime';
import MDPreview from '@/components/blog/MDPreview';

interface Props {
  params: {
    slug: string;
  };
}

interface Category {
  name: string;
  slug: string;
}

interface Tag {
  name: string;
  slug: string;
}

interface CategoryWithRelation {
  category: Category;
}

interface TagWithRelation {
  tag: Tag;
}

interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  seoTitle: string | null;
  seoDesc: string | null;
  createdAt: Date;
  author: {
    name: string | null;
  };
  categories: CategoryWithRelation[];
  tags: TagWithRelation[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug }
  });

  if (!post) {
    return {
      title: 'Blog Yazısı Bulunamadı',
      description: 'Blog yazısı bulunamadı.'
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt
  };
}

export default async function BlogPostPreviewPage({ params }: Props) {
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
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
            <span>{post.author.name}</span>
            <span>•</span>
            <span>
              {format(new Date(post.createdAt), 'd MMMM yyyy', {
                locale: tr
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime} dakika
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map(({ category }: CategoryWithRelation) => (
              <Link
                key={category.slug}
                href={`/blog/kategori/${category.slug}`}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(({ tag }: TagWithRelation) => (
              <Link
                key={tag.slug}
                href={`/blog/etiket/${tag.slug}`}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <MDPreview content={post.content} />
        </div>
      </div>
    </div>
  );
} 
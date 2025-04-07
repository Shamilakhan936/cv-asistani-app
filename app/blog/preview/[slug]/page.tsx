import { Metadata } from 'next';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import prisma from '@/lib/prisma';
import { calculateReadingTime } from '@/lib/readingTime';
import { Clock } from 'lucide-react';
import { ShareButtons } from '@/components/blog/ShareButtons';

interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDesc: string;
  author: {
    name: string;
  };
  categories: {
    category: {
      name: string;
      slug: string;
    };
  }[];
  createdAt: Date;
}

// Meta verileri
export const metadata: Metadata = {
  title: 'Blog Yazısı Önizleme | CV Asistanı',
  description: 'Blog yazısı önizleme sayfası',
  robots: {
    index: false,
    follow: false
  }
};

// Blog yazısını getir
async function getPost(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
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
      }
    }
  });

  if (!post) return null;

  return {
    ...post,
    createdAt: post.createdAt
  };
}

export default async function PreviewPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Blog yazısı bulunamadı
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/preview/${params.slug}`;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-8">
        Bu bir önizleme sayfasıdır. Yazı henüz yayınlanmamış olabilir.
      </div>

      {/* Başlık */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {/* Meta Bilgileri */}
      <div className="flex flex-wrap items-center text-gray-600 mb-4 gap-4">
        <div className="flex items-center">
          <span className="mr-2">Yazar:</span>
          <span className="font-medium">{post.author.name}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Tarih:</span>
          <time dateTime={post.createdAt.toISOString()}>
            {format(post.createdAt, 'dd MMMM yyyy', { locale: tr })}
          </time>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{readingTime} dakika okuma</span>
        </div>
      </div>

      {/* Paylaşım Butonları */}
      <div className="mb-8">
        <ShareButtons
          url={postUrl}
          title={post.title}
          description={post.excerpt || ''}
        />
      </div>

      {/* Kategoriler */}
      {post.categories.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mb-8">
          <span className="mr-2">Kategoriler:</span>
          {post.categories.map(({ category }) => (
            <span
              key={category.slug}
              className="bg-gray-100 px-2 py-1 rounded text-sm"
            >
              {category.name}
            </span>
          ))}
        </div>
      )}

      {/* Özet */}
      {post.excerpt && (
        <div className="bg-gray-50 p-4 rounded-lg mb-8 text-gray-700 italic">
          {post.excerpt}
        </div>
      )}

      {/* İçerik */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
} 
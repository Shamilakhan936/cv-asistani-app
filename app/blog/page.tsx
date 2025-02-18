import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { BlogCard } from '@/components/blog/BlogCard';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  createdAt: Date;
  author: {
    name: string;
  };
  categories: {
    category: {
      name: string;
      slug: string;
    };
  }[];
}

// Meta verileri
export const metadata: Metadata = {
  title: 'Blog | CV Asistanı',
  description: 'CV hazırlama, iş arama ve kariyer gelişimi hakkında faydalı bilgiler içeren blog yazıları.',
  keywords: 'cv hazırlama, özgeçmiş, iş arama, kariyer gelişimi, mülakat teknikleri',
  openGraph: {
    title: 'Blog | CV Asistanı',
    description: 'CV hazırlama, iş arama ve kariyer gelişimi hakkında faydalı bilgiler içeren blog yazıları.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | CV Asistanı',
    description: 'CV hazırlama, iş arama ve kariyer gelişimi hakkında faydalı bilgiler içeren blog yazıları.'
  }
};

const POSTS_PER_PAGE = 9;

// Yayınlanmış blog yazılarını getir
async function getPublishedPosts(page: number = 1): Promise<{ posts: BlogPost[], totalPages: number }> {
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, totalPosts] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: POSTS_PER_PAGE,
      include: {
        author: {
          select: {
            name: true
          }
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
    }),
    prisma.blogPost.count({
      where: {
        published: true
      }
    })
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return {
    posts: posts.map((post: any) => ({
      ...post,
      createdAt: post.createdAt
    })),
    totalPages
  };
}

export default async function BlogPage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { posts, totalPages } = await getPublishedPosts(currentPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-600">
          Henüz blog yazısı bulunmamaktadır.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/blog?page=${currentPage - 1}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Önceki
                </Link>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}`}
                  className={`px-4 py-2 rounded ${
                    pageNum === currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}

              {currentPage < totalPages && (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Sonraki
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 
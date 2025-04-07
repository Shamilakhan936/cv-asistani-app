import { Metadata } from 'next';
import prisma from '@/lib/prisma';
// import { BlogCard } from '@/components/blog/BlogCard';
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

interface Category {
  id: string;
  name: string;
  description: string | null;
}

// Dinamik meta verilerini oluştur
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug }
  });

  if (!category) {
    return {
      title: 'Kategori Bulunamadı',
      description: 'Aradığınız kategori bulunamadı.'
    };
  }

  return {
    title: `${category.name} | Blog | CV Asistanı`,
    description: category.description || `${category.name} kategorisindeki blog yazıları`,
    openGraph: {
      title: `${category.name} | Blog | CV Asistanı`,
      description: category.description || `${category.name} kategorisindeki blog yazıları`,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Blog | CV Asistanı`,
      description: category.description || `${category.name} kategorisindeki blog yazıları`
    }
  };
}

const POSTS_PER_PAGE = 9;

// Kategoriye ait blog yazılarını getir
async function getCategoryPosts(slug: string, page: number = 1): Promise<{ category: Category | null, posts: BlogPost[], totalPages: number }> {
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    return { category: null, posts: [], totalPages: 0 };
  }

  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, totalPosts] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
        categories: {
          some: {
            categoryId: category.id
          }
        }
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
        published: true,
        categories: {
          some: {
            categoryId: category.id
          }
        }
      }
    })
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return {
    category,
    posts: posts.map((post: any) => ({
      ...post,
      createdAt: post.createdAt
    })),
    totalPages
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { slug: string },
  searchParams: { page?: string }
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { category, posts, totalPages } = await getCategoryPosts(params.slug, currentPage);

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Kategori bulunamadı
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
      
      {category.description && (
        <p className="text-gray-600 mb-8">{category.description}</p>
      )}
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-600">
          Bu kategoride henüz blog yazısı bulunmamaktadır.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))} */}
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/blog/kategori/${params.slug}?page=${currentPage - 1}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Önceki
                </Link>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/blog/kategori/${params.slug}?page=${pageNum}`}
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
                  href={`/blog/kategori/${params.slug}?page=${currentPage + 1}`}
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
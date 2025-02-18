import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { BlogCard } from '@/components/blog/BlogCard';
import { Tag } from 'lucide-react';

interface Props {
  params: { slug: string };
  searchParams: { sayfa?: string };
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  published: boolean;
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

interface TaggedPost {
  post: BlogPost;
}

const POSTS_PER_PAGE = 9;

// Meta verileri
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug }
  });

  if (!tag) {
    return {
      title: 'Etiket Bulunamadı | CV Asistanı Blog',
      description: 'Aradığınız etiket bulunamadı.'
    };
  }

  return {
    title: `${tag.name} Etiketli Yazılar | CV Asistanı Blog`,
    description: `${tag.name} etiketi ile ilgili blog yazıları.`
  };
}

// Etiketli yazıları getir
async function getTaggedPosts(slug: string, page: number = 1) {
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        where: {
          post: {
            published: true
          }
        },
        include: {
          post: {
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
          }
        },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
        orderBy: {
          post: {
            createdAt: 'desc'
          }
        }
      },
      _count: {
        select: { posts: true }
      }
    }
  });

  if (!tag) return null;

  const totalPages = Math.ceil(tag._count.posts / POSTS_PER_PAGE);

  return {
    tag,
    posts: tag.posts.map(({ post }: TaggedPost) => ({
      ...post,
      createdAt: post.createdAt
    })),
    totalPages
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const currentPage = Number(searchParams.sayfa) || 1;
  const data = await getTaggedPosts(params.slug, currentPage);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Etiket bulunamadı.
        </div>
      </div>
    );
  }

  const { tag, posts, totalPages } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center mb-2">
          <Tag className="w-8 h-8 mr-2" />
          {tag.name}
        </h1>
        <p className="text-gray-600">
          Bu etikete sahip {tag._count.posts} yazı bulundu.
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post: BlogPost) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              {currentPage > 1 && (
                <a
                  href={`/blog/etiket/${params.slug}?sayfa=${currentPage - 1}`}
                  className="px-4 py-2 text-gray-600 bg-white rounded shadow hover:bg-gray-50"
                >
                  Önceki
                </a>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={`/blog/etiket/${params.slug}?sayfa=${page}`}
                  className={`px-4 py-2 rounded shadow ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </a>
              ))}

              {currentPage < totalPages && (
                <a
                  href={`/blog/etiket/${params.slug}?sayfa=${currentPage + 1}`}
                  className="px-4 py-2 text-gray-600 bg-white rounded shadow hover:bg-gray-50"
                >
                  Sonraki
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Bu etikete sahip yayınlanmış yazı bulunmamaktadır.
        </div>
      )}
    </div>
  );
} 
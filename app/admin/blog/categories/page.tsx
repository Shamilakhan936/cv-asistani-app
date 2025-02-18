import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import prisma from '@/lib/prisma';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  _count: {
    posts: number;
  };
}

async function getCategories(): Promise<Category[]> {
  try {
    return await prisma.category.findMany({
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
  } catch (error) {
    console.error('Categories fetch error:', error);
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kategoriler</h1>
        <Link
          href="/admin/blog/categories/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Yeni Kategori
        </Link>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left text-sm font-medium">İsim</th>
                <th className="py-3 px-4 text-left text-sm font-medium">
                  Açıklama
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium">
                  Yazı Sayısı
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium">Tarih</th>
                <th className="py-3 px-4 text-left text-sm font-medium">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="py-3 px-4">
                    <Link
                      href={`/blog/kategori/${category.slug}`}
                      className="hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    {category.description || <span className="text-muted-foreground">-</span>}
                  </td>
                  <td className="py-3 px-4">{category._count.posts}</td>
                  <td className="py-3 px-4">
                    {format(new Date(category.createdAt), 'd MMMM yyyy', {
                      locale: tr,
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/categories/${category.slug}/edit`}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Düzenle
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link
                        href={`/blog/kategori/${category.slug}`}
                        target="_blank"
                        className="text-sm text-gray-600 hover:text-gray-700"
                      >
                        Görüntüle
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
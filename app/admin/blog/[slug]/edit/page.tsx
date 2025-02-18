'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Select from 'react-select';
import ImageUploader from '@/components/blog/ImageUploader';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface BlogPost {
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
  categories: {
    category: Category;
  }[];
}

export default function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [availableCategories, setAvailableCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Blog yazısını getir
        const postResponse = await fetch(`/api/blog/${params.slug}`);
        if (!postResponse.ok) throw new Error('Blog yazısı yüklenemedi');
        const postData = await postResponse.json();
        
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setExcerpt(postData.excerpt || '');
        setPublished(postData.published);
        setSeoTitle(postData.seoTitle || '');
        setSeoDesc(postData.seoDesc || '');
        setCategories(
          postData.categories.map((cat: { category: Category }) => ({
            value: cat.category.id,
            label: cat.category.name,
          }))
        );

        // Kategorileri getir
        const categoriesResponse = await fetch('/api/blog/categories');
        if (!categoriesResponse.ok) throw new Error('Kategoriler yüklenemedi');
        const categoriesData = await categoriesResponse.json();
        
        setAvailableCategories(
          categoriesData.map((cat: Category) => ({
            value: cat.id,
            label: cat.name,
          }))
        );
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError('Veriler yüklenirken bir hata oluştu');
      }
    }

    fetchData();
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/blog/${params.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          published,
          seoTitle,
          seoDesc,
          categoryIds: categories.map(cat => cat.value),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Blog yazısı güncellenirken bir hata oluştu');
      }

      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setContent(prev => prev + `\n![](${url})`);
  };

  if (!post) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {error ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Blog Yazısını Düzenle</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İçerik
            </label>
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || '')}
              preview="edit"
              className="min-h-[400px]"
            />
            <ImageUploader onUpload={handleImageUpload} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Özet
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategoriler
            </label>
            <Select
              isMulti
              options={availableCategories}
              value={categories}
              onChange={(selected) => setCategories(selected as CategoryOption[])}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Başlığı
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Açıklaması
            </label>
            <textarea
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 text-sm text-gray-700">
              Yayınla
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Select from 'react-select';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface TagOption {
  value: number;
  label: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
  categories: {
    category: Category;
  }[];
  tags: {
    tag: Tag;
  }[];
}

export default function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Blog yazısı ve diğer verileri getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, categoriesResponse, tagsResponse] = await Promise.all([
          fetch(`/api/blog/${params.slug}`),
          fetch('/api/blog/categories'),
          fetch('/api/blog/tags')
        ]);

        if (!postResponse.ok || !categoriesResponse.ok || !tagsResponse.ok) {
          throw new Error('Veriler getirilemedi.');
        }

        const postData = await postResponse.json();
        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();

        setPost(postData);
        setCategories(categoriesData);
        setTags(tagsData);

        // Form alanlarını doldur
        setTitle(postData.title);
        setContent(postData.content);
        setExcerpt(postData.excerpt || '');
        setSeoTitle(postData.seoTitle || '');
        setSeoDesc(postData.seoDesc || '');
        setPublished(postData.published);

        // Seçili kategorileri ayarla
        setSelectedCategories(
          postData.categories.map(({ category }: { category: Category }) => ({
            value: category.id,
            label: category.name
          }))
        );

        // Seçili etiketleri ayarla
        setSelectedTags(
          postData.tags.map(({ tag }: { tag: Tag }) => ({
            value: tag.id,
            label: tag.name
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

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
          seoTitle,
          seoDesc,
          published,
          categoryIds: selectedCategories.map(c => c.value),
          tagIds: selectedTags.map(t => t.value)
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Blog yazısı güncellenirken bir hata oluştu.');
      }

      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Blog yazısı bulunamadı.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* Başlık */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Başlık
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* İçerik */}
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              İçerik
            </label>
            <div data-color-mode="light">
              <MDEditor
                value={content}
                onChange={(value) => setContent(value || '')}
                height={400}
              />
            </div>
          </div>

          {/* Özet */}
          <div className="mb-4">
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Özet
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Kategoriler */}
          <div className="mb-4">
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kategoriler
            </label>
            <Select
              id="categories"
              isMulti
              options={categories.map(category => ({
                value: category.id,
                label: category.name
              }))}
              value={selectedCategories}
              onChange={(newValue) => setSelectedCategories(newValue as CategoryOption[])}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Kategorileri seçin..."
            />
          </div>

          {/* Etiketler */}
          <div className="mb-4">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Etiketler
            </label>
            <Select
              id="tags"
              isMulti
              options={tags.map(tag => ({
                value: tag.id,
                label: tag.name
              }))}
              value={selectedTags}
              onChange={(newValue) => setSelectedTags(newValue as TagOption[])}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Etiketleri seçin..."
            />
          </div>

          {/* SEO Başlığı */}
          <div className="mb-4">
            <label
              htmlFor="seoTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              SEO Başlığı
            </label>
            <input
              type="text"
              id="seoTitle"
              name="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SEO Açıklaması */}
          <div className="mb-4">
            <label
              htmlFor="seoDesc"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              SEO Açıklaması
            </label>
            <textarea
              id="seoDesc"
              name="seoDesc"
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          {/* Yayınlama Durumu */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-600">
                Bu yazıyı yayınla
              </span>
            </label>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/blog"
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
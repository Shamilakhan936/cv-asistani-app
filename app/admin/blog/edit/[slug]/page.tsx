'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Select from 'react-select';
import ImageUploader from '../../../../../components/blog/ImageUploader';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  seoTitle: string;
  seoDesc: string;
  categories: {
    category: Category;
  }[];
}

interface CategoryOption {
  value: string;
  label: string;
}

export default function EditBlogPost({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');

  // Blog yazısını getir
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.slug}`);
        if (!response.ok) throw new Error('Blog yazısı yüklenemedi');
        const data = await response.json();
        setPost(data);
        
        // Form alanlarını doldur
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt);
        setPublished(data.published);
        setSeoTitle(data.seoTitle);
        setSeoDesc(data.seoDesc);
        
        // Kategorileri seç
        const categoryOptions = data.categories.map(({ category }: { category: Category }) => ({
          value: category.id,
          label: category.name
        }));
        setSelectedCategories(categoryOptions);
      } catch (err) {
        setError('Blog yazısı yüklenirken bir hata oluştu');
        console.error(err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories');
        if (!response.ok) throw new Error('Kategoriler yüklenemedi');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError('Kategoriler yüklenirken bir hata oluştu');
        console.error(err);
      }
    };

    fetchPost();
    fetchCategories();
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
          categoryIds: selectedCategories.map(cat => cat.value)
        }),
      });

      if (!response.ok) throw new Error('Blog yazısı güncellenirken bir hata oluştu');

      router.push('/admin/blog');
    } catch (err) {
      setError('Blog yazısı güncellenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    const imageMarkdown = `\n![](${url})\n`;
    setContent((prevContent) => prevContent + imageMarkdown);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Yazısını Düzenle</h1>
        <div className="space-x-4">
          <Link
            href={`/admin/blog/preview/${params.slug}`}
            target="_blank"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Önizle
          </Link>
          <Link
            href="/admin/blog"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            İptal
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Başlık</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">İçerik</label>
          <div className="space-y-2">
            <ImageUploader onUpload={handleImageUpload} />
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              preview="edit"
              height={400}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Özet</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Kategoriler</label>
          <Select
            isMulti
            value={selectedCategories}
            onChange={(selected) => setSelectedCategories(selected as CategoryOption[])}
            options={categories.map(cat => ({
              value: cat.id,
              label: cat.name
            }))}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">SEO Başlığı</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">SEO Açıklaması</label>
          <textarea
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Yayınla
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

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

export default function NewBlogPostPage() {
  const router = useRouter();
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch('/api/blog/categories'),
          fetch('/api/blog/tags')
        ]);

        if (!categoriesResponse.ok || !tagsResponse.ok) {
          throw new Error('Veriler getirilemedi.');
        }

        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();

        setCategories(categoriesData);
        setTags(tagsData);

        const savedDraft = localStorage.getItem('blogDraft');
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          setTitle(draft.title || '');
          setContent(draft.content || '');
          setExcerpt(draft.excerpt || '');
          setSeoTitle(draft.seoTitle || '');
          setSeoDesc(draft.seoDesc || '');
          setSelectedCategories(draft.categories || []);
          setSelectedTags(draft.tags || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (title || content || excerpt) {
      localStorage.setItem(
        'blogDraft',
        JSON.stringify({
          title,
          content,
          excerpt,
          seoTitle,
          seoDesc,
          categories: selectedCategories,
          tags: selectedTags
        })
      );
    }
  }, [title, content, excerpt, seoTitle, seoDesc, selectedCategories, selectedTags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
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
        throw new Error(data.error || 'Blog yazısı oluşturulurken bir hata oluştu.');
      }

      localStorage.removeItem('blogDraft');

      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* ... existing form fields ... */}

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

          {/* ... existing form fields ... */}
        </form>
      </div>
    </div>
  );
} 
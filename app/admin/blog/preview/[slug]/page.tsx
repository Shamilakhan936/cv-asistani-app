'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
  };
  categories: {
    category: {
      name: string;
      slug: string;
    };
  }[];
  createdAt: string;
}

export default function PreviewBlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.slug}`);
        if (!response.ok) throw new Error('Blog yazısı yüklenemedi');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError('Blog yazısı yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Blog yazısı bulunamadı'}
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Başlık */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {/* Meta Bilgileri */}
      <div className="flex flex-wrap items-center text-gray-600 mb-8 gap-4">
        <div className="flex items-center">
          <span className="mr-2">Yazar:</span>
          <span className="font-medium">{post.author.name}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Tarih:</span>
          <time dateTime={post.createdAt}>
            {format(new Date(post.createdAt), 'dd MMMM yyyy', { locale: tr })}
          </time>
        </div>
        {post.categories.length > 0 && (
          <div className="flex items-center flex-wrap gap-2">
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
      </div>

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
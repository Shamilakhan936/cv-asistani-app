'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

interface DraftPost {
  title: string;
  content: string;
  excerpt: string;
}

export default function PreviewDraftPost() {
  const [post, setPost] = useState<DraftPost | null>(null);

  useEffect(() => {
    // Local storage'dan taslak verileri al
    const draftData = localStorage.getItem('blogDraft');
    if (draftData) {
      setPost(JSON.parse(draftData));
    }
  }, []);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Önizleme için kaydedilmiş taslak bulunamadı.
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
        <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
          Taslak Önizleme
        </div>
        <div className="flex items-center">
          <time dateTime={new Date().toISOString()}>
            {format(new Date(), 'dd MMMM yyyy', { locale: tr })}
          </time>
        </div>
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
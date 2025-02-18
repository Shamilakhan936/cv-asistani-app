'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface RelatedPostsProps {
  postId: string;
  categoryIds: string[];
  tagIds: string[];
}

export default function RelatedPosts({ postId, categoryIds, tagIds }: RelatedPostsProps) {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const categoryParams = categoryIds.map(id => `categoryIds[]=${id}`).join('&');
        const tagParams = tagIds.map(id => `tagIds[]=${id}`).join('&');
        const response = await fetch(
          `/api/blog/${postId}/related?${categoryParams}&${tagParams}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch related posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [postId, categoryIds, tagIds]);

  if (isLoading) {
    return <div>Loading related posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">İlgili Yazılar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            {post.excerpt && (
              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <span>{post.author.name || 'Anonim'}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.createdAt}>
                {format(new Date(post.createdAt), 'd MMMM yyyy', { locale: tr })}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 
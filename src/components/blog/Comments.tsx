'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';

interface Author {
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: Author;
}

interface CommentsProps {
  postSlug: string;
}

interface Session {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
  };
}

export default function Comments({ postSlug }: CommentsProps) {
  const { data: session } = useSession() as { data: Session | null };
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  async function fetchComments() {
    try {
      const response = await fetch(`/api/blog/${postSlug}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/${postSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const comment = await response.json();
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!session) return;

    try {
      const response = await fetch(`/api/blog/${postSlug}/comments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-md mb-2"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-gray-600">
          Please sign in to post a comment.
        </p>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {comment.author.image && (
                  <img
                    src={comment.author.image}
                    alt={comment.author.name || ''}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="font-medium">
                  {comment.author.name || 'Anonymous'}
                </span>
                <span className="text-gray-500 text-sm">
                  {format(new Date(comment.createdAt), 'PPp', {
                    locale: tr,
                  })}
                </span>
              </div>
              {session?.user.id === comment.authorId ||
                session?.user.role === 'admin' ? (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 hover:text-red-600"
                  title="Delete comment"
                >
                  <Trash2 size={18} />
                </button>
              ) : null}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 
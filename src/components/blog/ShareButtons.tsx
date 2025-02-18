'use client';

import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Bağlantı kopyalandı!');
    } catch (err) {
      console.error('Bağlantı kopyalanırken hata oluştu:', err);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="flex items-center text-gray-600">
        <Share2 className="w-4 h-4 mr-2" />
        Paylaş:
      </span>
      
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-blue-400 transition-colors"
        title="Twitter'da paylaş"
      >
        <Twitter className="w-5 h-5" />
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-blue-600 transition-colors"
        title="Facebook'ta paylaş"
      >
        <Facebook className="w-5 h-5" />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-blue-700 transition-colors"
        title="LinkedIn'de paylaş"
      >
        <Linkedin className="w-5 h-5" />
      </a>

      <button
        onClick={copyToClipboard}
        className="text-gray-600 hover:text-gray-800 transition-colors"
        title="Bağlantıyı kopyala"
      >
        <LinkIcon className="w-5 h-5" />
      </button>
    </div>
  );
} 
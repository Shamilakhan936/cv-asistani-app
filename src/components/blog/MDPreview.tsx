'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-preview/markdown.css';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

interface MDPreviewProps {
  content: string;
}

export default function MDPreview({ content }: MDPreviewProps) {
  return <MarkdownPreview source={content} />;
} 
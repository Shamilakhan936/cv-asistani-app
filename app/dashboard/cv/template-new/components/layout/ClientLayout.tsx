"use client";

import { Suspense } from 'react';
import Navbar from './Navbar';

interface ClientLayoutProps {
  children: React.ReactNode;
  className: string;
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  return (
    <body className={className}>
      <Navbar />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </body>
  );
} 
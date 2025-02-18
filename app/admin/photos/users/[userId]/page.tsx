import { Suspense } from 'react';
import UserPhotosClient from './client-page';

interface PageProps {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function UserPhotosPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Yükleniyor...</div>}>
      <UserPhotosClient userId={params.userId} />
    </Suspense>
  );
} 
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function PhotoPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  // Oturum kontrolü
  if (!isLoaded) {
    return <div className="container mx-auto p-8">Yükleniyor...</div>;
  }

  if (!userId) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Fotoğraf İşlemleri</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div
          onClick={() => router.push('/dashboard/photo/aiilefoto')}
          className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-4">AI ile Fotoğraf İyileştirme</h2>
          <p className="text-gray-600">
            Yapay zeka teknolojisi ile fotoğraflarınızı profesyonel görünüme kavuşturun.
          </p>
        </div>

        <div
          onClick={() => router.push('/dashboard/photo/arkaplankaldirma')}
          className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Arka Plan Kaldırma</h2>
          <p className="text-gray-600">
            Fotoğraflarınızın arka planını otomatik olarak kaldırın ve şeffaf hale getirin.
          </p>
        </div>
      </div>
    </div>
  );
} 

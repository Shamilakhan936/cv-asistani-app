'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, useUser } from '@clerk/nextjs';
import { ArrowDownTrayIcon, PhotoIcon, DocumentIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Photo {
  id: string;
  url: string;
  status: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface CV {
  id: string;
  title: string;
  updatedAt: string;
}

interface PhotoOperation {
  id: string;
  createdAt: string;
  status: string;
  photos: {
    original: Array<{
      id: string;
      url: string;
      createdAt: string;
    }>;
    generated: Array<{
      id: string;
      url: string;
      createdAt: string;
    }>;
  };
}

// Durum mesajları için sabit tanımla
const STATUS_MESSAGES = {
  PENDING: {
    title: 'Fotoğraflarınız Bekleme Sırasında',
    description: 'Fotoğraflarınız işleme alınmak için bekliyor. Yakında işleme başlanacak.',
    color: 'yellow'
  },
  PROCESSING: {
    title: 'Fotoğraflarınız İşleniyor',
    description: 'Fotoğraflarınız şu anda işleniyor. Bu işlem yaklaşık 4 saat sürebilir.',
    color: 'blue'
  }
};

export default function DashboardPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [operations, setOperations] = useState<PhotoOperation[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [photosRes, cvsRes] = await Promise.all([
          fetch('/api/user/photos'),
          fetch('/api/user/cvs')
        ]);

        if (!photosRes.ok || !cvsRes.ok) {
          throw new Error('API yanıtı başarısız oldu');
        }

        const [photosData, cvsData] = await Promise.all([
          photosRes.json(),
          cvsRes.json()
        ]);

        if (!photosData.success || !cvsData.success) {
          throw new Error(photosData.error || cvsData.error || 'Veri getirme başarısız oldu');
        }

        setOperations(photosData.operations || []);
        setCvs(cvsData.cvs || []);
      } catch (err) {
        console.error('Veri getirme hatası:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        setOperations([]);
        setCvs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn, router]);

  const downloadPhoto = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Fotoğraf indirme hatası:', error);
      alert('Fotoğraf indirilirken bir hata oluştu');
    }
  };

  if (!isSignedIn || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#6366f1]/5 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#6366f1]/5 via-white to-white flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6366f1]/5 via-white to-white">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="w-full mx-auto h-20">
          <div className="flex items-center justify-between h-full px-4">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-48 h-16 relative flex items-center">
                <svg viewBox="0 0 280 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#6366f1' }} />
                      <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Sol taraftaki minimal sembol */}
                  <g transform="translate(20, 20)">
                    <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="url(#logoGradient)" className="drop-shadow-sm" />
                    <circle cx="20" cy="20" r="8" fill="white"/>
                  </g>
                  
                  {/* CV Asistanı Yazısı */}
                  <text x="80" y="45" fill="#1f2937" fontSize="28" fontFamily="var(--font-sora)" fontWeight="600" letterSpacing="0">
                    CV Asistanı
                  </text>
                  
                  {/* AI POWERED Yazısı */}
                  <text x="82" y="65" fill="#6b7280" fontSize="10" fontFamily="var(--font-sora)" letterSpacing="0.2em" fontWeight="500">
                    AI POWERED
                  </text>
                </svg>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hoş geldiniz, {user?.firstName || user?.username}</span>
              <Link href="/sign-out" 
                className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105">
                Çıkış Yap
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[98%] mx-auto py-6">
        {/* Tools Section */}
        <div className="py-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* AI Fotoğraf Stüdyosu */}
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100/50 group">
              <div className="h-14 w-14 bg-gradient-to-br from-[#818cf8] to-[#6366f1] rounded-xl flex items-center justify-center mb-6 mx-auto transform rotate-3 group-hover:rotate-6 transition-transform">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Fotoğraf Stüdyosu</h3>
              <p className="text-gray-600 mb-4">
                İş başvurularınız için yüksek kaliteli profesyonel portre fotoğraflarınızı, size özel eğitilmiş yapay zeka modelimiz ile oluşturun.
              </p>
              <div className="mt-4">
                <Link href="/dashboard/photo" 
                  className="inline-flex items-center px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#818cf8] to-[#6366f1] hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105">
                  Fotoğraf Oluştur
                </Link>
              </div>
            </div>

            {/* CV Oluşturma */}
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100/50 group">
              <div className="h-14 w-14 bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] rounded-xl flex items-center justify-center mb-6 mx-auto transform -rotate-3 group-hover:-rotate-6 transition-transform">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Yeni CV Oluştur</h3>
              <p className="text-gray-600 mb-4">
                Modern şablonlar ile profesyonel CV'nizi dakikalar içinde oluşturun.
              </p>
              <div className="mt-4">
                <Link href="/dashboard/cv/new"
                  className="inline-flex items-center px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105">
                  CV Oluştur
                </Link>
              </div>
            </div>

            {/* İlan Bazlı CV Optimizasyonu */}
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100/50 group">
              <div className="h-14 w-14 bg-gradient-to-br from-[#e879f9] to-[#d946ef] rounded-xl flex items-center justify-center mb-6 mx-auto transform rotate-3 group-hover:rotate-6 transition-transform">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">İlan Bazlı CV Optimizasyonu</h3>
              <p className="text-gray-600 mb-4">
                CV'nizi başvuracağınız pozisyona göre optimize edin ve işe alım sürecinde öne çıkın.
              </p>
              <div className="mt-4">
                <Link href="/dashboard/optimize"
                  className="inline-flex items-center px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#e879f9] to-[#d946ef] hover:shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-105">
                  CV Optimize Et
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Fotoğraflarım Section */}
        <div className="py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fotoğraflarım</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {operations.length === 0 ? (
              <div className="col-span-full bg-white/50 backdrop-blur-xl p-8 rounded-2xl text-center">
                <p className="text-gray-600 mb-4">Henüz bir fotoğraf oluşturmadınız.</p>
                <Link href="/dashboard/photo"
                  className="inline-flex items-center px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#818cf8] to-[#6366f1] hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105">
                  İlk Fotoğrafınızı Oluşturun
                </Link>
              </div>
            ) : (
              (() => {
                const pendingOperation = operations.find(op => 
                  op.status === 'PENDING' || op.status === 'PROCESSING'
                );

                if (pendingOperation) {
                  const statusConfig = STATUS_MESSAGES[pendingOperation.status as keyof typeof STATUS_MESSAGES];
                  return (
                    <div key={pendingOperation.id} className="col-span-full bg-white/50 backdrop-blur-xl p-8 rounded-2xl">
                      <div className="text-center">
                        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${statusConfig?.color || 'yellow'}-600 mx-auto mb-4`}></div>
                        <h3 className={`text-lg font-semibold text-${statusConfig?.color || 'yellow'}-800 mb-2`}>
                          {statusConfig?.title || 'İşleminiz Devam Ediyor'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {statusConfig?.description || 'İşleminiz devam ediyor.'}
                        </p>
                        <Link 
                          href="/dashboard/pending-operation" 
                          className={`mt-4 inline-flex items-center px-4 py-2 rounded-xl font-medium text-${statusConfig?.color || 'yellow'}-800 bg-${statusConfig?.color || 'yellow'}-100 hover:bg-${statusConfig?.color || 'yellow'}-200 transition-all`}
                        >
                          İşlem Detaylarını Görüntüle
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                }

                const failedOperation = operations.find(op => op.status === 'FAILED');
                if (failedOperation) {
                  return (
                    <div key={failedOperation.id} className="col-span-full bg-white/50 backdrop-blur-xl p-8 rounded-2xl">
                      <div className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 text-red-600">
                          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">İşlem Başarısız Oldu</h3>
                        <p className="text-gray-600 mb-4">Yüklediğiniz fotoğraflar işleme uygun değil. Lütfen gereksinimleri kontrol ederek tekrar deneyin.</p>
                        <Link href="/dashboard/photo" 
                          className="mt-4 inline-flex items-center px-4 py-2 rounded-xl font-medium text-red-800 bg-red-100 hover:bg-red-200 transition-all">
                          Yeni Fotoğraf Yükle
                        </Link>
                      </div>
                    </div>
                  );
                }

                return operations
                  .filter(op => op.status === 'COMPLETED')
                  .map(operation => {
                    const processedPhotos = operation.photos.generated || [];
                    return processedPhotos.map(photo => (
                      <div key={photo.id} className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden group">
                        <div className="aspect-square relative">
                          <Image
                            src={photo.url}
                            alt="AI Generated Photo"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {new Date(photo.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                            <button
                              onClick={() => downloadPhoto(photo.url)}
                              className="text-[#6366f1] hover:text-[#4f46e5] transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ));
                  });
              })()
            )}
          </div>
        </div>

        {/* CV'lerim Section */}
        <div className="py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">CV'lerim</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cvs.length === 0 ? (
              <div className="col-span-full bg-white/50 backdrop-blur-xl p-8 rounded-2xl text-center">
                <p className="text-gray-600 mb-4">Henüz bir CV oluşturmadınız.</p>
                <Link href="/dashboard/cv/new"
                  className="inline-flex items-center px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105">
                  İlk CV'nizi Oluşturun
                </Link>
              </div>
            ) : (
              cvs.map((cv: CV) => (
                <div key={cv.id} className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cv.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Son güncelleme: {new Date(cv.updatedAt).toLocaleDateString('tr-TR')}
                  </p>
                  <div className="flex space-x-3">
                    <Link href={`/dashboard/cv/${cv.id}`}
                      className="flex-1 text-center px-3 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105">
                      Düzenle
                    </Link>
                    <Link href={`/dashboard/cv/${cv.id}/preview`}
                      className="flex-1 text-center px-3 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:shadow-lg hover:shadow-green-500/25 transition-all hover:scale-105">
                      Önizle
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 
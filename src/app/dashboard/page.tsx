'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cvs, setCvs] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              CV Asistanı
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Hoş geldiniz, {session?.user?.name}
            </span>
            <button
              onClick={() => router.push('/auth/logout')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tools Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* CV Fotoğrafı */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">CV Fotoğrafı Hazırlama</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Profesyonel CV fotoğrafınızı yapay zeka ile oluşturun veya düzenleyin.
                </p>
                <div className="mt-4">
                  <Link
                    href="/dashboard/photo"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Fotoğraf Hazırla
                  </Link>
                </div>
              </div>
            </div>

            {/* CV Oluşturma */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Yeni CV Oluştur</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Modern şablonlar ile profesyonel CV'nizi dakikalar içinde oluşturun.
                </p>
                <div className="mt-4">
                  <Link
                    href="/dashboard/cv/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    CV Oluştur
                  </Link>
                </div>
              </div>
            </div>

            {/* İş İlanı Optimizasyonu */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">CV Optimizasyonu</h3>
                <p className="mt-1 text-sm text-gray-500">
                  CV'nizi başvuracağınız pozisyona göre optimize edin.
                </p>
                <div className="mt-4">
                  <Link
                    href="/dashboard/optimize"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    CV Optimize Et
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CVs Section */}
        <div className="px-4 mt-8 sm:px-0">
          <h2 className="text-lg font-medium text-gray-900">CV'lerim</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cvs.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">Henüz bir CV oluşturmadınız.</p>
                <Link
                  href="/dashboard/cv/new"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  İlk CV'nizi Oluşturun
                </Link>
              </div>
            ) : (
              cvs.map((cv: any) => (
                <div key={cv.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{cv.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Son güncelleme: {new Date(cv.updatedAt).toLocaleDateString('tr-TR')}
                    </p>
                    <div className="mt-4 flex space-x-3">
                      <Link
                        href={`/dashboard/cv/${cv.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        Düzenle
                      </Link>
                      <Link
                        href={`/dashboard/cv/${cv.id}/preview`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        Önizle
                      </Link>
                    </div>
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
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Photo {
  id: string;
  url: string;
  createdAt: string;
}

interface PendingOperation {
  id: string;
  status: string;
  createdAt: string;
  photos: Photo[];
  canCancel: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function PendingOperationPage() {
  const router = useRouter();
  const [operation, setOperation] = useState<PendingOperation | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fotoğraf bilgilerini getir
    fetchOperation();

    // Her saniye timeLeft'i güncelle
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) return 0;
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const canCancelOperation = (operation: PendingOperation) => {
    if (!operation.canCancel) return false;
    const createdAt = new Date(operation.createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    return diffInMinutes <= 30;
  };

  const fetchOperation = async () => {
    try {
      const res = await fetch('/api/user/photos/pending');
      if (!res.ok) {
        throw new Error('API yanıtı başarısız oldu');
      }
      
      const data = await res.json();

      if (!data) {
        router.push('/dashboard');
        return;
      }

      // Ensure photos array exists
      const operationData = {
        ...data,
        photos: data.photos || []
      };

      setOperation(operationData);
      
      // İlk fotoğrafın kalan süresini hesapla (30 dakika)
      const createdAt = new Date(operationData.createdAt).getTime();
      const now = Date.now();
      const thirtyMinutesInMs = 30 * 60 * 1000;
      const elapsedMs = now - createdAt;
      const remainingMs = Math.max(thirtyMinutesInMs - elapsedMs, 0);
      const remainingSeconds = Math.floor(remainingMs / 1000);
      
      setTimeLeft(remainingSeconds);
      setLoading(false);

      // Süre dolduğunda otomatik güncelleme
      if (remainingSeconds === 0 && operationData.canCancel) {
        await fetch(`/api/photos/cancel/${operationData.id}/timeout`, {
          method: 'POST'
        });
      }
    } catch (error) {
      console.error('Fotoğraf getirme hatası:', error);
      setError('Fotoğraf bilgileri yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!operation) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/photos/cancel/${operation.id}`, {
        method: 'POST'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'İptal işlemi başarısız oldu');
      }

      // İşlem başarılı olduğunda dashboard'a yönlendir ve sayfayı yenile
      router.refresh(); // Tüm sayfaları yenile
      router.push('/dashboard');
    } catch (error) {
      console.error('İptal hatası:', error);
      setError(error instanceof Error ? error.message : 'Fotoğraf iptal edilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!operation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          Bekleyen işlem bulunamadı
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Geri Dön Butonu */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Panele Dön
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Fotoğraflar İşleniyor
            </h1>

            {/* Status Section */}
            <div className="mb-6 text-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(operation.status)}`}>
                {operation.status === 'PENDING' ? 'Beklemede' : 
                 operation.status === 'PROCESSING' ? 'İşleniyor' : 
                 operation.status === 'FAILED' ? 'Başarısız' : operation.status}
              </span>
              {operation.status !== 'FAILED' && (
                <p className="mt-2 text-sm text-gray-600">
                  Tahmini tamamlanma süresi: ~4 saat
                </p>
              )}
            </div>

            {/* Timer Section */}
            {operation.status !== 'FAILED' && (
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-2 text-gray-700">
                  <ClockIcon className="h-5 w-5" />
                  <span className="text-lg font-medium">
                    İptal için kalan süre: {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  {timeLeft > 0
                    ? 'İşlemi 30 dakika içinde iptal edebilirsiniz'
                    : 'İptal süresi dolmuştur'}
                </p>
              </div>
            )}

            {/* Failed Status Message */}
            {operation.status === 'FAILED' && (
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-red-600 mb-4">İşlem Başarısız</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <p className="text-red-800 mb-4">
                    Yüklediğiniz fotoğraflar işleme uygun değil. Lütfen aşağıdaki gereksinimleri kontrol ederek tekrar deneyiniz:
                  </p>
                  <ul className="text-left text-red-700 space-y-2">
                    <li>• Fotoğraflar net ve yüksek kalitede olmalıdır</li>
                    <li>• Yüzünüz açıkça görünmeli ve iyi aydınlatılmış olmalıdır</li>
                    <li>• Fotoğraflar selfie formatında ve yakın çekim olmalıdır</li>
                    <li>• Arka plan sade ve dikkat dağıtıcı olmamalıdır</li>
                    <li>• Yüzünüzü kapatan aksesuar veya filtre kullanılmamalıdır</li>
                  </ul>
                </div>
                <button
                  onClick={() => router.push('/dashboard/photo')}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Anladım, Yeni Fotoğraf Yükle
                </button>
              </div>
            )}

            {/* Photos Grid */}
            {operation.photos && operation.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {operation.photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      {photo.url && (
                        <Image
                          src={photo.url}
                          alt="Yüklenen fotoğraf"
                          fill
                          className="object-cover transition-opacity duration-300"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end items-center">
              {operation.status !== 'FAILED' && timeLeft > 0 && (
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  İşlemi İptal Et
                </button>
              )}
            </div>

            {/* Info Box */}
            {operation.status !== 'FAILED' && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Önemli Bilgiler</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Fotoğraflarınız yaklaşık 4 saat içinde hazır olacaktır.</li>
                  <li>• İşlemi yalnızca ilk 30 dakika içinde iptal edebilirsiniz.</li>
                  <li>• 30 dakika sonra iptal, değişiklik ve diğer talepleriniz için destek ekibimizle iletişime geçebilirsiniz.</li>
                  <li>• İşlem tamamlandığında e-posta ile bilgilendirileceksiniz.</li>
                </ul>
                {timeLeft === 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900">Destek İletişim</p>
                    <a
                      href="mailto:support@cvasistani.com"
                      className="mt-1 inline-block text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      support@cvasistani.com
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
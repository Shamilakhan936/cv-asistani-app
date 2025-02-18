'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CloudArrowDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Photo {
  id: string;
  url: string;
  type: string;
  metadata: any;
  createdAt: string;
}

interface Operation {
  id: string;
  status: string;
  notes: string | null;
  photos: {
    original: Photo[];
    generated: Photo[];
  };
}

interface UserPhotosClientProps {
  userId: string;
}

// Stil çevirileri için sabit tanımla
const STYLE_TRANSLATIONS: { [key: string]: string } = {
  'professional': 'Profesyonel (Resmi & Klasik)',
  'smart-casual': 'Smart Casual (Şık & Rahat)',
  'business-casual': 'Business Casual (Yarı Resmi & Ofis)',
  'tech-startup': 'Startup (Modern & Yenilikçi)',
  'freelancer': 'Freelancer (Esnek & Dinamik)',
  'creative': 'Kreatif (Yaratıcı & Özgün)',
  'corporate': 'Kurumsal (Ciddi & Güvenilir)',
  'academic': 'Akademik (Bilimsel & Eğitimsel)',
  'medical': 'Medikal (Sağlık & Güven)',
  'casual': 'Günlük (Rahat & Doğal)',
  'modern': 'Modern (Çağdaş & Trend)',
  'traditional': 'Geleneksel (Klasik & Zarif)',
  'artistic': 'Sanatsal (Özgün & İlham Verici)',
  'sporty': 'Sportif (Dinamik & Enerjik)'
};

// Durum renk ve metin eşleştirmeleri için sabit tanımla
const STATUS_CONFIG = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Beklemede' },
  PROCESSING: { color: 'bg-blue-100 text-blue-800', text: 'İşleniyor' },
  COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Tamamlandı' },
  FAILED: { color: 'bg-red-100 text-red-800', text: 'Başarısız' },
  CANCELLED: { color: 'bg-gray-100 text-gray-800', text: 'İptal Edildi' }
};

export default function UserPhotosClient({ userId }: UserPhotosClientProps) {
  const [operation, setOperation] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchOperation();
  }, []);

  const fetchOperation = async () => {
    try {
      const response = await fetch(`/api/admin/photos/users/${userId}/latest`);
      if (!response.ok) throw new Error('Fotoğraflar yüklenirken bir hata oluştu');
      const data = await response.json();
      setOperation(data);
      setNewStatus(data?.status || '');
      setNotes(data?.notes || '');
    } catch (error) {
      console.error(error);
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string) => {
    window.open(url, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !operation) return;

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/admin/photos/users/${userId}/upload-processed`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Fotoğraf yüklenirken bir hata oluştu');
      }
      
      // Yükleme sonrası verileri yenile
      await fetchOperation();
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
      setError('Fotoğraflar yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!operation) return;

    setStatusLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/admin/photos/operations/${operation.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Durum güncellenirken bir hata oluştu');
      
      await fetchOperation();
      setStatusMessage({ type: 'success', text: 'Durum başarıyla güncellendi' });
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: 'Durum güncellenirken bir hata oluştu' });
    } finally {
      setStatusLoading(false);
    }
  };

  const handleNotesChange = async () => {
    if (!operation) return;

    try {
      const response = await fetch(`/api/admin/photos/operations/${operation.id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error('Notlar güncellenirken bir hata oluştu');
      setEditingNotes(false);
      await fetchOperation();
    } catch (error) {
      console.error(error);
      setError('Notlar güncellenirken bir hata oluştu');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Fotoğraf silinirken bir hata oluştu');
      }

      // Başarılı silme sonrası verileri yenile
      await fetchOperation();
    } catch (error) {
      console.error('Silme hatası:', error);
      setError('Fotoğraf silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!operation) {
    return <div className="p-8 text-center">İşlem bulunamadı</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* 1. Orijinal Fotoğraflar */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Orijinal Fotoğraflar</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {operation.photos.original.map((photo, index) => (
            <div key={photo.id} className="relative">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={photo.url}
                  alt="Orijinal fotoğraf"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => handleDownload(photo.url)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <CloudArrowDownIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Seçilen Stiller */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Seçilen Stiller</h2>
        <div className="flex flex-wrap gap-2">
          {operation.photos.original[0]?.metadata?.styles?.map((style: string) => (
            <span
              key={style}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
            >
              {STYLE_TRANSLATIONS[style] || style}
            </span>
          )) || (
            <p className="text-gray-500 italic">Stil seçilmemiş</p>
          )}
        </div>
      </section>

      {/* 3. İşlenmiş Fotoğraf Yükleme */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">İşlenmiş Fotoğraflar</h2>
        
        {/* Yükleme Formu */}
        <div className="mb-6">
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFiles.length || uploading}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploading ? 'Yükleniyor...' : 'Fotoğrafları Yükle'}
          </button>
        </div>

        {/* İşlenmiş Fotoğraflar Listesi */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {operation.photos.generated.map((photo, index) => (
            <div key={photo.id} className="relative">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={photo.url}
                  alt="İşlenmiş fotoğraf"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleDownload(photo.url)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <CloudArrowDownIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <TrashIcon className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Durum Güncelleme */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Durum Güncelleme</h2>
        
        {/* Mevcut Durum Göstergesi */}
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Mevcut Durum: </span>
          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[operation.status as keyof typeof STATUS_CONFIG]?.color}`}>
            {STATUS_CONFIG[operation.status as keyof typeof STATUS_CONFIG]?.text || operation.status}
          </span>
        </div>

        {/* Durum Güncelleme Formu */}
        <div className="flex items-center space-x-4">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={statusLoading}
          >
            <option value="PENDING">Beklemede</option>
            <option value="PROCESSING">İşleniyor</option>
            <option value="COMPLETED">Tamamlandı</option>
            <option value="FAILED">Başarısız</option>
            <option value="CANCELLED">İptal Edildi</option>
          </select>
          <button
            onClick={handleStatusChange}
            disabled={statusLoading || newStatus === operation.status}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {statusLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Güncelleniyor...
              </>
            ) : (
              'Durumu Güncelle'
            )}
          </button>
        </div>

        {/* Durum Mesajı */}
        {statusMessage && (
          <div className={`mt-4 p-4 rounded-md ${
            statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {statusMessage.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{statusMessage.text}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Notlar */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Notlar</h2>
        {editingNotes ? (
          <div className="space-y-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Notlarınızı buraya yazın..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditingNotes(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleNotesChange}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="prose max-w-none">
              {notes || 'Not eklenmemiş'}
            </div>
            <button
              onClick={() => setEditingNotes(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
} 
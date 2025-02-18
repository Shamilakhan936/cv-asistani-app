'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function UploadProcessedPhotosPage({
  params
}: {
  params: { userId: string }
}) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    // Önizlemeleri oluştur
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => {
      // Eski önizlemeleri temizle
      prev.forEach(url => URL.revokeObjectURL(url));
      return newPreviews;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Lütfen en az bir fotoğraf seçin');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Her dosya için upload URL'i al
      const uploadPromises = files.map(async file => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`/api/admin/photos/users/${params.userId}/upload-processed`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Fotoğraf yükleme hatası');
        }

        return res.json();
      });

      await Promise.all(uploadPromises);

      // Başarılı yüklemeden sonra ana sayfaya dön
      router.push('/admin/photos');
      router.refresh();
    } catch (error) {
      console.error('Yükleme hatası:', error);
      setError('Fotoğraflar yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">İşlenmiş Fotoğrafları Yükle</h1>

        <div className="space-y-6">
          {/* Dosya Yükleme Alanı */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Fotoğraf seç</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1 text-gray-500">veya sürükle bırak</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF - 10MB'a kadar</p>
            </div>
          </div>

          {/* Önizleme */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Hata Mesajı */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Yükleme Butonu */}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className={`
                inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                ${uploading || files.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }
              `}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Yükleniyor...
                </>
              ) : (
                'Fotoğrafları Yükle'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
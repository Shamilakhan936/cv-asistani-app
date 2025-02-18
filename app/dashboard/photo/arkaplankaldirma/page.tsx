'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function BackgroundRemovalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Oturum kontrolü
  if (status === 'loading') {
    return <div className="container mx-auto p-8">Yükleniyor...</div>;
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Dosya tipi kontrolü
      if (!selectedFile.type.startsWith('image/')) {
        setError('Lütfen geçerli bir fotoğraf dosyası seçin');
        return;
      }
      
      // Dosya boyutu kontrolü (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Fotoğraf boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Dosya tipi kontrolü
      if (!droppedFile.type.startsWith('image/')) {
        setError('Lütfen geçerli bir fotoğraf dosyası seçin');
        return;
      }
      
      // Dosya boyutu kontrolü (5MB)
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('Fotoğraf boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleProcessPhoto = async () => {
    if (!file) {
      setError('Lütfen bir fotoğraf seçin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', 'remove-bg');
      
      const response = await fetch('/api/photo/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fotoğraf işlenirken bir hata oluştu');
      }

      const data = await response.json();
      setProcessedImage(data.processedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold">Arka Plan Kaldırma</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Fotoğraf Yükleme Alanı */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          >
            {file ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Yüklenen fotoğraf"
                  className="max-w-xs mx-auto rounded"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(undefined);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  Fotoğrafı Kaldır
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-gray-500">
                  Fotoğrafınızı buraya sürükleyin veya
                  <label className="ml-1 text-primary cursor-pointer hover:text-primary-dark">
                    bilgisayarınızdan seçin
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-400">
                  Maksimum dosya boyutu: 5MB
                  <br />
                  Desteklenen formatlar: JPG, PNG
                </p>
              </div>
            )}
          </div>

          {/* İşlem Butonu */}
          <div className="flex justify-center">
            <button
              onClick={handleProcessPhoto}
              disabled={!file || loading}
              className={`px-6 py-3 rounded-lg font-medium ${
                !file || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </span>
              ) : (
                'Arka Planı Kaldır'
              )}
            </button>
          </div>

          {/* Hata Mesajı */}
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
        </div>

        {/* Sonuç Görüntüsü */}
        <div className="space-y-6">
          {processedImage && (
            <div className="space-y-4">
              <h3 className="font-medium">İşlenmiş Fotoğraf</h3>
              <img
                src={processedImage}
                alt="İşlenmiş fotoğraf"
                className="max-w-full rounded"
              />
              <div className="flex justify-center">
                <a
                  href={processedImage}
                  download="cv-fotograf.png"
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
                >
                  Fotoğrafı İndir
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserFeatures {
  gender: 'male' | 'female';
  clothing: string;
  clothingColors: {
    main?: string;
    shirt?: string;
    tie?: string;
  };
  pose: 'classic' | 'slight-angle' | 'confident' | 'lean-in' | 'casual-lean';
  background: 'studio-white' | 'studio-gray' | 'studio-navy' | 'studio-beige' | 'studio-charcoal' | 
              'office-modern' | 'office-executive' | 'garden' | 'urban';
}

export default function PhotoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<'remove-bg' | 'professional-photo'>('remove-bg');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kullanıcı özellikleri için state
  const [features, setFeatures] = useState<UserFeatures>({
    gender: 'male',
    clothing: 'suit',
    clothingColors: {
      main: 'navy-blue'
    },
    pose: 'classic',
    background: 'studio-white'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setProcessedImage(null);
      setError(null);
    }
  };

  const handleFeatureChange = (name: keyof UserFeatures, value: any) => {
    setFeatures(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Lütfen bir fotoğraf seçin');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // Features kontrolü
    if (selectedOption === 'professional-photo') {
      console.log('Gönderilecek özellikler:', features);
      formData.append('features', JSON.stringify(features));
    }

    try {
      const response = await fetch('/api/photo/process', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fotoğraf işlenirken bir hata oluştu');
      }

      const data = await response.json();
      setProcessedImage(data.processedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv_photo.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Fotoğraf indirilirken bir hata oluştu');
    }
  };

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
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">CV Fotoğrafı Hazırlama</h1>
            <p className="mt-2 text-gray-600">
              Profesyonel CV fotoğrafınızı hazırlamak için aşağıdaki seçeneklerden birini kullanın.
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
            <button
              onClick={() => {
                setSelectedOption('remove-bg');
                setSelectedFile(null);
                setPreviewUrl(null);
                setProcessedImage(null);
                setError(null);
              }}
              className={`p-6 border rounded-lg text-left transition-colors ${
                selectedOption === 'remove-bg'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h3 className="text-lg font-medium text-gray-900">Arka Plan Kaldırma</h3>
              <p className="mt-2 text-sm text-gray-500">
                Mevcut fotoğrafınızın arka planını kaldırarak profesyonel bir görünüm elde edin.
              </p>
            </button>

            <button
              onClick={() => {
                setSelectedOption('professional-photo');
                setSelectedFile(null);
                setPreviewUrl(null);
                setProcessedImage(null);
                setError(null);
              }}
              className={`p-6 border rounded-lg text-left transition-colors ${
                selectedOption === 'professional-photo'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h3 className="text-lg font-medium text-gray-900">AI ile Profesyonel Fotoğraf</h3>
              <p className="mt-2 text-sm text-gray-500">
                Yapay zeka ile profesyonel bir CV fotoğrafı oluşturun. Yüzünüzün net göründüğü bir fotoğraf yükleyin.
              </p>
            </button>
          </div>

          {/* Upload Section */}
          {selectedOption === 'professional-photo' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium">Özelliklerinizi Seçin</h3>
              
              <div>
                <label className="block text-sm mb-1">Cinsiyet</label>
                <select
                  value={features.gender}
                  onChange={(e) => handleFeatureChange('gender', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Kıyafet Stili</label>
                <select
                  value={features.clothing}
                  onChange={(e) => handleFeatureChange('clothing', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {features.gender === 'male' ? (
                    <>
                      <option value="suit">Takım Elbise</option>
                      <option value="blazer-full">Blazer + Gömlek + Kravat</option>
                      <option value="blazer-casual">Blazer + Gömlek</option>
                      <option value="shirt-tie">Gömlek + Kravat</option>
                      <option value="shirt-casual">Sadece Gömlek</option>
                    </>
                  ) : (
                    <>
                      <option value="blazer-suit">Blazer Takım</option>
                      <option value="blazer-blouse">Blazer + Bluz</option>
                      <option value="dress">Şık Elbise</option>
                      <option value="blouse-pro">Profesyonel Bluz</option>
                      <option value="blouse-casual">Business Casual Bluz</option>
                    </>
                  )}
                </select>
              </div>

              {/* Ana Kıyafet Rengi */}
              {(features.clothing === 'suit' || 
                features.clothing === 'blazer-suit' || 
                features.clothing === 'dress' || 
                features.clothing.startsWith('blazer')) && (
                <div>
                  <label className="block text-sm mb-1">
                    {features.clothing === 'dress' ? 'Elbise Rengi' : 
                     features.clothing.includes('blazer') ? 'Ceket Rengi' : 
                     'Takım Rengi'}
                  </label>
                  <select
                    value={features.clothingColors.main}
                    onChange={(e) => handleFeatureChange('clothingColors', {
                      ...features.clothingColors,
                      main: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    {features.gender === 'male' ? (
                      <>
                        <option value="navy-blue">Lacivert</option>
                        <option value="black">Siyah</option>
                        <option value="charcoal">Antrasit Gri</option>
                        <option value="dark-blue">Koyu Mavi</option>
                        <option value="brown">Kahverengi</option>
                        <option value="grey">Gri</option>
                        <option value="burgundy">Bordo</option>
                        <option value="dark-green">Koyu Yeşil</option>
                      </>
                    ) : (
                      <>
                        <option value="navy-blue">Lacivert</option>
                        <option value="black">Siyah</option>
                        <option value="grey">Gri</option>
                        <option value="burgundy">Bordo</option>
                        <option value="dark-green">Koyu Yeşil</option>
                        <option value="taupe">Vizon</option>
                        <option value="beige">Bej</option>
                        <option value="petrol-blue">Petrol Mavisi</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {/* Gömlek/Bluz Rengi */}
              {(features.clothing.includes('shirt') || 
                features.clothing.includes('blouse') || 
                features.clothing.includes('blazer')) && (
                <div>
                  <label className="block text-sm mb-1">
                    {features.gender === 'male' ? 'Gömlek Rengi' : 'Bluz Rengi'}
                  </label>
                  <select
                    value={features.clothingColors.shirt}
                    onChange={(e) => handleFeatureChange('clothingColors', {
                      ...features.clothingColors,
                      shirt: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="white">Beyaz</option>
                    <option value="light-blue">Açık Mavi</option>
                    <option value="light-pink">Açık Pembe</option>
                    <option value="cream">Krem</option>
                    <option value="light-grey">Açık Gri</option>
                    <option value="lavender">Lila</option>
                    <option value="mint">Mint</option>
                    <option value="powder-blue">Bebe Mavisi</option>
                  </select>
                </div>
              )}

              {/* Kravat Rengi */}
              {(features.gender === 'male' && 
                (features.clothing === 'blazer-full' || 
                 features.clothing === 'shirt-tie')) && (
                <div>
                  <label className="block text-sm mb-1">Kravat Rengi</label>
                  <select
                    value={features.clothingColors.tie}
                    onChange={(e) => handleFeatureChange('clothingColors', {
                      ...features.clothingColors,
                      tie: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="navy-blue">Lacivert</option>
                    <option value="burgundy">Bordo</option>
                    <option value="grey">Gri</option>
                    <option value="black">Siyah</option>
                    <option value="blue">Mavi</option>
                    <option value="green">Yeşil</option>
                    <option value="red">Kırmızı</option>
                    <option value="purple">Mor</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm mb-1">Poz</label>
                <select
                  value={features.pose}
                  onChange={(e) => handleFeatureChange('pose', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="classic">Klasik Portre</option>
                  <option value="slight-angle">Hafif Açılı</option>
                  <option value="confident">Özgüvenli Duruş</option>
                  <option value="lean-in">Öne Eğilimli</option>
                  <option value="casual-lean">Rahat Yaslanma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Arka Plan</label>
                <select
                  value={features.background}
                  onChange={(e) => handleFeatureChange('background', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <optgroup label="Stüdyo Arka Planları">
                    <option value="studio-white">Saf Beyaz</option>
                    <option value="studio-gray">Açık Gri</option>
                    <option value="studio-navy">Lacivert</option>
                    <option value="studio-beige">Bej</option>
                    <option value="studio-charcoal">Antrasit</option>
                  </optgroup>
                  <optgroup label="Mekan Arka Planları">
                    <option value="office-modern">Modern Ofis (Bulanık)</option>
                    <option value="office-executive">Yönetici Ofisi (Bulanık)</option>
                    <option value="garden">Bahçe/Doğa (Bulanık)</option>
                    <option value="urban">Şehir Manzarası (Bulanık)</option>
                  </optgroup>
                </select>
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraf Yükle</label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Fotoğraf yükle</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">veya sürükleyip bırakın</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF max 5MB</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {previewUrl && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-2">Orijinal Fotoğraf</h3>
              <div className="relative w-full h-64">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          {processedImage && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-2">İşlenmiş Fotoğraf</h3>
              <div className="relative w-full h-64">
                <Image
                  src={processedImage}
                  alt="Processed"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <button
                onClick={handleDownload}
                className="mt-4 w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded font-medium"
              >
                Fotoğrafı İndir
              </button>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedFile}
              className={`w-full py-2 px-4 rounded ${
                loading || !selectedFile
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium`}
            >
              {loading ? 'İşleniyor...' : 'Fotoğrafı İşle'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 
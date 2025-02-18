'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PhotoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // AI portre özellikleri
  const [mode, setMode] = useState<'remove-bg' | 'ai-portrait'>('remove-bg');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [clothing, setClothing] = useState('suit');
  const [pose, setPose] = useState('classic');
  const [background, setBackground] = useState('studio-white');
  const [clothingColors, setClothingColors] = useState({
    main: 'navy-blue',
    shirt: 'white'
  });

  // Oturum kontrolü
  if (status === 'loading') {
    return <div className="container mx-auto p-8">Yükleniyor...</div>;
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMode = e.target.value as 'remove-bg' | 'ai-portrait';
    console.log('Seçilen mod:', selectedMode);
    setMode(selectedMode);
    
    // AI portre seçildiğinde varsayılan özellikleri ayarla
    if (selectedMode === 'ai-portrait') {
      setGender('male');
      setClothing('suit');
      setPose('classic');
      setBackground('studio-white');
      setClothingColors({
        main: 'navy-blue',
        shirt: 'white'
      });
    }
  };

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

    if (!mode) {
      setError('Lütfen bir işlem modu seçin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', mode);
      
      console.log('Form gönderiliyor:', {
        mode: mode,
        file: file.name,
        formDataMode: formData.get('mode')
      });
      
      // AI portre modu seçiliyse özellikleri ekle
      if (mode === 'ai-portrait') {
        const features = {
          gender,
          clothing: clothing,
          pose: pose,
          background: background,
          clothingColors: clothingColors
        };
        formData.append('features', JSON.stringify(features));
      }

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
      <h1 className="text-3xl font-bold mb-8">CV Fotoğrafı Hazırlama</h1>
      <p className="text-gray-600 mb-8">Profesyonel CV fotoğrafınızı hazırlamak için aşağıdaki seçeneklerden birini kullanın.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* İşlem Modu Seçimi */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="mode"
                  value="remove-bg"
                  checked={mode === 'remove-bg'}
                  onChange={handleModeChange}
                  className="form-radio text-primary mt-1"
                />
                <div>
                  <span className="font-medium block">Arka Plan Kaldırma</span>
                  <span className="text-sm text-gray-600">Mevcut fotoğrafınızın arka planını kaldırarak profesyonel bir görünüm elde edin.</span>
                </div>
              </label>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="mode"
                  value="ai-portrait"
                  checked={mode === 'ai-portrait'}
                  onChange={handleModeChange}
                  className="form-radio text-primary mt-1"
                />
                <div>
                  <span className="font-medium block">AI ile Profesyonel Fotoğraf</span>
                  <span className="text-sm text-gray-600">Yapay zeka ile profesyonel bir CV fotoğrafı oluşturun. Yüzünüzün net göründüğü bir fotoğraf yükleyin.</span>
                </div>
              </label>
            </div>
          </div>

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

          {/* AI Portre Özellikleri */}
          {mode === 'ai-portrait' && (
            <div className="space-y-4">
              <h3 className="font-medium">Fotoğraf Özellikleri</h3>
              
              {/* Cinsiyet Seçimi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Cinsiyet</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                      className="form-radio mr-2"
                    />
                    Erkek
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                      className="form-radio mr-2"
                    />
                    Kadın
                  </label>
                </div>
              </div>

              {/* Kıyafet Seçimi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Kıyafet</label>
                <select
                  value={clothing}
                  onChange={(e) => setClothing(e.target.value)}
                  className="form-select w-full"
                >
                  {gender === 'male' ? (
                    <>
                      <option value="suit">Takım Elbise</option>
                      <option value="blazer-full">Blazer (Kravatlı)</option>
                      <option value="blazer-casual">Blazer (Kravatsız)</option>
                      <option value="shirt-tie">Gömlek ve Kravat</option>
                      <option value="shirt-casual">Gömlek</option>
                    </>
                  ) : (
                    <>
                      <option value="blazer-suit">Blazer Takım</option>
                      <option value="blazer-blouse">Blazer ve Bluz</option>
                      <option value="dress">Elbise</option>
                      <option value="blouse-pro">Profesyonel Bluz</option>
                      <option value="blouse-casual">Günlük Bluz</option>
                    </>
                  )}
                </select>
              </div>

              {/* Poz Seçimi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Poz</label>
                <select
                  value={pose}
                  onChange={(e) => setPose(e.target.value)}
                  className="form-select w-full"
                >
                  <option value="classic">Klasik</option>
                  <option value="slight-angle">Hafif Açılı</option>
                  <option value="confident">Özgüvenli</option>
                  <option value="lean-in">Öne Eğik</option>
                  <option value="casual-lean">Rahat Duruş</option>
                </select>
              </div>

              {/* Arka Plan Seçimi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Arka Plan</label>
                <select
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="form-select w-full"
                >
                  <option value="studio-white">Stüdyo (Beyaz)</option>
                  <option value="studio-gray">Stüdyo (Gri)</option>
                  <option value="studio-navy">Stüdyo (Lacivert)</option>
                  <option value="studio-beige">Stüdyo (Bej)</option>
                  <option value="studio-charcoal">Stüdyo (Antrasit)</option>
                  <option value="office-modern">Modern Ofis</option>
                  <option value="office-executive">Yönetici Ofisi</option>
                  <option value="garden">Bahçe</option>
                  <option value="urban">Şehir</option>
                </select>
              </div>

              {/* Renk Seçimleri */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Renkler</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Ana Renk</label>
                    <select
                      value={clothingColors.main}
                      onChange={(e) => setClothingColors(prev => ({ ...prev, main: e.target.value }))}
                      className="form-select w-full"
                    >
                      <option value="navy-blue">Lacivert</option>
                      <option value="black">Siyah</option>
                      <option value="charcoal">Antrasit</option>
                      <option value="gray">Gri</option>
                      <option value="brown">Kahverengi</option>
                      <option value="burgundy">Bordo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm">Gömlek/Bluz</label>
                    <select
                      value={clothingColors.shirt}
                      onChange={(e) => setClothingColors(prev => ({ ...prev, shirt: e.target.value }))}
                      className="form-select w-full"
                    >
                      <option value="white">Beyaz</option>
                      <option value="light-blue">Açık Mavi</option>
                      <option value="pink">Pembe</option>
                      <option value="cream">Krem</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                'Profesyonel Fotoğraf Oluştur'
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

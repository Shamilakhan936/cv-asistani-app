'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { 
  PhotoFeatures, 
  Gender, 
  Clothing, 
  ClothingOption,
  SuitColor,
  ShirtColor,
  TieColor,
  SweaterColor,
  Pose,
  Background,
  Colors
} from '../../../types/photo';
import {
  MALE_CLOTHING_OPTIONS,
  FEMALE_CLOTHING_OPTIONS,
  SUIT_COLORS,
  SHIRT_COLORS,
  TIE_COLORS,
  SWEATER_COLORS,
  MALE_POSES,
  FEMALE_POSES,
  BACKGROUNDS
} from '../../../constants/photo';

export default function AiileFotoPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  
  // Dosya yükleme state'leri
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // AI portre özellikleri
  const [gender, setGender] = useState<Gender>('male');
  const [clothing, setClothing] = useState<Clothing>('classic-suit');
  const [colors, setColors] = useState<Colors>({
    main: 'navy' as SuitColor,
    shirt: 'white' as ShirtColor,
    tie: 'burgundy' as TieColor,
    sweater: 'smoke' as SweaterColor
  });
  const [pose, setPose] = useState<Pose>('professional');
  const [background, setBackground] = useState<Background>('studio-white');

  // Oturum kontrolü
  if (!isLoaded) {
    return <div className="container mx-auto p-8">Yükleniyor...</div>;
  }

  if (!userId) {
    router.push('/sign-in');
    return null;
  }

  // Aktif kıyafet seçeneklerini al
  const clothingOptions = gender === 'male' ? MALE_CLOTHING_OPTIONS : FEMALE_CLOTHING_OPTIONS;
  const poseOptions = gender === 'male' ? MALE_POSES : FEMALE_POSES;

  // Aktif kıyafet seçeneğinin gereksinimlerini al
  const activeClothing = clothingOptions.find((option: ClothingOption) => option.id === clothing);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Lütfen geçerli bir fotoğraf dosyası seçin');
        return;
      }
      
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
      if (!droppedFile.type.startsWith('image/')) {
        setError('Lütfen geçerli bir fotoğraf dosyası seçin');
        return;
      }
      
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
      formData.append('mode', 'ai-portrait');
      
      const features: PhotoFeatures = {
        gender,
        clothing,
        colors,
        pose,
        background
      };
      formData.append('features', JSON.stringify(features));

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
        <h1 className="text-3xl font-bold">AI ile Fotoğraf İyileştirme</h1>
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

          {/* AI Portre Özellikleri */}
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
                    onChange={(e) => {
                      const newGender = e.target.value as Gender;
                      setGender(newGender);
                      // Kıyafet seçimini sıfırla
                      setClothing('classic-suit');
                      // Renkleri sıfırla
                      setColors({
                        main: 'navy' as SuitColor,
                        shirt: 'white' as ShirtColor,
                        tie: 'burgundy' as TieColor,
                        sweater: 'smoke' as SweaterColor
                      });
                    }}
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
                    onChange={(e) => {
                      const newGender = e.target.value as Gender;
                      setGender(newGender);
                      // Kıyafet seçimini sıfırla
                      setClothing('classic-suit');
                      // Renkleri sıfırla
                      setColors({
                        main: 'navy' as SuitColor,
                        shirt: 'white' as ShirtColor,
                        tie: undefined,
                        sweater: 'smoke' as SweaterColor
                      });
                    }}
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
                onChange={(e) => setClothing(e.target.value as Clothing)}
                className="form-select w-full"
              >
                {clothingOptions.map((option: ClothingOption) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Renk Seçimleri */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Renkler</label>
              <div className="grid grid-cols-1 gap-4">
                {activeClothing?.requiresMainColor && (
                  <div>
                    <label className="block text-sm">Ceket/Takım Rengi</label>
                    <select
                      value={colors.main || ''}
                      onChange={(e) => {
                        const value = e.target.value as SuitColor;
                        setColors(prev => ({ ...prev, main: value }));
                      }}
                      className="form-select w-full"
                    >
                      {SUIT_COLORS.map((color: { value: SuitColor; label: string }) => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {activeClothing?.requiresShirtColor && (
                  <div>
                    <label className="block text-sm">Gömlek/Bluz Rengi</label>
                    <select
                      value={colors.shirt || ''}
                      onChange={(e) => {
                        const value = e.target.value as ShirtColor;
                        setColors(prev => ({ ...prev, shirt: value }));
                      }}
                      className="form-select w-full"
                    >
                      {SHIRT_COLORS.map((color: { value: ShirtColor; label: string }) => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {activeClothing?.requiresTieColor && (
                  <div>
                    <label className="block text-sm">Kravat Rengi</label>
                    <select
                      value={colors.tie || ''}
                      onChange={(e) => {
                        const value = e.target.value as TieColor;
                        setColors(prev => ({ ...prev, tie: value }));
                      }}
                      className="form-select w-full"
                    >
                      {TIE_COLORS.map((color: { value: TieColor; label: string }) => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {activeClothing?.requiresSweaterColor && (
                  <div>
                    <label className="block text-sm">Kazak Rengi</label>
                    <select
                      value={colors.sweater || ''}
                      onChange={(e) => {
                        const value = e.target.value as SweaterColor;
                        setColors(prev => ({ ...prev, sweater: value }));
                      }}
                      className="form-select w-full"
                    >
                      {SWEATER_COLORS.map((color: { value: SweaterColor; label: string }) => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Poz Seçimi */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Poz</label>
              <div className="grid grid-cols-1 gap-3">
                {poseOptions.map((poseOption) => (
                  <label
                    key={poseOption.id}
                    className={`relative flex p-4 cursor-pointer rounded-lg border ${
                      pose === poseOption.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pose"
                      value={poseOption.id}
                      checked={pose === poseOption.id}
                      onChange={(e) => setPose(e.target.value as Pose)}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {poseOption.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {poseOption.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Arka Plan Seçimi */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Arka Plan</label>
              <select
                value={background}
                onChange={(e) => setBackground(e.target.value as Background)}
                className="form-select w-full"
              >
                {BACKGROUNDS.map((bg: { value: Background; label: string }) => (
                  <option key={bg.value} value={bg.value}>
                    {bg.label}
                  </option>
                ))}
              </select>
            </div>
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
                'Fotoğrafı İyileştir'
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

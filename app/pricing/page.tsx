'use client';

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface PricingPlan {
  id: string;
  type: 'PHOTO' | 'CV';
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const photoPlans: PricingPlan[] = [
  {
    id: 'photo-basic',
    type: 'PHOTO',
    name: 'Temel Paket',
    price: 199,
    description: '1 poz seçimi ile 10 profesyonel fotoğraf',
    features: [
      '1 poz seçim hakkı',
      '10 AI destekli profesyonel fotoğraf',
      'Yüksek çözünürlüklü çıktılar',
      'Sınırsız indirme hakkı',
      '30 gün saklama süresi'
    ]
  },
  {
    id: 'photo-standard',
    type: 'PHOTO',
    name: 'Standart Paket',
    price: 499,
    description: '3 poz seçimi ile 30 profesyonel fotoğraf',
    features: [
      '3 poz seçim hakkı',
      '30 AI destekli profesyonel fotoğraf',
      'Yüksek çözünürlüklü çıktılar',
      'Sınırsız indirme hakkı',
      '60 gün saklama süresi',
      'Öncelikli işlem'
    ],
    popular: true
  },
  {
    id: 'photo-premium',
    type: 'PHOTO',
    name: 'Premium Paket',
    price: 799,
    description: '5 poz seçimi ile 50 profesyonel fotoğraf',
    features: [
      '5 poz seçim hakkı',
      '50 AI destekli profesyonel fotoğraf',
      'Yüksek çözünürlüklü çıktılar',
      'Sınırsız indirme hakkı',
      '90 gün saklama süresi',
      'Öncelikli işlem',
      'Özel asistan desteği'
    ]
  }
];

const cvPlans: PricingPlan[] = [
  {
    id: 'cv-weekly',
    type: 'CV',
    name: 'Haftalık Plan',
    price: 49,
    description: '1 haftalık sınırsız CV oluşturma ve optimizasyon',
    features: [
      'Sınırsız CV oluşturma',
      'AI destekli CV optimizasyonu',
      'Profesyonel şablonlar',
      'PDF ve Word formatında indirme',
      '7/24 destek'
    ]
  },
  {
    id: 'cv-monthly',
    type: 'CV',
    name: 'Aylık Plan',
    price: 149,
    description: '1 aylık sınırsız CV oluşturma ve optimizasyon',
    features: [
      'Sınırsız CV oluşturma',
      'AI destekli CV optimizasyonu',
      'Premium şablonlar',
      'Tüm formatlarda indirme',
      'Öncelikli destek',
      'LinkedIn optimizasyonu'
    ],
    popular: true
  },
  {
    id: 'cv-quarterly',
    type: 'CV',
    name: '3 Aylık Plan',
    price: 349,
    description: '3 aylık sınırsız CV oluşturma ve optimizasyon',
    features: [
      'Sınırsız CV oluşturma',
      'AI destekli CV optimizasyonu',
      'Premium şablonlar',
      'Tüm formatlarda indirme',
      'VIP destek',
      'LinkedIn optimizasyonu',
      'Kariyer danışmanlığı'
    ]
  }
];

export default function PricingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [selectedCVId, setSelectedCVId] = useState<string | null>(null);

  const selectedPhotoPrice = photoPlans.find(plan => plan.id === selectedPhotoId)?.price || 0;
  const selectedCVPrice = cvPlans.find(plan => plan.id === selectedCVId)?.price || 0;
  const totalPrice = selectedPhotoPrice + selectedCVPrice;

  const togglePhotoSelection = (planId: string) => {
    setSelectedPhotoId(current => current === planId ? null : planId);
  };

  const toggleCVSelection = (planId: string) => {
    setSelectedCVId(current => current === planId ? null : planId);
  };

  const handlePurchase = () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (!selectedPhotoId && !selectedCVId) {
      alert('Lütfen en az bir plan seçin');
      return;
    }

    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Fiyatlandırma
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Fotoğraf ve CV planlarını birlikte alarak tasarruf edin
          </p>
        </div>

        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Fotoğraf Planları */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Fotoğraf Planınızı Seçin</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {photoPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => togglePhotoSelection(plan.id)}
                    className={`relative rounded-lg p-6 cursor-pointer transition-all ${
                      selectedPhotoId === plan.id
                        ? 'bg-indigo-50 border-2 border-indigo-600'
                        : 'border border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                        <span className="bg-indigo-600 text-white px-3 py-1 text-sm font-semibold rounded-full">
                          Popüler
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                      <p className="mt-4 text-3xl font-bold text-gray-900">{plan.price}₺</p>
                      <ul className="mt-6 space-y-3 text-sm text-gray-500">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-indigo-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6">
                        <span className={`inline-flex items-center text-sm font-medium ${
                          selectedPhotoId === plan.id
                            ? 'text-indigo-600'
                            : 'text-gray-500'
                        }`}>
                          {selectedPhotoId === plan.id ? 'Seçili (İptal etmek için tıklayın)' : 'Seçmek için tıklayın'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CV Planları */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. CV Planınızı Seçin</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cvPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => toggleCVSelection(plan.id)}
                    className={`relative rounded-lg p-6 cursor-pointer transition-all ${
                      selectedCVId === plan.id
                        ? 'bg-indigo-50 border-2 border-indigo-600'
                        : 'border border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                        <span className="bg-indigo-600 text-white px-3 py-1 text-sm font-semibold rounded-full">
                          Popüler
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                      <p className="mt-4 text-3xl font-bold text-gray-900">{plan.price}₺</p>
                      <ul className="mt-6 space-y-3 text-sm text-gray-500">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-indigo-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6">
                        <span className={`inline-flex items-center text-sm font-medium ${
                          selectedCVId === plan.id
                            ? 'text-indigo-600'
                            : 'text-gray-500'
                        }`}>
                          {selectedCVId === plan.id ? 'Seçili (İptal etmek için tıklayın)' : 'Seçmek için tıklayın'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seçim Özeti ve Satın Alma */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="max-w-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Seçilen Planlar</h3>
                  <div className="mt-1">
                    {selectedPhotoId && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                        {photoPlans.find(p => p.id === selectedPhotoId)?.name} - {selectedPhotoPrice}₺
                      </div>
                    )}
                    {selectedCVId && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                        {cvPlans.find(p => p.id === selectedCVId)?.name} - {selectedCVPrice}₺
                      </div>
                    )}
                    {!selectedPhotoId && !selectedCVId && (
                      <p className="text-sm text-gray-500 italic">Henüz plan seçilmedi</p>
                    )}
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-600">Toplam Tutar</p>
                  <p className="text-3xl font-bold text-indigo-600 mb-3">{totalPrice}₺</p>
                  <button
                    onClick={handlePurchase}
                    className={`px-8 py-3 rounded-lg text-white font-semibold transition-colors ${
                      totalPrice > 0
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={totalPrice === 0}
                  >
                    {isSignedIn ? 'Satın Al' : 'Giriş Yap ve Satın Al'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
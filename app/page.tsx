'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/outline';

const photoPlans = [
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
    popular: true,
    features: [
      '3 poz seçim hakkı',
      '30 AI destekli profesyonel fotoğraf',
      'Yüksek çözünürlüklü çıktılar',
      'Sınırsız indirme hakkı',
      '60 gün saklama süresi',
      'Öncelikli işlem'
    ]
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

const cvPlans = [
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
    popular: true,
    features: [
      'Sınırsız CV oluşturma',
      'AI destekli CV optimizasyonu',
      'Premium şablonlar',
      'Tüm formatlarda indirme',
      'Öncelikli destek',
      'LinkedIn optimizasyonu'
    ]
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

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const templates = [
    "/images/cv-template-1.jpg",
    "/images/cv-template-2.jpg",
    "/images/cv-template-3.jpg",
    "/images/cv-template-4.jpg"
  ];

  const nextTemplate = () => {
    setCurrentTemplate((prev) => (prev + 1) % templates.length);
  };

  const prevTemplate = () => {
    setCurrentTemplate((prev) => (prev - 1 + templates.length) % templates.length);
  };

  const openImagePreview = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <nav className="w-full h-24">
          <div className="flex items-center justify-between h-full px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-60 h-20 relative flex items-center">
                <svg
                  viewBox="0 0 280 80"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#6366f1' }} />
                      <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Sol taraftaki minimal sembol */}
                  <g transform="translate(20, 20)">
                    <path
                      d="M0 20 L20 0 L40 20 L20 40 Z"
                      fill="url(#logoGradient)"
                      className="drop-shadow-sm"
                    />
                    <circle cx="20" cy="20" r="8" fill="white"/>
                  </g>
                  
                  {/* CV Asistanı Yazısı */}
                  <text
                    x="80"
                    y="45"
                    fill="#1f2937"
                    fontSize="30"
                    fontFamily="var(--font-sora)"
                    fontWeight="600"
                    letterSpacing="0"
                  >
                    CV Asistanı
                  </text>
                  
                  {/* AI POWERED Yazısı */}
                  <text
                    x="82"
                    y="65"
                    fill="#6b7280"
                    fontSize="11"
                    fontFamily="var(--font-sora)"
                    letterSpacing="0.2em"
                    fontWeight="500"
                  >
                    AI POWERED
                  </text>
                </svg>
              </div>
            </Link>

            {/* Ana Menü */}
            <div className="hidden md:flex items-center gap-12">
              <button onClick={() => document.getElementById('ai-photo')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-700 hover:text-[#6366f1] font-medium text-lg transition-all hover:scale-105">
                AI Fotoğraf Stüdyosu
              </button>
              <button onClick={() => document.getElementById('cv-builder')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-700 hover:text-[#6366f1] font-medium text-lg transition-all hover:scale-105">
                CV Oluştur
              </button>
              <button onClick={() => document.getElementById('job-optimizer')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-700 hover:text-[#6366f1] font-medium text-lg transition-all hover:scale-105">
                İlan Bazlı CV Optimizasyonu
              </button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-700 hover:text-[#6366f1] font-medium text-lg transition-all hover:scale-105">
                Fiyatlar
              </button>
            </div>

            {/* Giriş ve Kayıt */}
            <div className="flex items-center gap-6">
              <Link
                href="/sign-in"
                className="text-lg font-medium text-gray-700 hover:text-[#6366f1] transition-all hover:scale-105"
              >
                Giriş Yap
              </Link>
              <Link
                href="/sign-up"
                className="text-lg font-medium px-8 py-3 rounded-xl text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105"
              >
                Hemen Başla
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeImagePreview}>
          <div className="relative max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeImagePreview}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={selectedImage}
              alt="Preview"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      <main className="flex-grow">
      {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#6366f1]/5 via-white to-white">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] inline-block text-transparent bg-clip-text">
                Yapay Zeka ile Mükemmel CV'ler Oluşturun
            </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                İş başvurularınız için tam paket çözüm: AI portre stüdyosu ile profesyonel fotoğraflar, ATS onaylı CV şablonları ve iş ilanına özel akıllı optimizasyonlar.
              </p>
              
              <div className="mt-20 mb-12">
                <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] inline-block text-transparent bg-clip-text">Çözümlerimiz</h2>
                <p className="mt-4 text-xl text-gray-600">İş başvurularınız için ihtiyacınız olan her şey</p>
              </div>
              
              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100/50 group">
                  <div className="h-14 w-14 bg-gradient-to-br from-[#818cf8] to-[#6366f1] rounded-xl flex items-center justify-center mb-6 mx-auto transform rotate-3 group-hover:rotate-6 transition-transform">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Fotoğraf Stüdyosu</h3>
                  <p className="text-gray-600">
                    Profesyonel fotoğrafçıya gitmenize gerek yok. Kendi fotoğrafınızı yükleyin, yapay zeka teknolojimiz ile profesyonel portre fotoğrafınızı oluşturun.
                  </p>
                </div>
                <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100/50 group">
                  <div className="h-14 w-14 bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] rounded-xl flex items-center justify-center mb-6 mx-auto transform -rotate-3 group-hover:-rotate-6 transition-transform">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">CV Oluşturucu</h3>
                  <p className="text-gray-600">
                    Modern ve ATS dostu şablonlarımızla profesyonel bir CV oluşturun. Yapay zeka destekli içerik önerileriyle başvurunuzu güçlendirin.
                  </p>
                </div>
                <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100/50 group">
                  <div className="h-14 w-14 bg-gradient-to-br from-[#e879f9] to-[#d946ef] rounded-xl flex items-center justify-center mb-6 mx-auto transform rotate-3 group-hover:rotate-6 transition-transform">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">İlan Bazlı CV Optimizasyonu</h3>
                  <p className="text-gray-600">
                    İş ilanı linkini yapıştırın, yapay zeka CV'nizi analiz etsin ve başvurunuzu ilana göre optimize etsin. Başvurularınızın öne çıkmasını sağlayın.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(70% 70% at 50% 50%,rgba(99,102,241,0.075) 0%,rgba(255,255,255,0) 100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(50% 50% at 25% 25%,rgba(139,92,246,0.05) 0%,rgba(255,255,255,0) 100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(35% 35% at 75% 75%,rgba(217,70,239,0.05) 0%,rgba(255,255,255,0) 100%)]" />
        </section>

        {/* AI Fotoğraf Stüdyosu Features */}
        <section id="ai-photo" className="py-24 bg-gradient-to-b from-white via-[#6366f1]/5 to-white scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] to-[#818cf8] inline-block text-transparent bg-clip-text">
                  AI Fotoğraf Stüdyosu
                </h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                  Profesyonel fotoğrafçıya gitmenize gerek yok. Sadece telefonunuzla çekilmiş 5-6 selfie yeterli. 
                  Yapay zeka teknolojimiz ile profesyonel portre fotoğraflarınızı oluşturun.
                </p>

                {/* Adım 1 */}
                <div className="mb-8 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#818cf8] to-[#6366f1] flex items-center justify-center text-white font-bold transform group-hover:rotate-6 transition-transform">
                      1
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-[#6366f1] transition-colors">Selfie'lerinizi Yükleyin</h3>
                  </div>
                  <p className="text-gray-600 ml-16 leading-relaxed">
                    5-6 farklı selfie fotoğrafınızı yükleyin. Farklı açılardan ve doğal ışıkta çekilmiş selfie'ler en iyi sonucu verir.
                  </p>
                </div>

                {/* Adım 2 */}
                <div className="mb-8 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center text-white font-bold transform group-hover:-rotate-6 transition-transform">
                      2
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-[#8b5cf6] transition-colors">Tarzınızı Seçin</h3>
                  </div>
                  <p className="text-gray-600 ml-16 leading-relaxed">
                    Hazır kıyafet seçenekleri ve profesyonel arka planlar arasından size uygun olanı belirleyin.
                  </p>
                </div>

                {/* Adım 3 */}
                <div className="mb-8 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e879f9] to-[#d946ef] flex items-center justify-center text-white font-bold transform group-hover:rotate-6 transition-transform">
                      3
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-[#d946ef] transition-colors">Sonuçları İndirin</h3>
                  </div>
                  <p className="text-gray-600 ml-16 leading-relaxed">
                    Yapay zeka sizin için özel bir model oluşturur. 2 saat içinde fotoğraflarınız hazır olacak ve sistemden indirebileceksiniz.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8">
                {/* Üstteki iki küçük görsel */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative group cursor-pointer"
                       onClick={() => openImagePreview("/images/ai-photo-step1.jpg")}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image
                      src="/images/ai-photo-step1.jpg"
                      alt="Selfie Yükleme"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative group cursor-pointer"
                       onClick={() => openImagePreview("/images/ai-photo-step2.jpg")}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image
                      src="/images/ai-photo-step2.jpg"
                      alt="Tarz Seçimi"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                {/* Alttaki büyük görsel */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative group cursor-pointer"
                     onClick={() => openImagePreview("/images/ai-photo-step3.jpg")}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d946ef]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src="/images/ai-photo-step3.jpg"
                    alt="Sonuç Fotoğrafı"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CV Oluşturucu Features */}
        <section id="cv-builder" className="py-24 bg-gradient-to-b from-white via-[#8b5cf6]/5 to-white scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                {/* Şablon Galerisi */}
                <div className="relative group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-xl cursor-pointer"
                       onClick={() => openImagePreview(templates[currentTemplate])}>
                    <Image
                      src={templates[currentTemplate]}
                      alt="Modern CV Şablonu"
                      width={600}
                      height={450}
                      className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {/* Navigasyon Okları */}
                  <button 
                    onClick={prevTemplate}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/90 hover:bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-20">
                    <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextTemplate}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/90 hover:bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-20">
                    <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {/* Şablon Küçük Resimleri */}
                  <div className="flex justify-center gap-3 mt-6">
                    {templates.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTemplate(index)}
                        className={`w-2.5 h-2.5 rounded-full transform hover:scale-150 transition-transform ${
                          currentTemplate === index ? 'bg-[#8b5cf6]' : 'bg-gray-300 hover:bg-[#8b5cf6]/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] inline-block text-transparent bg-clip-text">
                  CV Oluşturucu
                </h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                  Kullanıcı dostu arayüzümüz ile hızlıca profesyonel CV'nizi oluşturun.
                </p>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center transform group-hover:-rotate-6 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg group-hover:text-[#8b5cf6] transition-colors">ATS dostu modern şablonlar</span>
                  </li>
                  <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center transform group-hover:-rotate-6 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg group-hover:text-[#8b5cf6] transition-colors">Kolay ve kullanıcı dostu bilgi girişi</span>
                  </li>
                  <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center transform group-hover:-rotate-6 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg group-hover:text-[#8b5cf6] transition-colors">PDF ve resim formatında indirme</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* İlan Bazlı CV Optimizasyonu Features */}
        <section id="job-optimizer" className="py-24 bg-gradient-to-b from-white via-[#d946ef]/5 to-white scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#d946ef] to-[#e879f9] inline-block text-transparent bg-clip-text">
                  İlan Bazlı CV Optimizasyonu
                </h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                  İş ilanı linkini yapıştırın, yapay zeka CV'nizi analiz etsin ve 
                  başvurunuzu ilana göre optimize etsin. Başvuru başarı şansınızı artırın.
                </p>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e879f9] to-[#d946ef] flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg group-hover:text-[#d946ef] transition-colors">İlan analizi ve CV uyumlaştırma</span>
                  </li>
                  <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e879f9] to-[#d946ef] flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg group-hover:text-[#d946ef] transition-colors">ATS uyumluluk kontrolü</span>
                  </li>
                  <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e879f9] to-[#d946ef] flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg group-hover:text-[#d946ef] transition-colors">İlana özel CV düzenleme</span>
                  </li>
                </ul>
              </div>
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl cursor-pointer"
                     onClick={() => openImagePreview("/images/job-matcher-feature-detail.jpg")}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d946ef]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <Image
                    src="/images/job-matcher-feature-detail.jpg"
                    alt="İlan Bazlı CV Optimizasyonu"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                {/* Dekoratif elementler */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#e879f9]/30 to-[#d946ef]/30 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#d946ef]/20 to-[#e879f9]/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Fiyatlandırma Bölümü */}
        <section id="pricing" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Fiyatlandırma
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                Fotoğraf ve CV planlarını birlikte alarak tasarruf edin
              </p>
            </div>

            {/* Fotoğraf Planları */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Fotoğraf Planları
              </h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {photoPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="relative rounded-2xl shadow-xl overflow-hidden transition-all duration-200 hover:scale-105"
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 text-sm font-semibold">
                        Popüler
                      </div>
                    )}
                    <div className="bg-white p-8">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {plan.name}
                      </h3>
                      <p className="mt-2 text-gray-500">{plan.description}</p>
                      <p className="mt-4">
                        <span className="text-4xl font-extrabold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-base font-medium text-gray-500">
                          ₺
                        </span>
                      </p>
                      <ul className="mt-6 space-y-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckIcon
                              className="h-6 w-6 text-green-500 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="ml-3 text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/pricing"
                        className="mt-8 block w-full py-3 px-4 rounded-md text-center font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Planı Seç
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CV Planları */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                CV Planları
              </h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {cvPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="relative rounded-2xl shadow-xl overflow-hidden transition-all duration-200 hover:scale-105"
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 text-sm font-semibold">
                        Popüler
                      </div>
                    )}
                    <div className="bg-white p-8">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {plan.name}
                      </h3>
                      <p className="mt-2 text-gray-500">{plan.description}</p>
                      <p className="mt-4">
                        <span className="text-4xl font-extrabold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-base font-medium text-gray-500">
                          ₺
                        </span>
                      </p>
                      <ul className="mt-6 space-y-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckIcon
                              className="h-6 w-6 text-green-500 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="ml-3 text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/pricing"
                        className="mt-8 block w-full py-3 px-4 rounded-md text-center font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Planı Seç
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-100/50">
        <div className="container py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 bg-gradient-to-r from-[#6366f1] to-[#818cf8] bg-clip-text text-transparent">CV</h3>
              <ul className="space-y-2.5">
                <li><a href="/cv-olustur" className="text-gray-600 hover:text-[#6366f1] transition-colors">CV Oluştur</a></li>
                <li><a href="/cv-ornekleri" className="text-gray-600 hover:text-[#6366f1] transition-colors">CV Örnekleri</a></li>
                <li><a href="/cv-sablonlari" className="text-gray-600 hover:text-[#6366f1] transition-colors">CV Şablonları</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] bg-clip-text text-transparent">Fotoğraf</h3>
              <ul className="space-y-2.5">
                <li><a href="/fotograf-olustur" className="text-gray-600 hover:text-[#8b5cf6] transition-colors">Fotoğraf Oluştur</a></li>
                <li><a href="/fotograf-duzenle" className="text-gray-600 hover:text-[#8b5cf6] transition-colors">Fotoğraf Düzenle</a></li>
                <li><a href="/linkedin-fotograf" className="text-gray-600 hover:text-[#8b5cf6] transition-colors">LinkedIn Fotoğraf</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 bg-gradient-to-r from-[#a78bfa] to-[#d946ef] bg-clip-text text-transparent">Araçlar</h3>
              <ul className="space-y-2.5">
                <li><a href="/ilan-analizi" className="text-gray-600 hover:text-[#a78bfa] transition-colors">İlan Analizi</a></li>
                <li><a href="/mulakat-sorulari" className="text-gray-600 hover:text-[#a78bfa] transition-colors">Mülakat Soruları</a></li>
                <li><a href="/on-yazi" className="text-gray-600 hover:text-[#a78bfa] transition-colors">Ön Yazı Oluşturucu</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 bg-gradient-to-r from-[#d946ef] to-[#e879f9] bg-clip-text text-transparent">Destek</h3>
              <ul className="space-y-2.5">
                <li><a href="/yardim" className="text-gray-600 hover:text-[#d946ef] transition-colors">Yardım Merkezi</a></li>
                <li><a href="/gizlilik" className="text-gray-600 hover:text-[#d946ef] transition-colors">Gizlilik Politikası</a></li>
                <li><a href="/kullanim-kosullari" className="text-gray-600 hover:text-[#d946ef] transition-colors">Kullanım Koşulları</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100/50 mt-12 pt-8 text-center">
            <p className="text-gray-600">© 2024 CV Asistanı. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

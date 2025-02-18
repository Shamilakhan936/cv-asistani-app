'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

// Stil seçenekleri için tip tanımı
interface Style {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  details: {
    usage: string;
    clothing: string;
    pose: string;
    background: string;
  };
}

// Stiller
const STYLES: Style[] = [
  {
    id: 'professional',
    name: 'Profesyonel (Resmi & Klasik)',
    description: 'Bankacılık, hukuk ve üst düzey yöneticilik pozisyonları için ideal.',
    previewImage: '/images/styles/professional.jpg',
    details: {
      usage: 'Bankacılık, hukuk, üst düzey yöneticilik, kurumsal firmalar',
      clothing: 'Erkekler için koyu renk takım elbise, gömlek ve kravat. Kadınlar için klasik blazer ceket ve bluz/gömlek.',
      pose: 'Dik, ciddi ve güven veren bakış',
      background: 'Nötr veya koyu renk'
    }
  },
  {
    id: 'business-casual',
    name: 'Business Casual (Yarı Resmi & Ofis)',
    description: 'Ofis ortamı ve kurumsal pozisyonlar için modern ve profesyonel.',
    previewImage: '/images/styles/business-casual.jpg',
    details: {
      usage: 'Muhasebe, insan kaynakları, mühendislik, pazarlama, eğitim sektörü',
      clothing: 'Erkekler için kravat olmadan gömlek ve ceket. Kadınlar için şık ancak resmi olmayan bluz ve blazer.',
      pose: 'Hafif gülümseme olabilir, rahat ama profesyonel görünüm',
      background: 'Açık renkli veya ofis ortamına uygun'
    }
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual (Şık & Rahat)',
    description: 'Modern ve dinamik iş ortamları için rahat ama profesyonel.',
    previewImage: '/images/styles/smart-casual.jpg',
    details: {
      usage: 'Teknoloji, girişimcilik, yaratıcı sektörler, start-up şirketleri',
      clothing: 'Erkekler için düğmeli gömlek veya polo yaka tişört + blazer. Kadınlar için rahat ancak şık kazak, blazer veya elbise.',
      pose: 'Dinamik ve enerjik, samimi gülümseme',
      background: 'Açık renk, doğal ışık tercih edilebilir'
    }
  },
  {
    id: 'creative',
    name: 'Yaratıcı & Sanatsal',
    description: 'Yaratıcı sektörler için özgün ve etkileyici.',
    previewImage: '/images/styles/creative.jpg',
    details: {
      usage: 'Grafik tasarım, moda, reklamcılık, medya, fotoğrafçılık',
      clothing: 'Kişiliği yansıtan özgün seçimler, renkli veya desenli kıyafetler',
      pose: 'Farklı açılar, hafif eğimli pozlar, rahat ve özgüvenli duruş',
      background: 'Renkli ve sanatsal olabilir'
    }
  },
  {
    id: 'tech-startup',
    name: 'Teknoloji & Start-up',
    description: 'Modern teknoloji şirketleri ve start-up\'lar için ideal.',
    previewImage: '/images/styles/tech-startup.jpg',
    details: {
      usage: 'Yazılım, mühendislik, teknoloji firmaları, start-up dünyası',
      clothing: 'Erkekler için sade t-shirt + blazer veya rahat gömlek. Kadınlar için rahat ancak modern kesimli kıyafetler.',
      pose: 'Rahat, enerjik ve yenilikçi pozlar',
      background: 'Modern ofis, açık ofis alanı, doğal ışık tercih edilebilir'
    }
  },
  {
    id: 'executive',
    name: 'Kurumsal Executive',
    description: 'Üst düzey yönetici pozisyonları için güçlü ve profesyonel.',
    previewImage: '/images/styles/executive.jpg',
    details: {
      usage: 'CEO, CFO, müdürler, yönetici pozisyonları',
      clothing: 'Erkekler için koyu renk takım elbise, klasik kravat. Kadınlar için zarif blazer ve klasik gömlek.',
      pose: 'Ciddi, güçlü ve lider duruş',
      background: 'Koyu tonlar, profesyonel stüdyo çekimi'
    }
  },
  {
    id: 'freelancer',
    name: 'Freelancer & Girişimci',
    description: 'Serbest çalışanlar ve girişimciler için modern ve güvenilir.',
    previewImage: '/images/styles/freelancer.jpg',
    details: {
      usage: 'Serbest çalışanlar, girişimciler, influencer\'lar',
      clothing: 'Günlük ama güven veren bir tarz, rahat ve özgüvenli kıyafetler',
      pose: 'Hafif gülümseme, sıcak ve samimi hava',
      background: 'Doğal ışık, sade bir ofis veya dış mekân'
    }
  },
  {
    id: 'academic',
    name: 'Akademik & Bilimsel',
    description: 'Akademik ve bilimsel çalışmalar için profesyonel ve güvenilir.',
    previewImage: '/images/styles/academic.jpg',
    details: {
      usage: 'Akademisyenler, araştırmacılar, bilim insanları',
      clothing: 'Yarı resmi, sade gömlek veya ceket',
      pose: 'Ciddi ama dostane, bilgili ve güvenilir bir hava',
      background: 'Kütüphane, laboratuvar veya sade bir fon'
    }
  },
  {
    id: 'medical',
    name: 'Medikal & Sağlık',
    description: 'Sağlık sektörü profesyonelleri için güven verici ve profesyonel.',
    previewImage: '/images/styles/medical.jpg',
    details: {
      usage: 'Doktorlar, hemşireler, sağlık çalışanları',
      clothing: 'Beyaz önlük veya şık ama sade kıyafetler, cerrahi kıyafetler veya sade bir gömlek/bluz',
      pose: 'Samimi, güven veren bakış',
      background: 'Beyaz veya hastane ortamına uygun'
    }
  },
  {
    id: 'engineering',
    name: 'Mühendislik & Teknik',
    description: 'Teknik sektör profesyonelleri için net ve güvenilir.',
    previewImage: '/images/styles/engineering.jpg',
    details: {
      usage: 'İnşaat, makine, elektrik, yazılım mühendisleri',
      clothing: 'Klasik gömlek veya mühendis yeleği',
      pose: 'Düz ve güven veren poz',
      background: 'Beyaz veya ilgili sektörle alakalı sade bir fon'
    }
  }
];

export default function PhotoSelectionPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // Fotoğraf yükleme state'leri
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canUpload, setCanUpload] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    checkUserStatus();
  }, [isSignedIn, router]);

  const checkUserStatus = async () => {
    try {
      // Kullanıcının bekleyen işlemi var mı kontrol et
      const pendingRes = await fetch('/api/user/photos/pending');
      const pendingData = await pendingRes.json();
      
      if (pendingData) {
        router.push('/dashboard/pending-operation');
        return;
      }

      // Test için abonelik kontrolünü kaldırıyoruz
      setCanUpload(true);
      setLoading(false);
    } catch (error) {
      console.error('Status check error:', error);
      setError('Durum kontrolü sırasında bir hata oluştu');
      setLoading(false);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      addPhotos(files);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/')
      );
      addPhotos(files);
    }
  };

  const addPhotos = (files: File[]) => {
    setSelectedPhotos(prev => [...prev, ...files]);
    
    // Preview URL'leri oluştur
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  // Stil seçimi fonksiyonları
  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev => 
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  // Form gönderme fonksiyonu
  const handleSubmit = async () => {
    if (selectedPhotos.length === 0) {
      alert('Lütfen en az bir fotoğraf yükleyin.');
      return;
    }

    if (selectedStyles.length === 0) {
      alert('Lütfen en az bir stil seçin.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Fotoğrafları storage'a yükle ve URL'leri al
      const uploadPromises = selectedPhotos.map(async (photo) => {
        const formData = new FormData();
        formData.append('file', photo);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Fotoğraf yükleme hatası');
        }

        const { url } = await response.json();
        return { url };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);

      // Fotoğraf işlemi oluştur
      const response = await fetch('/api/photos/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photos: uploadedPhotos,
          styles: selectedStyles,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fotoğraf işlemi oluşturma hatası');
      }

      const { operationId } = await response.json();
      router.push('/dashboard/pending-operation');
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Fotoğraflar kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!canUpload) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Fotoğraf Yükleme İzniniz Yok
              </h2>
              <p className="text-gray-600 mb-6">
                Fotoğraf yükleyebilmek için aktif bir fotoğraf paketi satın almanız gerekmektedir.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Paketleri İncele
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Oturum kontrolü
  if (!isSignedIn || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#6366f1]/5 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6366f1]/5 via-white to-white">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">AI Fotoğraf Stüdyosu</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <p className="text-xl text-gray-600 mb-12 max-w-3xl">
            İş başvurularınız için yüksek kaliteli profesyonel portre fotoğraflarınızı, size özel eğitilmiş yapay zeka modelimiz ile oluşturun.
          </p>

          {/* Fotoğraf Yükleme Bölümü */}
          <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sol: Yükleme Alanı */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Fotoğraflarınızı Yükleyin</h2>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center ${
                    isDragging 
                      ? 'border-[#6366f1] bg-[#6366f1]/5' 
                      : 'border-gray-300 hover:border-[#6366f1]/50'
                  } transition-colors`}
                  onDrop={handlePhotoDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                >
                  <div className="space-y-4">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-gray-600">
                      Fotoğrafları buraya sürükleyin veya
                      <label className="mx-2">
                        <span className="text-[#6366f1] hover:text-[#4f46e5] cursor-pointer"> seçin</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoSelect}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Yüklenen Fotoğraflar */}
                {previewUrls.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt={`Yüklenen fotoğraf ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-lg object-cover w-full h-48"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sağ: Öneriler */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Eğitimi İçin Fotoğraf Gereksinimleri</h3>
                <div className="space-y-6">
                  {/* Minimum Fotoğraf Sayısı */}
                  <div className="bg-[#6366f1]/5 p-4 rounded-lg border border-[#6366f1]/10">
                    <div className="flex items-center gap-2 text-[#6366f1] font-medium mb-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Minimum Gereksinim</span>
                    </div>
                    <p className="text-gray-600">Yapay zeka modelinin eğitimi için en az 5 farklı selfie fotoğrafı yüklemeniz gerekmektedir.</p>
                  </div>

                  {/* Temel Gereksinimler */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Fotoğraf Çekim Önerileri</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#6366f1] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <span className="block font-medium">Işıklandırma</span>
                          <span className="text-gray-600 text-sm">İyi aydınlatılmış bir ortamda, yüz hatlarınızın net görünebildiği dengeli bir ışıkta çekim yapın. Gölgelerin minimum olması önemlidir.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#6366f1] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <span className="block font-medium">Arka Plan</span>
                          <span className="text-gray-600 text-sm">Düz ve açık renkli arka planlar önerilir fakat zorunlu değildir. Dağınık veya dikkat dağıtıcı arka planlardan kaçınılması yeterlidir.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#6366f1] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <span className="block font-medium">Poz ve İfade</span>
                          <span className="text-gray-600 text-sm">Farklı açılardan çekimler yapın: hafif sağa/sola dönük, doğrudan kameraya bakan ve 3/4 profil pozlar tercih edin. İfadeniz doğal olmalı - ciddi, hafif gülümseme veya profesyonel bir gülümseme olabilir. Her pozda boynunuzu uzun tutun ve omuzlarınızı rahat bırakın. Çekimler sırasında gözlerinizin net ve açık olmasına dikkat edin.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Önemli Notlar */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Dikkat Edilmesi Gerekenler</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <span className="block font-medium">Aksesuarlar</span>
                          <span className="text-gray-600 text-sm">Gözlük kullanıyorsanız yansıma yapmadığından emin olun. Şapka ve yüzü kapatan aksesuarlardan kaçının.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <span className="block font-medium">Filtreler ve Düzenlemeler</span>
                          <span className="text-gray-600 text-sm">Fotoğraf filtreleri ve yoğun düzenlemeler kullanmayın. Doğal görünümlü fotoğraflar daha iyi sonuç verir.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <span className="block font-medium">Işık ve Kontrast</span>
                          <span className="text-gray-600 text-sm">Çok karanlık veya aşırı parlak fotoğraflardan kaçının. Yüz hatlarınızın net görünebildiği dengeli bir ışık tercih edin.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Örnek Fotoğraflar */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Örnek Fotoğraflar</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src="/images/examples/example1.jpg"
                          alt="Example 1"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-white text-xs">✓ İdeal ışık ve poz</span>
                        </div>
                      </div>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src="/images/examples/example2.jpg"
                          alt="Example 2"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-white text-xs">✓ Doğru arka plan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stil Seçim Bölümü */}
          <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Stil Seçimi</h2>
            <p className="text-gray-600 mb-8">
              Her seçilen stil için 10 farklı profesyonel fotoğraf oluşturulacaktır.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {STYLES.map((style) => (
                <div
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`group cursor-pointer relative rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedStyles.includes(style.id)
                      ? 'ring-2 ring-[#6366f1] ring-offset-2'
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={style.previewImage}
                      alt={style.name}
                      width={640}
                      height={640}
                      className="group-hover:scale-105 transition-transform duration-300 object-cover w-full h-full"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity ${
                      selectedStyles.includes(style.id) ? 'opacity-70' : 'opacity-0 group-hover:opacity-50'
                    }`} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-medium text-sm">{style.name}</h3>
                    <p className="text-white/80 text-xs mt-1 line-clamp-2">{style.description}</p>
                  </div>
                  {selectedStyles.includes(style.id) && (
                    <div className="absolute top-2 right-2 bg-[#6366f1] text-white p-1 rounded-full">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gönder Butonu */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={selectedPhotos.length === 0 || selectedStyles.length === 0 || loading}
              className={`px-8 py-4 rounded-xl font-medium text-white relative
                ${selectedPhotos.length === 0 || selectedStyles.length === 0 || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105'
                }`}
            >
              {loading ? (
                <>
                  <span className="opacity-0">Fotoğrafları İşlemeye Gönder</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </>
              ) : (
                'Fotoğrafları İşlemeye Gönder'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 
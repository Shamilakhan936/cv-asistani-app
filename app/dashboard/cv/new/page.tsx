'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Arrow left icon as SVG component
const ArrowLeftIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

interface CVTemplate {
  id: string;
  name: string;
  category: string;
  description: string | null;
  previewUrl: string;
  isActive: boolean;
  displayCategory?: string;
}

// Kategori çevirileri
const categoryTranslations: Record<string, string> = {
  'All': 'Tümü',
  'Simple': 'Sade',
  'Creative': 'Yaratıcı',
  'Modern': 'Modern',
  'Professional': 'Profesyonel'
};

// Kategori sıralaması
const categoryOrder = ['Tümü', 'Sade', 'Modern', 'Yaratıcı', 'Profesyonel'];

// Kategori ikonları
const categoryIcons: Record<string, React.ReactNode> = {
  'Tümü': (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  'Sade': (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  ),
  'Modern': (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  'Yaratıcı': (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  'Profesyonel': (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
};

export default function NewCVPage() {
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [groupedTemplates, setGroupedTemplates] = useState<Record<string, CVTemplate[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const router = useRouter();

  const fetchTemplates = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const response = await fetch('/api/cv-templates', {
        cache: forceRefresh ? 'no-store' : 'default',
        headers: forceRefresh ? {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        } : {}
      });
      if (!response.ok) {
        throw new Error('Şablonlar yüklenemedi');
      }
      const data = await response.json();
      
      // Şablonları işle
      const processedTemplates = data.templates.map((template: CVTemplate) => ({
        ...template,
        // Eğer kategori çevirisi varsa kullan, yoksa orijinal kategoriyi kullan
        displayCategory: categoryTranslations[template.category] || template.category
      }));
      
      setTemplates(processedTemplates);
      
      // Şablonları kategorilere göre grupla
      const grouped: Record<string, CVTemplate[]> = {};
      
      // Önce tüm kategorileri oluştur
      categoryOrder.forEach(cat => {
        grouped[cat] = [];
      });
      
      // Şablonları kendi kategorilerine ekle
      processedTemplates.forEach((template: CVTemplate) => {
        const category = template.displayCategory || '';
        if (grouped[category]) {
          grouped[category].push(template);
        }
      });
      
      // "Tümü" kategorisine tüm şablonları ekle
      grouped['Tümü'] = [...processedTemplates];
      
      setGroupedTemplates(grouped);
      
      // Kategorileri istenen sırada ayarla
      const availableCategories = categoryOrder.filter(cat => 
        grouped[cat] && grouped[cat].length > 0
      );
      
      setCategories(availableCategories);
      if (availableCategories.length > 0) {
        setSelectedCategory(availableCategories[0]);
      }
    } catch (error) {
      console.error('Şablonları yükleme hatası:', error);
      toast.error('Şablonlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleRefresh = () => {
    fetchTemplates(true);
    toast.success('Şablonlar yenileniyor...');
  };

  const handleSelectTemplate = (templateId: string) => {
    // Yönlendirme URL'ini dashboard yapısına uygun olarak güncelliyoruz
    router.push(`/dashboard/cv/edit?templateId=${templateId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] inline-block text-transparent bg-clip-text">CV Şablonları</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-gray-100/50">
              <Skeleton className="h-[300px] w-full" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] inline-block text-transparent bg-clip-text">CV Şablonları</h1>
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Henüz hiç şablon bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-10 px-4 overflow-hidden bg-gradient-to-b from-[#6366f1]/5 via-white to-white">
      <div className="container mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeftIcon />
            <span>Panel'e Dön</span>
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] inline-block text-transparent bg-clip-text">CV Şablonları</h1>
        </div>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl">
          CV'niz için bir şablon seçin. Daha sonra içeriği düzenleyebilirsiniz.
        </p>

        {/* Kategori Filtreleri */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white/80 text-gray-700 border border-gray-200 hover:shadow-md hover:scale-105'
              }`}
            >
              <span className="flex items-center justify-center w-6 h-6">
                {categoryIcons[category]}
              </span>
              <span className="font-medium">{category}</span>
            </button>
          ))}
        </div>

        {/* Şablonlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupedTemplates[selectedCategory]?.map((template) => (
            <div 
              key={template.id} 
              className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100/50 overflow-hidden"
            >
              <div className="relative h-[300px] w-full">
                <Image
                  src={template.previewUrl}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-5 flex-grow">{template.description}</p>
                <Button 
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-white border-0" 
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  Bu Şablonu Seç
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
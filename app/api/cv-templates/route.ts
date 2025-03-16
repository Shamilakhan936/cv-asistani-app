import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

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

// GET: CV Şablonlarını listele
export async function GET() {
  try {
    // Oturum kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Manuel olarak Zarif şablonu oluştur
    const elegantTemplate = {
      id: 'elegant-template-1',
      name: 'Zarif',
      category: 'Modern',
      displayCategory: 'Modern',
      description: 'Güçlü yanlarınızı ve başarılarınızı vurgulayan, güzel tasarıma sahip, kompakt ve okunması kolay düzene sahip zarif şablon.',
      previewUrl: '/images/cv-templates/elegant-preview.jpg', // Ön izleme görseli
      isActive: true
    };

    // Şablonlar dizisini oluştur (şimdilik sadece Zarif şablonu var)
    const processedTemplates = [elegantTemplate];

    // Şablonları kategorilere göre grupla
    const grouped: Record<string, any[]> = {};
    
    // Tüm kategorileri oluştur, ancak boş diziler olarak
    categoryOrder.forEach(cat => {
      grouped[cat] = [];
    });
    
    // Şablonu kendi kategorisine ekle
    processedTemplates.forEach(template => {
      const category = template.displayCategory;
      if (grouped[category]) {
        grouped[category].push(template);
      }
    });
    
    // "Tümü" kategorisine tüm şablonları ekle
    grouped['Tümü'] = [...processedTemplates];
    
    return NextResponse.json({ 
      templates: processedTemplates,
      groupedTemplates: grouped
    });
  } catch (error) {
    console.error('Error fetching CV templates:', error);
    return NextResponse.json({ error: 'Failed to fetch CV templates' }, { status: 500 });
  }
} 
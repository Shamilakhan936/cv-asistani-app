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

// GET: Tüm aktif CV şablonlarını listele
export async function GET() {
  try {
    // Oturum kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Aktif şablonları getir
    const templates = await prisma.$queryRaw`
      SELECT * FROM cv_templates 
      WHERE "isActive" = true 
      ORDER BY category ASC
    `;

    // Şablonları işle ve kategorileri çevir
    const processedTemplates = (templates as any[]).map(template => ({
      ...template,
      displayCategory: categoryTranslations[template.category] || template.category
    }));

    // Şablonları kategorilere göre grupla
    const grouped: Record<string, any[]> = {};
    
    // Önce tüm kategorileri oluştur
    categoryOrder.forEach(cat => {
      grouped[cat] = [];
    });
    
    // Şablonları kendi kategorilerine ekle
    processedTemplates.forEach(template => {
      const category = template.displayCategory;
      if (grouped[category]) {
        grouped[category].push(template);
      }
    });
    
    // "Tümü" kategorisine tüm şablonları ekle
    grouped['Tümü'] = [...processedTemplates];
    
    // Boş kategorileri filtrele
    const filteredGrouped = Object.fromEntries(
      Object.entries(grouped).filter(([_, templates]) => templates.length > 0)
    );

    return NextResponse.json({ 
      templates: processedTemplates,
      groupedTemplates: filteredGrouped
    });
  } catch (error) {
    console.error('Error fetching CV templates:', error);
    return NextResponse.json({ error: 'Failed to fetch CV templates' }, { status: 500 });
  }
} 
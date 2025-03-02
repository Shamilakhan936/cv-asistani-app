import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { randomUUID } from 'crypto';

// CV şablonları
const templates = [
  // Sade Şablonlar
  {
    id: randomUUID(),
    name: 'Sade Minimal',
    category: 'Simple',
    description: 'Temiz ve sade bir tasarım ile profesyonel bir görünüm.',
    previewUrl: 'https://placehold.co/600x800/f5f5f5/333?text=Sade+Minimal',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Sade Zarif',
    category: 'Simple',
    description: 'Zarif ve basit bir tasarım ile öne çıkan CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/f8f9fa/333?text=Sade+Zarif',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Sade Temiz',
    category: 'Simple',
    description: 'Temiz hatlar ve minimalist yaklaşım ile oluşturulmuş CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/ffffff/333?text=Sade+Temiz',
    isActive: true,
  },

  // Modern Şablonlar
  {
    id: randomUUID(),
    name: 'Modern Teknoloji',
    category: 'Modern',
    description: 'Teknoloji ve yazılım profesyonelleri için modern tasarım.',
    previewUrl: 'https://placehold.co/600x800/118ab2/fff?text=Modern+Teknoloji',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Modern Şık',
    category: 'Modern',
    description: 'Şık ve çağdaş bir görünüm sunan modern CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/073b4c/fff?text=Modern+Şık',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Modern Gradyan',
    category: 'Modern',
    description: 'Gradyan renk geçişleri ile modern bir görünüm.',
    previewUrl: 'https://placehold.co/600x800/3a86ff/fff?text=Modern+Gradyan',
    isActive: true,
  },

  // Yaratıcı Şablonlar
  {
    id: randomUUID(),
    name: 'Yaratıcı Sanatsal',
    category: 'Creative',
    description: 'Sanatsal dokunuşlar ile farklılaşan yaratıcı CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/ffd166/333?text=Yaratıcı+Sanatsal',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Yaratıcı Tasarımcı',
    category: 'Creative',
    description: 'Tasarımcılar ve yaratıcı profesyoneller için özel tasarım.',
    previewUrl: 'https://placehold.co/600x800/ef476f/fff?text=Yaratıcı+Tasarımcı',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Yaratıcı Renkli',
    category: 'Creative',
    description: 'Yaratıcı sektörler için renkli ve dikkat çekici tasarım.',
    previewUrl: 'https://placehold.co/600x800/06d6a0/333?text=Yaratıcı+Renkli',
    isActive: true,
  },

  // Profesyonel Şablonlar
  {
    id: randomUUID(),
    name: 'Profesyonel Kurumsal',
    category: 'Professional',
    description: 'Kurumsal dünyada öne çıkmak için tasarlanmış CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/1d3557/fff?text=Profesyonel+Kurumsal',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Profesyonel Yönetici',
    category: 'Professional',
    description: 'Üst düzey yöneticiler için özlü ve etkileyici tasarım.',
    previewUrl: 'https://placehold.co/600x800/457b9d/fff?text=Profesyonel+Yönetici',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Profesyonel Klasik',
    category: 'Professional',
    description: 'Geleneksel ve profesyonel bir CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/a8dadc/333?text=Profesyonel+Klasik',
    isActive: true,
  },

  // Tümü Kategorisi - Tüm şablonları içerir
  {
    id: randomUUID(),
    name: 'Standart',
    category: 'All',
    description: 'Her sektör ve pozisyon için uygun standart CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/f1faee/333?text=Standart',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Çok Yönlü',
    category: 'All',
    description: 'Çok yönlü ve her alana uyarlanabilir CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/e63946/fff?text=Çok+Yönlü',
    isActive: true,
  },
  {
    id: randomUUID(),
    name: 'Dengeli',
    category: 'All',
    description: 'Profesyonellik ve yaratıcılık arasında denge kuran CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/264653/fff?text=Dengeli',
    isActive: true,
  },
];

// POST: CV şablonlarını ekle
export async function POST() {
  try {
    // Oturum kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcının admin olup olmadığını kontrol et
    const user = await prisma.$queryRaw`
      SELECT role FROM users WHERE clerk_id = ${session.userId}
    `;

    if (!Array.isArray(user) || user.length === 0 || user[0].role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Mevcut şablonları temizle
    await prisma.$executeRaw`TRUNCATE TABLE "cv_templates" CASCADE`;

    // Yeni şablonları ekle
    for (const template of templates) {
      await prisma.$executeRaw`
        INSERT INTO "cv_templates" (
          "id", "name", "category", "description", "previewUrl", "isActive", "createdAt", "updatedAt"
        ) VALUES (
          ${template.id}, 
          ${template.name}, 
          ${template.category}, 
          ${template.description}, 
          ${template.previewUrl}, 
          ${template.isActive}, 
          NOW(), 
          NOW()
        )
      `;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'CV şablonları başarıyla eklendi',
      count: templates.length
    });
  } catch (error) {
    console.error('Error adding CV templates:', error);
    return NextResponse.json({ 
      error: 'Failed to add CV templates',
      details: (error as Error).message
    }, { status: 500 });
  }
}

// GET: Tüm CV şablonlarını listele
export async function GET() {
  try {
    // Oturum kontrolü
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcının admin olup olmadığını kontrol et
    const user = await prisma.$queryRaw`
      SELECT role FROM users WHERE clerk_id = ${session.userId}
    `;

    if (!Array.isArray(user) || user.length === 0 || user[0].role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Tüm şablonları getir
    const templates = await prisma.$queryRaw`
      SELECT * FROM "cv_templates"
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching CV templates:', error);
    return NextResponse.json({ error: 'Failed to fetch CV templates' }, { status: 500 });
  }
} 
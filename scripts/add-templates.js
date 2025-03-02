// Yeni şablonlar ekleyen script
const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');
const prisma = new PrismaClient();

// Şablon listesi
const templates = [
  // Sade Şablonlar
  {
    id: "pamukkale-template",
    name: 'Pamukkale',
    category: 'Simple',
    description: 'Temiz ve sade bir tasarım ile profesyonel bir görünüm.',
    previewUrl: 'https://placehold.co/600x800/f5f5f5/333?text=Pamukkale',
    isActive: true,
  },
  {
    id: "assos-template",
    name: 'Assos',
    category: 'Simple',
    description: 'Zarif ve basit bir tasarım ile öne çıkan CV şablonu. Profesyonel iş başvuruları için ideal.',
    previewUrl: 'https://res.cloudinary.com/dnvd5ss0n/image/upload/v1/cv_assistant_photos/assos_cv_template',
    isActive: true,
  },
  {
    id: "kristal-template",
    name: 'Kristal',
    category: 'Simple',
    description: 'A4 boyutunda, temiz hatlar ve profesyonel bir düzen ile oluşturulmuş, iş başvurularında öne çıkmanızı sağlayacak CV şablonu.',
    previewUrl: 'https://res.cloudinary.com/dnvd5ss0n/image/upload/v1/cv_assistant_photos/kristal_cv_template',
    isActive: true,
  },
  {
    id: "safir-template",
    name: 'Safir',
    category: 'Simple',
    description: 'Sade ve zarif bir tasarım ile profesyonel bir görünüm.',
    previewUrl: 'https://placehold.co/600x800/f0f8ff/333?text=Safir',
    isActive: true,
  },
  {
    id: "bogazici-template",
    name: 'Boğaziçi',
    category: 'Simple',
    description: 'Temiz ve düzenli bir tasarım ile öne çıkan CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/f5f5f5/333?text=Boğaziçi',
    isActive: true,
  },

  // Modern Şablonlar
  {
    id: "efes-template",
    name: 'Efes',
    category: 'Modern',
    description: 'Teknoloji ve yazılım profesyonelleri için modern tasarım.',
    previewUrl: 'https://placehold.co/600x800/118ab2/fff?text=Efes',
    isActive: true,
  },
  {
    id: "galata-template",
    name: 'Galata',
    category: 'Modern',
    description: 'Şık ve çağdaş bir görünüm sunan modern CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/073b4c/fff?text=Galata',
    isActive: true,
  },
  {
    id: "panorama-template",
    name: 'Panorama',
    category: 'Modern',
    description: 'Geniş bir bakış açısı sunan modern bir tasarım.',
    previewUrl: 'https://placehold.co/600x800/3a86ff/fff?text=Panorama',
    isActive: true,
  },
  {
    id: "vizyon-template",
    name: 'Vizyon',
    category: 'Modern',
    description: 'İleri görüşlü profesyoneller için modern bir tasarım.',
    previewUrl: 'https://placehold.co/600x800/0077b6/fff?text=Vizyon',
    isActive: true,
  },
  {
    id: "kuantum-template",
    name: 'Kuantum',
    category: 'Modern',
    description: 'Yenilikçi ve modern bir yaklaşım ile tasarlanmış CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/00b4d8/fff?text=Kuantum',
    isActive: true,
  },

  // Yaratıcı Şablonlar
  {
    id: "pera-template",
    name: 'Pera',
    category: 'Creative',
    description: 'Sanatsal dokunuşlar ile farklılaşan yaratıcı CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/ffd166/333?text=Pera',
    isActive: true,
  },
  {
    id: "ahenk-template",
    name: 'Ahenk',
    category: 'Creative',
    description: 'Tasarımcılar ve yaratıcı profesyoneller için özel tasarım.',
    previewUrl: 'https://placehold.co/600x800/ef476f/fff?text=Ahenk',
    isActive: true,
  },
  {
    id: "mozaik-template",
    name: 'Mozaik',
    category: 'Creative',
    description: 'Yaratıcı sektörler için renkli ve dikkat çekici tasarım.',
    previewUrl: 'https://placehold.co/600x800/06d6a0/333?text=Mozaik',
    isActive: true,
  },
  {
    id: "harmoni-template",
    name: 'Harmoni',
    category: 'Creative',
    description: 'Uyumlu renkler ve yaratıcı tasarım ile öne çıkan CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/ff9e00/fff?text=Harmoni',
    isActive: true,
  },
  {
    id: "ilham-template",
    name: 'İlham',
    category: 'Creative',
    description: 'İlham verici ve yaratıcı bir tasarım ile hazırlanmış CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/ff6b6b/fff?text=İlham',
    isActive: true,
  },

  // Profesyonel Şablonlar
  {
    id: "kapadokya-template",
    name: 'Kapadokya',
    category: 'Professional',
    description: 'Kurumsal dünyada öne çıkmak için tasarlanmış CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/1d3557/fff?text=Kapadokya',
    isActive: true,
  },
  {
    id: "zirve-template",
    name: 'Zirve',
    category: 'Professional',
    description: 'Üst düzey yöneticiler için özlü ve etkileyici tasarım.',
    previewUrl: 'https://placehold.co/600x800/457b9d/fff?text=Zirve',
    isActive: true,
  },
  {
    id: "prestij-template",
    name: 'Prestij',
    category: 'Professional',
    description: 'Prestijli ve profesyonel bir görünüm sunan CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/1b263b/fff?text=Prestij',
    isActive: true,
  },
  {
    id: "maslak-template",
    name: 'Maslak',
    category: 'Professional',
    description: 'İş dünyasında fark yaratmak için tasarlanmış profesyonel CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/415a77/fff?text=Maslak',
    isActive: true,
  },
  {
    id: "truva-template",
    name: 'Truva',
    category: 'Professional',
    description: 'Güçlü ve etkileyici bir profesyonel CV şablonu.',
    previewUrl: 'https://placehold.co/600x800/2b2d42/fff?text=Truva',
    isActive: true,
  },
];

async function addTemplates() {
  try {
    console.log('Şablonlar ekleniyor...');
    
    // Her bir şablonu ekle
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
      console.log(`Şablon eklendi: ${template.name}`);
    }
    
    console.log('Toplam ' + templates.length + ' şablon başarıyla eklendi.');
  } catch (error) {
    console.error('Şablonları eklerken hata oluştu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTemplates(); 
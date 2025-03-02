// Doğrudan veritabanına erişim sağlayan script
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearTemplates() {
  try {
    // Tüm şablonları temizle
    await prisma.$executeRaw`TRUNCATE TABLE "cv_templates" CASCADE`;
    console.log('Tüm CV şablonları başarıyla silindi');
  } catch (error) {
    console.error('Error clearing CV templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearTemplates(); 
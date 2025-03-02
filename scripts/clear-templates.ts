// Doğrudan veritabanına erişim sağlayan TypeScript script
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clearTemplates(): Promise<void> {
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
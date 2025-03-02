const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Prisma client models:', Object.keys(prisma));
console.log('Prisma client methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(prisma)));

// Bağlantıyı kapat
prisma.$disconnect(); 
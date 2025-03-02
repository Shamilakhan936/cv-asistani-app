import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// Test veritabanı bağlantısını kullan
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

describe('API Tests', () => {
  beforeEach(async () => {
    // Test veritabanında temizlik yap
    if (process.env.NODE_ENV === 'test') {
      await prisma.photo.deleteMany();
      await prisma.photoOperation.deleteMany();
      await prisma.user.deleteMany();
    }
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('Authentication', () => {
    it('should handle unauthorized access', async () => {
      const req = new NextRequest('http://localhost:3000/api/user/photos');
      const res = await fetch(req);
      expect(res.status).toBe(401);
    });
  });

  describe('Photo Operations', () => {
    it('should validate photo upload request', async () => {
      const req = new NextRequest('http://localhost:3000/api/photos/create', {
        method: 'POST',
        body: JSON.stringify({ photos: [] })
      });
      const res = await fetch(req);
      expect(res.status).toBe(400);
    });

    it('should handle invalid photo format', async () => {
      const req = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: new FormData()
      });
      const res = await fetch(req);
      expect(res.status).toBe(400);
    });
  });

  describe('Admin Operations', () => {
    it('should restrict admin access to authorized users', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/stats');
      const res = await fetch(req);
      expect(res.status).toBe(401);
    });
  });
}); 
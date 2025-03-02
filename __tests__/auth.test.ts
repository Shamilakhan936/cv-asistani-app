import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { auth } from '@clerk/nextjs/server';
import { requireAuth, requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

describe('Authentication Tests', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('User Authentication', () => {
    it('should throw error for unauthenticated users', async () => {
      try {
        await requireAuth();
        // Eğer buraya ulaşırsa test başarısız olmalı
        expect(true).toBe(false);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Unauthorized');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Admin Authentication', () => {
    it('should throw error for non-admin users', async () => {
      try {
        await requireAdmin();
        // Eğer buraya ulaşırsa test başarısız olmalı
        expect(true).toBe(false);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Unauthorized');
        } else {
          throw error;
        }
      }
    });
  });
}); 
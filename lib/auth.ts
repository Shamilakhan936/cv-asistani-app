import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from './supabase';

export async function getCurrentUser() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return null;
    }

    // Supabase'den kullanıcı bilgilerini al
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user from Supabase:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  
  return user;
} 
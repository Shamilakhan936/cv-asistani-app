import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  created_at: string;
}

export async function GET() {
  try {
    // Admin kontrolü
    await requireAdmin();

    // Tüm kullanıcıları getir
    const { data: supabaseUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Kullanıcı getirme hatası:', usersError);
      throw usersError;
    }

    // CV ve fotoğraf işlem sayılarını ayrı ayrı getir
    const userPromises = (supabaseUsers as User[]).map(async (user) => {
      const [{ count: cvCount }, { count: operationCount }] = await Promise.all([
        supabaseAdmin
          .from('cvs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabaseAdmin
          .from('photo_operations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ]);

      return {
        id: user.id,
        name: user.name || 'İsimsiz Kullanıcı',
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        _count: {
          cvs: cvCount || 0,
          operations: operationCount || 0
        }
      };
    });

    const formattedUsers = await Promise.all(userPromises);

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar getirilemedi' },
      { status: 500 }
    );
  }
} 
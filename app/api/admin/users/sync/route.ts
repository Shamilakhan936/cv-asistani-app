import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
interface ClerkUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email_addresses: Array<{
    id: string;
    email_address: string;
  }>;
  primary_email_address_id: string;
}

export async function POST() {
  try {
    // Admin kontrolü
    await requireAdmin();

    // Supabase'den tüm kullanıcıları al
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Kullanıcı getirme hatası:', usersError);
      throw usersError;
    }

    // Her kullanıcı için Clerk'ten bilgileri güncelle
    const updatePromises = users.map(async (user: any) => {
      if (!user.clerk_id) {
        console.warn('Clerk ID not found for user:', user.id);
        return null;
      }

      try {
        // Clerk API'den kullanıcı bilgilerini al
        const clerkRes = await fetch(
          `https://api.clerk.com/v1/users/${user.clerk_id}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!clerkRes.ok) {
          console.warn('Failed to fetch Clerk user:', user.clerk_id);
          return null;
        }

        const clerkUser: ClerkUser = await clerkRes.json();

        // İsim oluşturma mantığı
        let name = null;
        if (clerkUser.first_name && clerkUser.last_name) {
          name = `${clerkUser.first_name} ${clerkUser.last_name}`;
        } else if (clerkUser.first_name) {
          name = clerkUser.first_name;
        } else if (clerkUser.last_name) {
          name = clerkUser.last_name;
        } else if (clerkUser.username) {
          name = clerkUser.username;
        }

        const primaryEmail = clerkUser.email_addresses.find(
          email => email.id === clerkUser.primary_email_address_id
        );

        // Supabase'i güncelle
        const { data, error } = await supabaseAdmin
          .from('users')
          .update({
            name: name,
            email: primaryEmail?.email_address,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating user:', user.id, error);
          return null;
        }

        console.log('Updated user:', {
          id: user.id,
          name: name,
          email: primaryEmail?.email_address
        });

        return data;
      } catch (error) {
        console.error('Error fetching Clerk user:', user.clerk_id, error);
        return null;
      }
    });

    const results = await Promise.all(updatePromises);
    const updatedUsers = results.filter(Boolean);

    return NextResponse.json({
      success: true,
      updatedCount: updatedUsers.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Senkronizasyon hatası' },
      { status: 500 }
    );
  }
} 
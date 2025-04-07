import { NextResponse } from 'next/server';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { supabaseAdmin } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
interface EmailAddress {
  id: string;
  email_address: string;
}

export async function POST(req: Request) {
  try {
    // Webhook secret'ı doğrula
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
    }

    // Get headers directly from the request instead of using headers()
    const svix_id = req.headers.get("svix-id");
    const svix_timestamp = req.headers.get("svix-timestamp");
    const svix_signature = req.headers.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occurred -- no svix headers', {
        status: 400
      });
    }

    // Create Svix instance with secret
    const wh = new Webhook(WEBHOOK_SECRET);
    const body = await req.text();

    try {
      wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      } as WebhookRequiredHeaders);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Webhook signature verification failed', {
        status: 400
      });
    }

    // Parse the verified body
    const payload = JSON.parse(body);
    const { type, data } = payload;

    console.log('Webhook received:', { type, userId: data.id });

    // Handle the webhook
    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, username } = data;

      // Get primary email
      const primaryEmail = email_addresses?.find((email: EmailAddress) => email.id === data.primary_email_address_id);
      const emailValue = primaryEmail?.email_address;

      console.log('Processing user:', {
        id,
        emailValue,
        first_name,
        last_name,
        username,
        primaryEmailId: data.primary_email_address_id
      });

      if (!emailValue) {
        console.error('Email not found for user:', id);
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
      }

      // İsim oluşturma mantığı
      let name = null;
      if (first_name && last_name) {
        name = `${first_name} ${last_name}`;
      } else if (first_name) {
        name = first_name;
      } else if (last_name) {
        name = last_name;
      } else if (username) {
        name = username;
      }

      console.log('Creating/updating user:', { id, email: emailValue, name });

      try {
        // Önce kullanıcının var olup olmadığını kontrol et
        const { data: existingUser, error: fetchError } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('clerk_id', id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking existing user:', fetchError);
          throw fetchError;
        }

        let dbUser;
        if (existingUser) {
          // Kullanıcı varsa güncelle
          const { data: updatedUser, error: updateError } = await supabaseAdmin
            .from('users')
            .update({
              email: emailValue,
              name: name,
              updated_at: new Date().toISOString()
            })
            .eq('clerk_id', id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating user:', updateError);
            throw updateError;
          }
          dbUser = updatedUser;
        } else {
          // Kullanıcı yoksa oluştur
          const { data: newUser, error: insertError } = await supabaseAdmin
            .from('users')
            .insert({
              clerk_id: id,
              email: emailValue,
              name: name,
              role: 'USER',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user:', insertError);
            throw insertError;
          }
          dbUser = newUser;
        }

        console.log('User synced to Supabase DB successfully:', dbUser);
        return NextResponse.json({ success: true, user: dbUser });
      } catch (error) {
        console.error('Error syncing user:', error);
        throw error;
      }
    } else if (type === 'user.deleted') {
      const { id } = data;

      try {
        // Supabase DB'den kullanıcıyı sil
        const { error: dbError } = await supabaseAdmin
          .from('users')
          .delete()
          .eq('clerk_id', id);

        if (dbError) {
          console.error('Supabase DB delete error:', dbError);
          throw dbError;
        }

        console.log('User deleted from Supabase DB:', id);
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
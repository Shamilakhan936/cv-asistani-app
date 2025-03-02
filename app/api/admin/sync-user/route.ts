import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Oturum bilgilerini al
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clerk'ten kullanıcı bilgilerini al
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Kullanıcının email adresini bul
    const primaryEmail = user.emailAddresses.find(
      (email: any) => email.id === user.primaryEmailAddressId
    );
    
    const emailValue = primaryEmail?.emailAddress;
    
    if (!emailValue) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    // İsim oluştur
    let name = null;
    if (user.firstName && user.lastName) {
      name = `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      name = user.firstName;
    } else if (user.lastName) {
      name = user.lastName;
    } else if (user.username) {
      name = user.username;
    }

    // Supabase'de kullanıcıyı güncelle
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        name: name,
        email: emailValue,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: data,
      clerk_user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: emailValue
      }
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ 
      error: (error as Error).message 
    }, { status: 500 });
  }
} 
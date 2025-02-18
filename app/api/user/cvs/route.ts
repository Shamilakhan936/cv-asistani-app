import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      console.error('Unauthorized access: No userId found');
      return NextResponse.json({ 
        success: false,
        cvs: [],
        error: 'Unauthorized access' 
      }, { status: 401 });
    }

    console.log('Processing request for user:', userId);

    // Önce users tablosundan Supabase user ID'sini alalım
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    let userDbId;

    if (userError) {
      if (userError.code === 'PGRST116') {
        // Kullanıcı bulunamadıysa yeni bir kullanıcı oluştur
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert([
            { 
              clerk_id: userId,
              role: 'USER',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          throw createError;
        }

        userDbId = newUser.id;
      } else {
        console.error('Error fetching user:', userError);
        throw userError;
      }
    } else {
      userDbId = userData.id;
    }

    // Kullanıcının CV'lerini al
    const { data: cvs, error } = await supabaseAdmin
      .from('cvs')
      .select('*')
      .eq('userId', userDbId)
      .order('updatedAt', { ascending: false });

    if (error) {
      console.error('Error fetching CVs:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      cvs: cvs || []
    });
  } catch (error) {
    console.error('Error fetching CVs:', error);
    return NextResponse.json({
      success: false,
      cvs: [],
      error: error instanceof Error ? error.message : 'Error fetching CVs'
    }, { status: 500 });
  }
} 
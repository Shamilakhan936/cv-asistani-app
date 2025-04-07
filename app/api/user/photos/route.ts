import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      console.error('Unauthorized access: No userId found');
      return NextResponse.json({ 
        success: false,
        operations: [],
        error: 'Unauthorized access' 
      }, { status: 401 });
    }

    console.log('Clerk User ID:', userId);

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

    // Kullanıcı bulunduysa fotoğraf operasyonlarını al
    const { data: operations, error } = await supabaseAdmin
      .from('photo_operations')
      .select(`
        *,
        photos (*)
      `)
      .eq('user_id', userDbId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching operations:', error);
      throw error;
    }

    const formattedOperations = operations?.map((operation) => ({
      id: operation.id,
      status: operation.status,
      createdAt: operation.created_at,
      photos: {
        original: operation.photos
          ?.filter((p: any) => p.type === 'ORIGINAL')
          .map((p: any) => ({
            id: p.id,
            url: p.url,
            createdAt: p.created_at,
            metadata: p.metadata
          })) || [],
        generated: operation.photos
          ?.filter((p: any) => p.type === 'AI_GENERATED')
          .map((p: any) => ({
            id: p.id,
            url: p.url,
            createdAt: p.created_at,
            metadata: p.metadata
          })) || []
      }
    })) || [];

    return NextResponse.json({ 
      success: true,
      operations: formattedOperations 
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({
      success: false,
      operations: [],
      error: error instanceof Error ? error.message : 'Error fetching photos'
    }, { status: 500 });
  }
} 
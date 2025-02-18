import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

interface Photo {
  id: string;
  url: string;
  type: 'ORIGINAL' | 'AI_GENERATED';
  created_at: string;
  metadata: any;
}

interface PhotoOperation {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  can_cancel: boolean;
  notes: string;
  photos: Photo[];
  user?: User;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

export async function GET() {
  try {
    // Admin kontrolü
    await requireAdmin();

    // Önce tüm işlemleri getir
    const { data: operations, error: opsError } = await supabaseAdmin
      .from('photo_operations')
      .select('*')
      .order('created_at', { ascending: false });

    if (opsError) {
      console.error('İşlem getirme hatası:', opsError);
      return NextResponse.json(
        { error: 'İşlemler getirilemedi: ' + opsError.message },
        { status: 500 }
      );
    }

    if (!operations || operations.length === 0) {
      return NextResponse.json({ operations: [] });
    }

    // Kullanıcı bilgilerini getir
    const userIds = Array.from(new Set(operations.map(op => op.user_id)));
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email')
      .in('id', userIds);

    if (usersError) {
      console.error('Kullanıcı getirme hatası:', usersError);
      return NextResponse.json(
        { error: 'Kullanıcı bilgileri getirilemedi: ' + usersError.message },
        { status: 500 }
      );
    }

    // Fotoğrafları getir
    const operationIds = operations.map(op => op.id);
    const { data: photos, error: photosError } = await supabaseAdmin
      .from('photos')
      .select('*')
      .in('operation_id', operationIds);

    if (photosError) {
      console.error('Fotoğraf getirme hatası:', photosError);
      return NextResponse.json(
        { error: 'Fotoğraflar getirilemedi: ' + photosError.message },
        { status: 500 }
      );
    }

    // Kullanıcıları map'le
    const userMap = new Map(users?.map(user => [user.id, user]) || []);
    
    // Fotoğrafları map'le
    const photoMap = new Map();
    photos?.forEach(photo => {
      if (!photoMap.has(photo.operation_id)) {
        photoMap.set(photo.operation_id, []);
      }
      photoMap.get(photo.operation_id).push(photo);
    });

    // İşlemleri formatla
    const formattedOperations = operations.map(operation => ({
      id: operation.id,
      status: operation.status,
      createdAt: operation.created_at,
      updatedAt: operation.updated_at,
      canCancel: operation.can_cancel,
      notes: operation.notes,
      user: userMap.get(operation.user_id) || null,
      photos: {
        original: (photoMap.get(operation.id) || [])
          .filter((p: Photo) => p.type === 'ORIGINAL'),
        generated: (photoMap.get(operation.id) || [])
          .filter((p: Photo) => p.type === 'AI_GENERATED')
      }
    }));

    return NextResponse.json({ operations: formattedOperations });
  } catch (error) {
    console.error('API hatası:', error);
    return NextResponse.json(
      { error: 'İşlemler getirilemedi: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from './lib/supabase'

const isPublicRoute = createRouteMatcher([
  '/',
  '/blog(.*)',
  '/pricing(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk',
  '/api/admin/cv-templates/reset'
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, request) => {
  // Webhook endpoint should be accessible
  if (request.nextUrl.pathname === '/api/webhook/clerk') {
    return
  }

  // Public routes are accessible to everyone
  if (isPublicRoute(request)) {
    return
  }

  try {
    // Protect all non-public routes
    const session = await auth.protect()
    const userId = session.userId;

    // Kullanıcı bilgilerini senkronize et (sadece oturum açmış kullanıcılar için)
    if (userId) {
      try {
        // Supabase'den mevcut kullanıcı bilgilerini kontrol et
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('name, email, updated_at')
          .eq('clerk_id', userId)
          .single();

        // Eğer kullanıcı bilgileri eksikse veya son 24 saat içinde güncellenmemişse
        const needsUpdate = !existingUser?.name || !existingUser?.email || 
          (existingUser?.updated_at && 
           new Date().getTime() - new Date(existingUser.updated_at).getTime() > 24 * 60 * 60 * 1000);

        if (needsUpdate) {
          // Sync API'yi çağır
          const syncResponse = await fetch(`${request.nextUrl.origin}/api/admin/sync-user`, {
            headers: {
              Cookie: request.headers.get('cookie') || ''
            }
          });
          
          if (!syncResponse.ok) {
            console.error('User sync failed:', await syncResponse.text());
          }
        }
      } catch (syncError) {
        console.error('User sync error:', syncError);
        // Senkronizasyon hatası olsa bile kullanıcının devam etmesine izin ver
      }
    }

    // For admin routes, check if user has admin role in database
    if (isAdminRoute(request)) {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('clerk_id', session.userId)
        .single()

      if (error || !user || user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
}, { debug: process.env.NODE_ENV === 'development' })

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 
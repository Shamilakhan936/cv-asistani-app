import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import {
  PhotoIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

async function checkAdmin() {
  const session = await auth();
  if (!session?.userId) {
    redirect('/sign-in');
  }

  // Supabase'den kullanıcıyı kontrol et
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('clerk_id', session.userId)
    .single();

  if (error || !user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return user;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const adminUser = await checkAdmin();

  const navigation = [
    {
      name: 'Fotoğraflar',
      href: '/admin/photos',
      icon: PhotoIcon,
      current: false,
    },
    {
      name: 'CV\'ler',
      href: '/admin/cvs',
      icon: DocumentTextIcon,
      current: false,
    },
    {
      name: 'Kullanıcılar',
      href: '/admin/users',
      icon: UserGroupIcon,
      current: false,
    },
    {
      name: 'Ayarlar',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
      current: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 flex w-64 flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Panel
              </Link>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                >
                  <item.icon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {children}
      </div>
    </div>
  );
} 
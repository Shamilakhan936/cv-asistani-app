'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/lider/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Fotoğraf İşlemleri',
    href: '/lider/photos',
    icon: ImageIcon
  },
  {
    title: 'Kullanıcılar',
    href: '/lider/users',
    icon: Users
  },
  {
    title: 'Ayarlar',
    href: '/lider/settings',
    icon: Settings
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Giriş sayfasında layout'u gösterme
  if (pathname === '/lider') {
    return children;
  }

  const handleLogout = () => {
    // Admin cookie'lerini sil
    Cookies.remove('admin_username');
    Cookies.remove('admin_password');
    // Giriş sayfasına yönlendir
    window.location.href = '/lider';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">CV Asistanı</h2>
          <p className="mt-1 text-sm text-gray-500">Yönetici Paneli</p>
        </div>
        
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-4"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 
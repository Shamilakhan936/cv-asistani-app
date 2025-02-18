'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Çıkış yapılıyor...</h2>
          <p className="mt-2 text-gray-600">Lütfen bekleyin, yönlendiriliyorsunuz.</p>
        </div>
      </div>
    </div>
  );
} 
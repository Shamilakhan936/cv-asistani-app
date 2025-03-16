'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const { signOut } = useClerk();
  const router = useRouter();
  
  useEffect(() => {
    const performSignOut = async () => {
      await signOut();
      router.push('/');
    };
    
    performSignOut();
  }, [signOut, router]);

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
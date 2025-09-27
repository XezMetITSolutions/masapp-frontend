'use client';

import { useEffect } from 'react';
import { getSubdomain, isAdminSubdomain } from '@/utils/subdomain';

export default function AdminPage() {
  useEffect(() => {
    const subdomain = getSubdomain();
    
    // Eğer admin subdomain'de değilsek, admin subdomain'e yönlendir
    if (!isAdminSubdomain()) {
      window.location.href = 'https://admin.guzellestir.com';
      return;
    }
    
    // Admin subdomain'deysek, admin dashboard'u göster
    window.location.href = '/admin/dashboard';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Admin paneline yönlendiriliyor...</p>
      </div>
    </div>
  );
}
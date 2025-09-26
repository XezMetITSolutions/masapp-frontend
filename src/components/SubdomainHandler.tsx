'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSubdomain, isAdminSubdomain, isRestaurantSubdomain, getCurrentRestaurant } from '@/utils/subdomain';

interface SubdomainHandlerProps {
  children: React.ReactNode;
}

export default function SubdomainHandler({ children }: SubdomainHandlerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentRestaurant, setCurrentRestaurant] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleSubdomain = async () => {
      const subdomain = getSubdomain();
      
      // Ana domain (guzellestir.com) - admin panel'e yönlendir
      if (!subdomain) {
        if (pathname.startsWith('/admin')) {
          // Zaten admin sayfasındayız
          setIsLoading(false);
          return;
        }
        
        // Admin panel'e yönlendir
        router.push('/admin');
        return;
      }
      
      // Admin subdomain (admin.guzellestir.com)
      if (isAdminSubdomain()) {
        if (!pathname.startsWith('/admin')) {
          router.push('/admin');
          return;
        }
        setIsLoading(false);
        return;
      }
      
      // Restoran subdomain'i
      if (isRestaurantSubdomain()) {
        try {
          const restaurant = await getCurrentRestaurant();
          if (restaurant) {
            setCurrentRestaurant(restaurant);
            
            // Restoran bilgilerini localStorage'a kaydet
            localStorage.setItem('current-restaurant', JSON.stringify(restaurant));
            
            // Business panel'e yönlendir
            if (!pathname.startsWith('/business')) {
              router.push('/business/dashboard');
              return;
            }
          }
        } catch (error) {
          console.error('Restoran bilgisi alınamadı:', error);
        }
      }
      
      setIsLoading(false);
    };

    handleSubdomain();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

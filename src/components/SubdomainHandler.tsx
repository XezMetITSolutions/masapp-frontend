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
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleSubdomain = async () => {
      const subdomain = getSubdomain();
      
      // Ana domain (guzellestir.com) - ana sayfa göster
      if (!subdomain) {
        // Ana sayfa için yönlendirme yapma, sadece yükle
        setIsLoading(false);
        return;
      }
      
              // Admin subdomain (admin.guzellestir.com)
              if (isAdminSubdomain()) {
                if (pathname === '/' || pathname === '') {
                  router.push('/admin/dashboard');
                  return;
                }
                if (!pathname.startsWith('/admin')) {
                  router.push(`/admin${pathname}`);
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
            // Restoran aktif mi kontrol et
            if (restaurant.status !== 'active') {
              // Restoran aktif değilse ana sayfaya yönlendir
              console.log('🚫 Restoran aktif değil, ana sayfaya yönlendiriliyor...');
              
              setRedirecting(true);
              setTimeout(() => {
                window.location.replace('https://guzellestir.com');
              }, 2000);
              
              return;
            }
            
            setCurrentRestaurant(restaurant);
            
            // Restoran bilgilerini localStorage'a kaydet
            localStorage.setItem('current-restaurant', JSON.stringify(restaurant));
            
            // Restoran menüsüne yönlendir (ana sayfa yerine)
            if (pathname === '/' || pathname === '') {
              router.push('/menu');
              return;
            }
            
            // Business panel'e yönlendir
            if (!pathname.startsWith('/business') && !pathname.startsWith('/menu')) {
              router.push('/business/dashboard');
              return;
            }
          } else {
            // Restoran bulunamadıysa ana sayfaya yönlendir
            console.log('🚫 Restoran bulunamadı, ana sayfaya yönlendiriliyor...');
            
            // Daha agresif yönlendirme - setTimeout ile
            setRedirecting(true);
            setTimeout(() => {
              window.location.replace('https://guzellestir.com');
            }, 2000);
            
            return;
          }
        } catch (error) {
          console.error('Restoran bilgisi alınamadı:', error);
          // Hata durumunda da ana sayfaya yönlendir
          console.log('🚫 Hata durumu, ana sayfaya yönlendiriliyor...');
          
          setRedirecting(true);
          setTimeout(() => {
            window.location.replace('https://guzellestir.com');
          }, 2000);
          
          return;
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
          <p className="text-gray-600">Subdomain kontrol ediliyor...</p>
          <p className="text-sm text-gray-500 mt-2">Lütfen bekleyin</p>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Restoran bulunamadı</p>
          <p className="text-sm text-gray-500 mt-2">Ana sayfaya yönlendiriliyor...</p>
          <div className="mt-4">
            <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
              <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

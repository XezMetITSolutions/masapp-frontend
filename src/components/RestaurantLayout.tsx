'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentRestaurant } from '@/utils/subdomain';
import SetBrandColor from '@/components/SetBrandColor';

interface RestaurantLayoutProps {
  children: React.ReactNode;
}

export default function RestaurantLayout({ children }: RestaurantLayoutProps) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const restaurantData = await getCurrentRestaurant();
        if (restaurantData) {
          setRestaurant(restaurantData);
          // Restoran bilgilerini localStorage'a kaydet
          localStorage.setItem('current-restaurant', JSON.stringify(restaurantData));
        }
      } catch (error) {
        console.error('Restoran bilgisi alınamadı:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurant();
  }, []);

  // Sadece restoran sayfalarına izin ver
  const allowedPaths = [
    '/',
    '/demo/menu',
    '/demo/cart',
    '/demo/payment'
  ];

  const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));

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

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restoran Bulunamadı</h1>
          <p className="text-gray-600">Bu subdomain için restoran bilgisi bulunamadı.</p>
        </div>
      </div>
    );
  }

  if (!isAllowedPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sayfa Bulunamadı</h1>
          <p className="text-gray-600">Bu sayfa restoran subdomain'inde mevcut değil.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SetBrandColor />
      {children}
    </>
  );
}

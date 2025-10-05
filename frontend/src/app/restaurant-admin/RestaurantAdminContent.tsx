'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import useRestaurantStore from '@/store/useRestaurantStore';

export default function RestaurantAdminContent() {
  const searchParams = useSearchParams();
  const subdomain = searchParams.get('subdomain');

  const { restaurants } = useRestaurantStore();

  const restaurant = useMemo(() => {
    if (!subdomain) return null;
    return restaurants.find(r => r.slug === subdomain);
  }, [restaurants, subdomain]);

  if (!subdomain) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Restoran belirtilmedi.</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Restoran bulunamadı veya yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">İşletme Paneli: {restaurant.name}</h1>
      <p>Burası, <span className="font-mono">{restaurant.slug}</span> restoranının kendi özel admin panelidir.</p>
      <p>Yakında buraya menü yönetimi, sipariş takibi gibi özellikler eklenecek.</p>
    </div>
  );
}

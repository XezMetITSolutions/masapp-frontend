'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import useRestaurantStore from '@/store/useRestaurantStore';

export default function RestaurantAdminPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const { restaurants } = useRestaurantStore();

  const restaurant = useMemo(() => {
    return restaurants.find(r => r.slug === subdomain);
  }, [restaurants, subdomain]);

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

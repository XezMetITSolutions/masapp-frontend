'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardContent from './DashboardContent';

export default function DashboardPage() {
  const router = useRouter();
  const { authenticatedRestaurant, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!authenticatedRestaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Yönlendiriliyor...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">İşletme Paneli: {authenticatedRestaurant.name}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Çıkış Yap
        </button>
      </div>
      <DashboardContent restaurant={authenticatedRestaurant} />
    </div>
  );
}

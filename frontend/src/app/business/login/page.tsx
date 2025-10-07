'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
// React Icons yerine emoji kullanıyoruz

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'waiter' | 'kitchen' | 'cashier' | null>(null);

  const handleDemoLogin = async (role: 'waiter' | 'kitchen' | 'cashier' | 'restaurant_owner') => {
    console.log('handleDemoLogin called with role:', role);
    
    const demoUser = {
      id: `demo-${role}-1`,
      name: role === 'waiter' ? 'MasApp Garson' : 
            role === 'kitchen' ? 'MasApp Mutfak' : 
            role === 'cashier' ? 'MasApp Kasa' : 'MasApp İşletme',
      email: `demo@${role === 'restaurant_owner' ? 'restaurant' : role}.com`,
      role: role,
      restaurantId: 'demo-restaurant-1',
      status: 'active' as const,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    console.log('Demo user created:', demoUser);
    
    try {
      await login(demoUser, 'demo-access-token', 'demo-refresh-token');
      console.log('Login successful');
      
      // Cookie set et (middleware için)
      document.cookie = 'accessToken=demo-access-token; path=/; max-age=86400'; // 24 saat
      
      if (role === 'waiter') {
        console.log('Redirecting to waiter panel');
        router.push('/business/waiter');
      } else if (role === 'kitchen') {
        console.log('Redirecting to kitchen panel');
        router.push('/business/kitchen');
      } else if (role === 'cashier') {
        console.log('Redirecting to cashier panel');
        router.push('/business/cashier');
      } else if (role === 'restaurant_owner') {
        console.log('Redirecting to dashboard');
        router.push('/business/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-purple-600 text-2xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">MasApp Business</h1>
          <p className="text-gray-600 mt-2">MasApp Giriş Paneli</p>
        </div>

        <div className="space-y-4">
          {/* Test Button */}
          <button
            onClick={() => {
              console.log('Test button clicked');
              alert('Test button works!');
            }}
            className="w-full p-2 bg-red-500 text-white rounded-lg cursor-pointer"
          >
            TEST BUTONU - TIKLA
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Waiter button clicked');
              handleDemoLogin('waiter');
            }}
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <span className="text-xl">🔔</span>
            <div className="text-left">
              <div className="font-semibold">Garson Paneli</div>
              <div className="text-sm opacity-90">Siparişleri yönet ve müşteri çağrılarını gör</div>
            </div>
          </button>

                <button
            onClick={() => handleDemoLogin('kitchen')}
            className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <span className="text-xl">👨‍🍳</span>
            <div className="text-left">
              <div className="font-semibold">Mutfak Paneli</div>
              <div className="text-sm opacity-90">Siparişleri hazırla ve durumları güncelle</div>
            </div>
          </button>

          <button
            onClick={() => handleDemoLogin('cashier')}
            className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <span className="text-xl">💰</span>
            <div className="text-left">
              <div className="font-semibold">Kasa Paneli</div>
              <div className="text-sm opacity-90">Ödemeleri al ve kasa işlemlerini yönet</div>
            </div>
          </button>

            <button
            onClick={() => handleDemoLogin('restaurant_owner')}
            className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <span className="text-xl">🏪</span>
            <div className="text-left">
              <div className="font-semibold">İşletme Paneli</div>
              <div className="text-sm opacity-90">Restoranı yönet ve istatistikleri gör</div>
            </div>
          </button>
            </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            MasApp için herhangi bir rol seçebilirsiniz
          </p>
        </div>
      </div>
    </div>
  );
}

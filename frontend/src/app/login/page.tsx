'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useRestaurantStore from '@/store/useRestaurantStore';
import { useAuthStore } from '@/store/useAuthStore';

// Demo staff verileri - gerçek uygulamada bunlar veritabanından gelecek
const demoStaff = [
  { id: '1', restaurantId: 'rest_1', name: 'Demo Garson', username: 'garson', password: '123456', email: 'garson@test.com', phone: '0532', role: 'waiter' as const, status: 'active' as const, createdAt: new Date() },
  { id: '2', restaurantId: 'rest_1', name: 'Demo Aşçı', username: 'asci', password: '123456', email: 'chef@test.com', phone: '0532', role: 'chef' as const, status: 'active' as const, createdAt: new Date() },
  { id: '3', restaurantId: 'rest_1', name: 'Demo Kasiyer', username: 'kasiyer', password: '123456', email: 'cashier@test.com', phone: '0532', role: 'cashier' as const, status: 'active' as const, createdAt: new Date() },
  { id: '4', restaurantId: 'rest_1', name: 'Demo Yönetici', username: 'yonetici', password: '123456', email: 'manager@test.com', phone: '0532', role: 'manager' as const, status: 'active' as const, createdAt: new Date() },
];

export default function LoginPage() {
  const router = useRouter();
  const { restaurants } = useRestaurantStore();
  const { loginRestaurant, loginStaff } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Önce restoran olarak giriş kontrolü
    const restaurant = restaurants.find(
      (r) => r.username === username && r.password === password
    );

    if (restaurant) {
      loginRestaurant(restaurant);
      // Cookie set et (middleware için)
      document.cookie = 'accessToken=demo-access-token; path=/; max-age=86400'; // 24 saat
      router.push('/business/dashboard');
      return;
    }

    // Restoran değilse, personel olarak giriş kontrolü
    const staff = demoStaff.find(
      (s) => s.username === username && s.password === password
    );

    if (staff) {
      loginStaff(staff);
      // Cookie set et (middleware için)
      document.cookie = 'accessToken=demo-access-token; path=/; max-age=86400'; // 24 saat
      // Role göre yönlendirme
      switch (staff.role) {
        case 'waiter':
          router.push('/business/waiter');
          break;
        case 'chef':
          router.push('/business/kitchen');
          break;
        case 'cashier':
          router.push('/business/cashier');
          break;
        case 'manager':
          router.push('/business/dashboard');
          break;
        default:
          router.push('/business/dashboard');
      }
      return;
    }

    setError('Geçersiz kullanıcı adı veya şifre');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">İşletme Girişi</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/context/LanguageContext';
// React Icons yerine emoji kullanıyoruz

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { currentLanguage, setLanguage } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<'waiter' | 'kitchen' | 'cashier' | null>(null);

  const getLanguageCode = () => {
    switch (currentLanguage) {
      case 'English': return 'en';
      case 'German': return 'de';
      default: return 'tr';
    }
  };

  const languageCode = getLanguageCode();

  const translations = {
    en: {
      title: 'MasApp Business',
      subtitle: 'MasApp Login Panel',
      waiterPanel: 'Waiter Panel',
      waiterDesc: 'Manage orders and view customer calls',
      kitchenPanel: 'Kitchen Panel', 
      kitchenDesc: 'Prepare orders and update statuses',
      cashierPanel: 'Cashier Panel',
      cashierDesc: 'Take payments and manage cash operations',
      adminPanel: 'Admin Panel',
      adminDesc: 'Manage restaurants, users and system settings',
      selectRole: 'You can select any role for MasApp'
    },
    tr: {
      title: 'MasApp Business',
      subtitle: 'Panel Hızlı Erişim',
      waiterPanel: 'Garson Paneli',
      waiterDesc: 'Siparişleri yönet ve müşteri çağrılarını gör',
      kitchenPanel: 'Mutfak Paneli',
      kitchenDesc: 'Siparişleri hazırla ve durumları güncelle',
      cashierPanel: 'Kasa Paneli',
      cashierDesc: 'Ödemeleri al ve kasa işlemlerini yönet',
      adminPanel: 'Admin Paneli',
      adminDesc: 'Restoranları, kullanıcıları ve sistem ayarlarını yönet',
      selectRole: 'Hızlı erişim için rol seçin'
    },
    de: {
      title: 'MasApp Business',
      subtitle: 'MasApp Anmelde-Panel',
      waiterPanel: 'Kellner-Panel',
      waiterDesc: 'Bestellungen verwalten und Kundenanrufe anzeigen',
      kitchenPanel: 'Küchen-Panel',
      kitchenDesc: 'Bestellungen zubereiten und Status aktualisieren',
      cashierPanel: 'Kassierer-Panel',
      cashierDesc: 'Zahlungen entgegennehmen und Kassenvorgänge verwalten',
      adminPanel: 'Admin-Panel',
      adminDesc: 'Restaurants, Benutzer und Systemeinstellungen verwalten',
      selectRole: 'Sie können jede Rolle für MasApp auswählen'
    }
  };

  const t = translations[languageCode as 'en' | 'tr' | 'de'] || translations.tr;

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
        console.log('Redirecting to admin panel');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLanguage('Turkish')}
              className={`px-3 py-1 rounded ${languageCode === 'tr' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage('English')}
              className={`px-3 py-1 rounded ${languageCode === 'en' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('German')}
              className={`px-3 py-1 rounded ${languageCode === 'de' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              DE
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-purple-600 text-2xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-2">{t.subtitle}</p>
        </div>

        <div className="space-y-4">
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
              <div className="font-semibold">{t.waiterPanel}</div>
              <div className="text-sm opacity-90">{t.waiterDesc}</div>
            </div>
          </button>

                <button
            onClick={() => handleDemoLogin('kitchen')}
            className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <span className="text-xl">👨‍🍳</span>
            <div className="text-left">
              <div className="font-semibold">{t.kitchenPanel}</div>
              <div className="text-sm opacity-90">{t.kitchenDesc}</div>
            </div>
          </button>

          <button
            onClick={() => handleDemoLogin('cashier')}
            className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <span className="text-xl">💰</span>
            <div className="text-left">
              <div className="font-semibold">{t.cashierPanel}</div>
              <div className="text-sm opacity-90">{t.cashierDesc}</div>
            </div>
          </button>

            <button
            onClick={() => handleDemoLogin('restaurant_owner')}
            className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <span className="text-xl">🏪</span>
            <div className="text-left">
              <div className="font-semibold">{t.adminPanel}</div>
              <div className="text-sm opacity-90">{t.adminDesc}</div>
            </div>
          </button>
            </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {t.selectRole}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FaChartLine,
  FaUtensils,
  FaUsers,
  FaQrcode,
  FaChartBar,
  FaHeadset,
  FaCog,
  FaCreditCard,
  FaSignOutAlt,
  FaBars,
  FaConciergeBell,
  FaShoppingCart,
  FaMoneyBillWave
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';

interface BusinessSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export default function BusinessSidebar({ sidebarOpen, setSidebarOpen, onLogout }: BusinessSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [userInfo, setUserInfo] = useState<any>(null);

  // localStorage'dan kullanıcı bilgilerini yükle
  useEffect(() => {
    const loadUserInfo = () => {
      if (user) {
        setUserInfo(user);
      } else {
        // localStorage'dan kullanıcı bilgilerini çek
        const storedUser = localStorage.getItem('auth-storage');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed.state?.user) {
              setUserInfo(parsed.state.user);
            }
          } catch (error) {
            console.error('Kullanıcı bilgileri yüklenemedi:', error);
          }
        }
      }
    };

    loadUserInfo();
  }, [user]);

  // Kullanıcı rolüne göre menü öğelerini filtrele
  const getMenuItems = (userRole: UserRole) => {
    const allMenuItems = [
      {
        href: '/business/dashboard',
        icon: FaChartLine,
        label: 'Kontrol Paneli',
        roles: ['restaurant_owner', 'restaurant_admin', 'waiter', 'kitchen', 'cashier'],
        active: pathname === '/business/dashboard'
      },
      {
        href: '/business/waiter',
        icon: FaConciergeBell,
        label: 'Garson Paneli',
        roles: ['waiter', 'restaurant_owner', 'restaurant_admin'],
        active: pathname === '/business/waiter'
      },
      {
        href: '/business/kitchen',
        icon: FaUtensils,
        label: 'Mutfak Paneli',
        roles: ['kitchen', 'restaurant_owner', 'restaurant_admin'],
        active: pathname === '/business/kitchen'
      },
      {
        href: '/business/cashier',
        icon: FaMoneyBillWave,
        label: 'Kasa Paneli',
        roles: ['cashier', 'restaurant_owner', 'restaurant_admin'],
        active: pathname === '/business/cashier'
      },
      {
        href: '/admin/payment',
        icon: FaCreditCard,
        label: 'Ödeme & Abonelik',
        roles: ['restaurant_owner', 'restaurant_admin'],
        active: pathname === '/admin/payment'
      },
      {
        href: '/business/menu',
        icon: FaUtensils,
        label: 'Menü Yönetimi',
        roles: ['restaurant_owner', 'restaurant_admin', 'kitchen'],
        active: pathname === '/business/menu'
      },
      {
        href: '/business/orders',
        icon: FaShoppingCart,
        label: 'Siparişler',
        roles: ['restaurant_owner', 'restaurant_admin', 'waiter', 'kitchen', 'cashier'],
        active: pathname === '/business/orders'
      },
      {
        href: '/business/staff',
        icon: FaUsers,
        label: 'Personel',
        roles: ['restaurant_owner', 'restaurant_admin'],
        active: pathname === '/business/staff'
      },
      {
        href: '/business/qr-codes',
        icon: FaQrcode,
        label: 'QR Kodlar',
        roles: ['restaurant_owner', 'restaurant_admin'],
        active: pathname === '/business/qr-codes'
      },
      {
        href: '/business/reports',
        icon: FaChartBar,
        label: 'Raporlar',
        roles: ['restaurant_owner', 'restaurant_admin'],
        active: pathname === '/business/reports'
      },
      {
        href: '/business/support',
        icon: FaHeadset,
        label: 'Destek',
        roles: ['restaurant_owner', 'restaurant_admin', 'waiter', 'kitchen', 'cashier'],
        active: pathname === '/business/support'
      },
      {
        href: '/business/settings',
        icon: FaCog,
        label: 'Ayarlar',
        roles: ['restaurant_owner', 'restaurant_admin'],
        active: pathname === '/business/settings'
      }
    ];

    return allMenuItems.filter(item => 
      item.roles.includes(userRole)
    );
  };

  const menuItems = userInfo ? getMenuItems(userInfo.role) : [];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">MasApp</h1>
              <p className="text-purple-200 text-xs sm:text-sm mt-1">Restoran Yönetim Sistemi</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <FaBars className="text-lg" />
            </button>
          </div>

          <nav className="mt-4 sm:mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 transition-colors rounded-r-lg mx-2 sm:mx-0 ${
                    item.active
                      ? 'bg-purple-700 bg-opacity-50 border-l-4 border-white'
                      : 'hover:bg-purple-700 hover:bg-opacity-50'
                  }`}
                >
                  <Icon className="mr-2 sm:mr-3 text-sm sm:text-base" />
                  <span className="text-sm sm:text-base font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-purple-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'M'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{userInfo?.name || 'MasApp'}</p>
                  <p className="text-xs text-purple-200">{userInfo?.email || 'info@masapp.com'}</p>
                  {userInfo?.role && (
                    <p className="text-xs text-purple-300 capitalize">
                      {userInfo.role === 'restaurant_owner' && 'İşletme Sahibi'}
                      {userInfo.role === 'restaurant_admin' && 'İşletme Yöneticisi'}
                      {userInfo.role === 'waiter' && 'Garson'}
                      {userInfo.role === 'kitchen' && 'Mutfak'}
                      {userInfo.role === 'cashier' && 'Kasa'}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <FaSignOutAlt className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

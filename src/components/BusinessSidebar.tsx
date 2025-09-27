'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  FaHome,
  FaUtensils,
  FaUsers,
  FaQrcode,
  FaShoppingCart,
  FaChartBar,
  FaHeadset,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaStore,
  FaClipboardList,
  FaConciergeBell,
  FaMoneyBillWave
} from 'react-icons/fa';

interface BusinessSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function BusinessSidebar({ sidebarOpen, setSidebarOpen }: BusinessSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'restaurant_owner': return 'Restoran Sahibi';
      case 'restaurant_admin': return 'Restoran Yöneticisi';
      case 'waiter': return 'Garson';
      case 'kitchen': return 'Mutfak';
      case 'cashier': return 'Kasa';
      default: return 'Kullanıcı';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'restaurant_owner': return 'from-purple-600 to-purple-800';
      case 'restaurant_admin': return 'from-blue-600 to-blue-800';
      case 'waiter': return 'from-green-600 to-green-800';
      case 'kitchen': return 'from-orange-600 to-orange-800';
      case 'cashier': return 'from-yellow-600 to-yellow-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      {
        href: '/business/dashboard',
        icon: FaHome,
        label: 'Dashboard',
        active: pathname === '/business/dashboard'
      }
    ];

    // Restaurant owner and admin can see all items
    if (user?.role === 'restaurant_owner' || user?.role === 'restaurant_admin') {
      baseItems.push(
        {
          href: '/business/menu',
          icon: FaUtensils,
          label: 'Menü Yönetimi',
          active: pathname === '/business/menu'
        },
        {
          href: '/business/staff',
          icon: FaUsers,
          label: 'Personel',
          active: pathname === '/business/staff'
        },
        {
          href: '/business/qr-codes',
          icon: FaQrcode,
          label: 'QR Kodlar',
          active: pathname === '/business/qr-codes'
        },
        {
          href: '/business/orders',
          icon: FaShoppingCart,
          label: 'Siparişler',
          active: pathname === '/business/orders'
        },
        {
          href: '/business/reports',
          icon: FaChartBar,
          label: 'Raporlar',
          active: pathname === '/business/reports'
        },
        {
          href: '/business/settings',
          icon: FaCog,
          label: 'Ayarlar',
          active: pathname === '/business/settings'
        }
      );
    }

    // Waiter specific items
    if (user?.role === 'waiter') {
      baseItems.push(
        {
          href: '/business/waiter',
          icon: FaConciergeBell,
          label: 'Garson Paneli',
          active: pathname === '/business/waiter'
        },
        {
          href: '/business/orders',
          icon: FaShoppingCart,
          label: 'Siparişler',
          active: pathname === '/business/orders'
        }
      );
    }

    // Kitchen specific items
    if (user?.role === 'kitchen') {
      baseItems.push(
        {
          href: '/kitchen',
          icon: FaUtensils,
          label: 'Mutfak Paneli',
          active: pathname === '/kitchen'
        }
      );
    }

    // Cashier specific items
    if (user?.role === 'cashier') {
      baseItems.push(
        {
          href: '/business/cashier',
          icon: FaMoneyBillWave,
          label: 'Kasa Paneli',
          active: pathname === '/business/cashier'
        },
        {
          href: '/business/orders',
          icon: FaShoppingCart,
          label: 'Siparişler',
          active: pathname === '/business/orders'
        }
      );
    }

    // Support for all roles
    baseItems.push({
      href: '/business/support',
      icon: FaHeadset,
      label: 'Destek',
      active: pathname === '/business/support'
    });

    return baseItems;
  };

  const menuItems = getMenuItems();

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
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b ${getRoleColor(user?.role || 'default')} text-white transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaStore className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MasApp</h1>
                <p className="text-white/80 text-xs">Restoran Yönetim</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="mb-8 p-4 bg-white/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{user.name || 'Kullanıcı'}</p>
                  <p className="text-white/80 text-sm">{getRoleDisplayName(user.role)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    item.active
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-4 border-t border-white/20">
            <button
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt className="h-5 w-5" />
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
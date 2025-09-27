'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  FaBars, 
  FaTimes, 
  FaChartLine, 
  FaUsers, 
  FaStore, 
  FaBell, 
  FaCog, 
  FaShieldAlt,
  FaDatabase,
  FaRocket,
  FaSignOutAlt,
  FaHome,
  FaCog as FaSettings,
  FaFileAlt,
  FaCreditCard,
  FaChartBar
} from 'react-icons/fa';

interface ModernAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function ModernAdminLayout({ children, title, description }: ModernAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: FaHome },
    { name: 'Restoranlar', href: '/admin/restaurants', icon: FaStore },
    { name: 'Kullanıcılar', href: '/admin/users', icon: FaUsers },
    { name: 'Raporlar', href: '/admin/reports', icon: FaChartBar },
    { name: 'Bildirimler', href: '/admin/notifications', icon: FaBell },
    { name: 'Ödemeler', href: '/admin/payments', icon: FaCreditCard },
    { name: 'Güvenlik', href: '/admin/security', icon: FaShieldAlt },
    { name: 'Sistem', href: '/admin/system', icon: FaDatabase },
    { name: 'Ayarlar', href: '/admin/settings', icon: FaSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MasApp</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.role === 'super_admin' ? 'Süper Yönetici' : 'Yönetici'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="text-sm">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaBars className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{title || 'Admin Panel'}</h1>
                  {description && (
                    <p className="text-gray-600">{description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <FaBell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">Süper Yönetici</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

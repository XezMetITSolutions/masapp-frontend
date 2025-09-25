'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome,
  FaStore,
  FaUsers,
  FaQrcode,
  FaChartLine,
  FaCog,
  FaCreditCard,
  FaSignOutAlt,
  FaBell,
  FaShieldAlt,
  FaFileAlt,
  FaDatabase,
  FaCogs,
  FaGlobe,
  FaLock,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaUserCog,
  FaChartBar,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaServer,
  FaLanguage,
  FaHeadset,
  FaClipboardList,
  FaRocket,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaInfoCircle
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState(0);

  // Menü yapısı
  const menuItems = [
    {
      id: 'dashboard',
      title: 'Ana Panel',
      icon: FaHome,
      href: '/admin/dashboard',
      badge: null
    },
    {
      id: 'restaurants',
      title: 'Restoran Yönetimi',
      icon: FaStore,
      href: '/admin/restaurants',
      badge: null,
      submenu: [
        { title: 'Tüm Restoranlar', href: '/admin/restaurants' },
        { title: 'Yeni Restoran Ekle', href: '/admin/restaurants/add' },
        { title: 'Onay Bekleyenler', href: '/admin/restaurants/approve' },
        { title: 'QR Kod Yönetimi', href: '/admin/qr-management' }
      ]
    },
    {
      id: 'users',
      title: 'Kullanıcı Yönetimi',
      icon: FaUsers,
      href: '/admin/users',
      badge: null,
      submenu: [
        { title: 'Tüm Kullanıcılar', href: '/admin/users' },
        { title: 'Yeni Kullanıcı Ekle', href: '/admin/users/add' },
        { title: 'Onay Bekleyenler', href: '/admin/user-approvals' },
        { title: 'Rol Yönetimi', href: '/admin/users/roles' }
      ]
    },
    {
      id: 'orders',
      title: 'Sipariş Yönetimi',
      icon: FaClipboardList,
      href: '/admin/orders',
      badge: null,
      submenu: [
        { title: 'Aktif Siparişler', href: '/admin/orders' },
        { title: 'Sipariş Geçmişi', href: '/admin/orders/history' },
        { title: 'İptal Edilenler', href: '/admin/orders/cancelled' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analitik & Raporlar',
      icon: FaChartBar,
      href: '/admin/analytics',
      badge: null,
      submenu: [
        { title: 'Genel Analitik', href: '/admin/analytics' },
        { title: 'Satış Raporları', href: '/admin/reports' },
        { title: 'Finansal Raporlar', href: '/admin/financial-reports' },
        { title: 'Performans Analizi', href: '/admin/performance' }
      ]
    },
    {
      id: 'payments',
      title: 'Ödeme Yönetimi',
      icon: FaCreditCard,
      href: '/admin/payment',
      badge: null,
      submenu: [
        { title: 'Ödeme İşlemleri', href: '/admin/payment' },
        { title: 'Ödeme Hataları', href: '/admin/payment-errors' },
        { title: 'Abonelik Yönetimi', href: '/admin/subscriptions' },
        { title: 'Fatura Yönetimi', href: '/admin/invoices' }
      ]
    },
    {
      id: 'notifications',
      title: 'Bildirimler',
      icon: FaBell,
      href: '/admin/notifications',
      badge: notifications,
      submenu: [
        { title: 'Tüm Bildirimler', href: '/admin/notifications' },
        { title: 'Yeni Bildirim Oluştur', href: '/admin/notifications/create' },
        { title: 'Bildirim Şablonları', href: '/admin/notifications/templates' }
      ]
    },
    {
      id: 'system',
      title: 'Sistem Yönetimi',
      icon: FaCogs,
      href: '/admin/system',
      badge: null,
      submenu: [
        { title: 'Sistem Durumu', href: '/admin/system' },
        { title: 'Sistem Logları', href: '/admin/system-logs' },
        { title: 'Sistem Güncellemeleri', href: '/admin/system-updates' },
        { title: 'Yedekleme', href: '/admin/backup' },
        { title: 'API Yönetimi', href: '/admin/api-management' }
      ]
    },
    {
      id: 'security',
      title: 'Güvenlik',
      icon: FaShieldAlt,
      href: '/admin/security',
      badge: null,
      submenu: [
        { title: 'Güvenlik Ayarları', href: '/admin/security' },
        { title: '2FA Yönetimi', href: '/admin/2fa' },
        { title: 'Giriş Logları', href: '/admin/logs' },
        { title: 'Güvenlik Raporları', href: '/admin/security/reports' }
      ]
    },
    {
      id: 'content',
      title: 'İçerik Yönetimi',
      icon: FaFileAlt,
      href: '/admin/content',
      badge: null,
      submenu: [
        { title: 'Menü Yönetimi', href: '/admin/menu' },
        { title: 'Duyurular', href: '/admin/announcements' },
        { title: 'Çeviriler', href: '/admin/translations' },
        { title: 'Dokümantasyon', href: '/admin/documentation' }
      ]
    },
    {
      id: 'settings',
      title: 'Ayarlar',
      icon: FaCog,
      href: '/admin/settings',
      badge: null,
      submenu: [
        { title: 'Genel Ayarlar', href: '/admin/settings' },
        { title: 'Alt Domain Yönetimi', href: '/admin/subdomains' },
        { title: 'Test Ortamı', href: '/admin/test' }
      ]
    },
    {
      id: 'support',
      title: 'Destek',
      icon: FaHeadset,
      href: '/admin/support',
      badge: null
    }
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    logout();
  };

  // Bildirim sayısını yükle
  useEffect(() => {
    // Gerçek uygulamada API'den gelecek
    setNotifications(5);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transform transition-all duration-300 ease-in-out z-50 shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold group-hover:text-blue-300 transition-colors duration-200">MasApp Admin</h1>
                <p className="text-slate-400 text-sm">Süper Yönetici</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-blue-300 transition-colors duration-200">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@masapp.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => item.submenu && toggleMenu(item.id)}
                  className={`group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`text-lg transition-all duration-200 ${isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white group-hover:scale-110'}`} />
                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.submenu && (
                    <div className="text-slate-400 group-hover:text-white transition-all duration-200 group-hover:scale-110">
                      {expandedMenus.has(item.id) ? (
                        <FaChevronDown className="text-sm" />
                      ) : (
                        <FaChevronRight className="text-sm" />
                      )}
                    </div>
                  )}
                </Link>

                {/* Submenu */}
                {item.submenu && expandedMenus.has(item.id) && (
                  <div className="ml-8 mt-1 space-y-1 animate-slideDown">
                    {item.submenu.map((subItem, index) => (
                      <Link
                        key={index}
                        href={subItem.href}
                        className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 hover:translate-x-2 ${
                          isActive(subItem.href)
                            ? 'bg-slate-700 text-white shadow-md'
                            : 'text-slate-400 hover:bg-slate-700 hover:text-white hover:shadow-sm'
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 hover:scale-105 group"
          >
            <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">Çıkış Yap</span>
          </button>
        </div>
      </div>
    </>
  );
}

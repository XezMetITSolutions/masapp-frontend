'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaStore, 
  FaUsers, 
  FaQrcode, 
  FaChartLine,
  FaCog,
  FaCreditCard,
  FaSignOutAlt,
  FaPlus,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaLanguage,
  FaBars,
  FaMoneyBillWave,
  FaShieldAlt,
  FaFileAlt,
  FaCogs,
  FaGlobe,
  FaLock,
  FaHeadset,
  FaClipboardList,
  FaRocket,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaSync,
  FaTimesCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';
import AdminSidebar from '@/components/AdminSidebar';
import AdminNotificationCenter from '@/components/AdminNotificationCenter';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { restaurants } = useRestaurantStore();
  const [stats, setStats] = useState({
    totalRestaurants: 1247,
    activeRestaurants: 1189,
    pendingRestaurants: 45,
    suspendedRestaurants: 13,
    totalOrders: 15432,
    monthlyRevenue: 2400000,
    totalUsers: 15432,
    activeUsers: 12890,
    revenueGrowth: 15.3,
    orderGrowth: 8.2,
    userGrowth: 12.5,
    restaurantGrowth: 12.0
  });
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'restaurant',
      title: 'Yeni Restoran Kaydı',
      description: 'Pizza Palace - 2 saat önce',
      status: 'approved',
      icon: FaStore
    },
    {
      id: 2,
      type: 'payment',
      title: 'Ödeme Hatası',
      description: 'Cafe Central - 4 saat önce',
      status: 'pending',
      icon: FaExclamationCircle
    },
    {
      id: 3,
      type: 'user',
      title: 'Kullanıcı Onayı',
      description: 'John Doe - 6 saat önce',
      status: 'completed',
      icon: FaUsers
    }
  ]);
  const [topRestaurants, setTopRestaurants] = useState([
    { name: 'Lezzet Durağı', orders: 1250, revenue: 45000 },
    { name: 'Pizza Palace', orders: 980, revenue: 32000 },
    { name: 'Cafe Central', orders: 750, revenue: 28000 }
  ]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);

  useEffect(() => {
    // Güvenli kullanıcı kontrolü
    const checkAuth = async () => {
      const { checkAuth: authCheck, isAdmin } = useAuthStore.getState();
      const isValid = await authCheck();
      
      if (!isValid || !isAdmin()) {
        router.push('/admin/login');
        return;
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const quickActions = [
    {
      title: 'Restoran Ekle',
      description: 'Yeni restoran kaydı',
      icon: FaStore,
      href: '/admin/restaurants/add',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Kullanıcı Yönet',
      description: 'Kullanıcı hesapları',
      icon: FaUsers,
      href: '/admin/users',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Bildirim Gönder',
      description: 'Toplu bildirim',
      icon: FaBell,
      href: '/admin/notifications/create',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Sistem Ayarları',
      description: 'Genel ayarlar',
      icon: FaCog,
      href: '/admin/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      title: 'QR Oluştur',
      description: 'QR kod üretimi',
      icon: FaQrcode,
      href: '/admin/qr-generator',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Raporlar',
      description: 'Sistem raporları',
      icon: FaChartLine,
      href: '/admin/reports',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Ödeme Hataları',
      description: 'Hata takibi',
      icon: FaExclamationCircle,
      href: '/admin/payment-errors',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Güvenlik',
      description: 'Güvenlik ayarları',
      icon: FaShieldAlt,
      href: '/admin/security',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaBars className="text-xl text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">MasApp Admin</h1>
            <button
              onClick={() => setNotificationCenterOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaBell className="text-xl text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                5
              </span>
            </button>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 hidden lg:block">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Süper Yönetici Paneli</h1>
              <p className="text-gray-600">Sistem genel durumu ve yönetim paneli</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNotificationCenterOpen(true)}
                className="relative p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBell className="text-xl text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  5
                </span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Süper Yönetici</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">

          {/* System Status */}
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <div className="flex-shrink-0">
                <FaCheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Sistem: Online</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Restoran</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {stats.totalRestaurants.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    +{stats.restaurantGrowth}% bu ay
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaStore className="text-blue-600 text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aktif Restoran</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {stats.activeRestaurants.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    %{Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100)} aktif
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaCheckCircle className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    +{stats.userGrowth}% bu ay
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaUsers className="text-purple-600 text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aylık Gelir</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    ₺{(stats.monthlyRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    +{stats.revenueGrowth}% bu ay
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <FaMoneyBillWave className="text-orange-600 text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hızlı Eylemler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow text-center group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="text-white text-xl" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Son Aktiviteler</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-full mr-4">
                        <activity.icon className="text-gray-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {activity.status === 'approved' ? 'Onaylandı' :
                             activity.status === 'pending' ? 'Beklemede' :
                             'Tamamlandı'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Restaurants */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">En Başarılı Restoranlar</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="space-y-4">
                  {topRestaurants.map((restaurant, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{restaurant.name}</p>
                          <p className="text-sm text-gray-500">{restaurant.orders} sipariş</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₺{restaurant.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">gelir</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notification Center */}
      <AdminNotificationCenter 
        isOpen={notificationCenterOpen} 
        onClose={() => setNotificationCenterOpen(false)} 
      />
    </div>
  );
}
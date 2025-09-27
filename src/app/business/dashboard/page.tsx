'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BusinessSidebar from '@/components/BusinessSidebar';
import { 
  FaStore, 
  FaUtensils, 
  FaUsers, 
  FaShoppingCart,
  FaChartLine,
  FaQrcode,
  FaHeadset,
  FaCog,
  FaSignOutAlt,
  FaBullhorn,
  FaBars,
  FaMoneyBillWave,
  FaPlus,
  FaEye,
  FaEdit,
  FaConciergeBell,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';

export default function BusinessDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentRestaurant } = useRestaurantStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    todayRevenue: 0,
    activeTables: 0,
    menuItems: 0,
    ready: false
  });

  useEffect(() => {
    // Kullanıcı bilgilerini kontrol et
    if (!user) {
      router.push('/business/login');
      return;
    }

    // Restoran kontrolü
    const currentRestaurant = localStorage.getItem('current-restaurant');
    if (!currentRestaurant) {
      // Restoran bilgisi yoksa ana sayfaya yönlendir
      window.location.href = 'https://guzellestir.com';
      return;
    }

    try {
      const restaurant = JSON.parse(currentRestaurant);
      if (restaurant.status !== 'active') {
        // Restoran aktif değilse ana sayfaya yönlendir
        window.location.href = 'https://guzellestir.com';
        return;
      }
    } catch (error) {
      console.error('Restoran bilgisi okunamadı:', error);
      window.location.href = 'https://guzellestir.com';
      return;
    }

    // Dashboard istatistiklerini yükle
    const loadDashboardData = () => {
      try {
        // localStorage'dan verileri al
        const orders = JSON.parse(localStorage.getItem('masapp-orders') || '[]');
        const menuItems = JSON.parse(localStorage.getItem('masapp-menu') || '[]');
        const payments = JSON.parse(localStorage.getItem('masapp-payments') || '[]');
        
        // Restoran ID'sine göre filtrele
        const restaurantOrders = orders.filter((order: any) => order.restaurantId === user.restaurantId);
        const restaurantPayments = payments.filter((payment: any) => payment.restaurantId === user.restaurantId);
        
        // Bugünkü siparişleri filtrele
        const today = new Date().toDateString();
        const todayOrders = restaurantOrders.filter((order: any) => 
          new Date(order.createdAt).toDateString() === today
        );
        
        // Bugünkü geliri hesapla
        const todayRevenue = restaurantPayments
          .filter((payment: any) => 
            payment.status === 'completed' && 
            new Date(payment.createdAt).toDateString() === today
          )
          .reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0);

        // Aktif masaları hesapla (son 30 dakikada sipariş veren masalar)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const activeTables = new Set(
          restaurantOrders
            .filter((order: any) => new Date(order.createdAt) > thirtyMinutesAgo)
            .map((order: any) => order.tableNumber)
        ).size;

        setDashboardStats({
          totalOrders: restaurantOrders.length,
          todayRevenue,
          activeTables,
          menuItems: menuItems.length,
          ready: true
        });
      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata:', error);
        setDashboardStats({
          totalOrders: 0,
          todayRevenue: 0,
          activeTables: 0,
          menuItems: 0,
          ready: true
        });
      }
    };

    loadDashboardData();
  }, [user, router]);

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
      case 'restaurant_owner': return 'bg-purple-100 text-purple-800';
      case 'restaurant_admin': return 'bg-blue-100 text-blue-800';
      case 'waiter': return 'bg-green-100 text-green-800';
      case 'kitchen': return 'bg-orange-100 text-orange-800';
      case 'cashier': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yönlendiriliyor...</p>
        </div>
      </div>
    );
  }

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
      <BusinessSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <FaBars className="h-6 w-6" />
                </button>
                <h1 className="ml-2 lg:ml-0 text-2xl font-bold text-gray-900">
                  Dashboard
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'Kullanıcı'}</p>
                    <p className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                  title="Çıkış Yap"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Hoş Geldiniz, {user.name || 'Kullanıcı'}! 👋
                  </h2>
                  <p className="text-purple-100">
                    {currentRestaurant?.name || 'Restoran'} yönetim paneline hoş geldiniz.
                  </p>
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <FaStore className="h-16 w-16 text-purple-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Toplam Sipariş */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardStats.ready ? dashboardStats.totalOrders : '...'}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <FaArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+12% bu ay</span>
              </div>
            </div>

            {/* Bugünkü Gelir */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bugünkü Gelir</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₺{dashboardStats.ready ? dashboardStats.todayRevenue.toLocaleString() : '...'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaMoneyBillWave className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <FaArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+8% dün</span>
              </div>
            </div>

            {/* Aktif Masalar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Masalar</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardStats.ready ? dashboardStats.activeTables : '...'}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FaConciergeBell className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <FaClock className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600 ml-1">Son 30 dk</span>
              </div>
            </div>

            {/* Menü Öğeleri */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menü Öğeleri</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardStats.ready ? dashboardStats.menuItems : '...'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaUtensils className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <FaCheckCircle className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-purple-600 ml-1">Aktif</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hızlı Erişim */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/business/menu" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaUtensils className="h-8 w-8 text-pink-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Menü Yönetimi</p>
                    <p className="text-sm text-gray-500">Ürünleri düzenle</p>
                  </div>
                </Link>
                
                <Link 
                  href="/business/orders" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaShoppingCart className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Siparişler</p>
                    <p className="text-sm text-gray-500">Siparişleri görüntüle</p>
                  </div>
                </Link>
                
                <Link 
                  href="/business/qr-codes" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaQrcode className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">QR Kodlar</p>
                    <p className="text-sm text-gray-500">Masa QR'ları</p>
                  </div>
                </Link>
                
                <Link 
                  href="/business/staff" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaUsers className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Personel</p>
                    <p className="text-sm text-gray-500">Çalışanları yönet</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Son Aktiviteler */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Yeni sipariş alındı</p>
                    <p className="text-xs text-gray-500">Masa 5 - 2 dakika önce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Menü güncellendi</p>
                    <p className="text-xs text-gray-500">3 yeni ürün eklendi</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Ödeme tamamlandı</p>
                    <p className="text-xs text-gray-500">Masa 3 - ₺45.50</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">QR kod oluşturuldu</p>
                    <p className="text-xs text-gray-500">Masa 8 için yeni QR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role-based Additional Info */}
          {user.role === 'restaurant_owner' && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start">
                <FaExclamationTriangle className="h-6 w-6 text-blue-600 mt-1 mr-3" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Restoran Sahibi Paneli</h4>
                  <p className="text-blue-800 mb-4">
                    Tüm restoran ayarlarını yönetebilir, personel ekleyebilir ve finansal raporları görüntüleyebilirsiniz.
                  </p>
                  <div className="flex space-x-3">
                    <Link 
                      href="/business/reports" 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Raporları Görüntüle
                    </Link>
                    <Link 
                      href="/business/settings" 
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Ayarlar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
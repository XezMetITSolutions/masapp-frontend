'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnnouncementQuickModal from '@/components/AnnouncementQuickModal';
import BusinessSidebar from '@/components/BusinessSidebar';
import { 
  FaStore, 
  FaUtensils, 
  FaUsers, 
  FaShoppingCart,
  FaChartLine,
  FaChartBar,
  FaQrcode,
  FaCog,
  FaSignOutAlt,
  FaClipboardList,
  FaTimes,
  FaBullhorn,
  FaBars,
  FaMoneyBillWave,
  FaPlus,
  FaEye,
  FaEdit
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';
import { useState } from 'react';
import BusinessPaymentModal from '@/components/BusinessPaymentModal';

export default function BusinessDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentRestaurant } = useRestaurantStore();
  
  // Premium plan state'leri
  const [currentPlan, setCurrentPlan] = useState('premium'); // basic, premium, enterprise
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<{[key: string]: number}>({});
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'sixMonths' | 'yearly'>('monthly');
  const [corporateBillingCycle, setCorporateBillingCycle] = useState<'monthly' | 'sixMonths' | 'yearly'>('monthly');
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'corporate'>('premium');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Restoranlar sayfasından alınan planlar ve fiyatlar
  const plans = {
    premium: {
      name: 'Premium Paket',
      description: 'Küçük ve orta ölçekli işletmeler için',
      features: [
        'QR Menü Sistemi (Sınırsız menü, anlık güncelleme)',
        'Mutfak Paneli (5 kullanıcı, sipariş takibi)',
        'Garson Paneli (3 kullanıcı, masa yönetimi)',
        'Kasa Paneli (Finansal raporlar, ödeme takibi)',
        'Analitik & Raporlama (Detaylı satış analizi)',
        'AI Menü Optimizasyonu (Ürün fotoğraf iyileştirme)',
        'Güvenli Ödeme Sistemi (PCI DSS uyumlu)',
        'Çoklu Dil Desteği (TR/EN)',
        'Mobil Uyumlu Tasarım',
        '7/24 Teknik Destek'
      ],
      monthlyPrice: 4980,
      sixMonthsPrice: 24900,
      yearlyPrice: 47900
    },
    corporate: {
      name: 'Kurumsal Paket',
      description: 'Büyük işletmeler ve zincirler için',
      features: [
        'Tüm Premium özellikler',
        'Sınırsız Kullanıcı (Tüm paneller)',
        'Çoklu Şube Yönetimi',
        'Özel Menü & Logo Entegrasyonu',
        'API Entegrasyonları (POS, Muhasebe)',
        'Beyaz Etiket Çözümü',
        'Özel Eğitim & Kurulum',
        '7/24 Telefon Desteği',
        'Özel Rapor Şablonları',
        'Gelişmiş Güvenlik'
      ],
      monthlyPrice: 9980,
      sixMonthsPrice: 49900,
      yearlyPrice: 95900
    }
  };

  // Demo veriler
  const stats = {
    dailyRevenue: 12500,
    monthlyRevenue: 375000,
    activeTables: 8,
    totalOrders: 156,
    averageOrderValue: 80,
    customerSatisfaction: 4.8
  };

  const activeOrders = [
    { id: 1, table: 5, items: 3, total: 145, status: 'preparing', time: '8 dk' },
    { id: 2, table: 8, items: 2, total: 89, status: 'ready', time: '2 dk' },
    { id: 3, table: 3, items: 5, total: 210, status: 'preparing', time: '15 dk' }
  ];

  useEffect(() => {
    // Sayfa yüklendiğinde demo işletme kullanıcısı oluştur
    const timer = setTimeout(() => {
      if (!user) {
        const demoUser = {
          id: 'masapp-demo-1',
          name: 'MasApp',
          email: 'info@masapp.com',
          role: 'restaurant_owner' as const,
          restaurantId: 'masapp-demo-1',
          status: 'active' as const,
          createdAt: new Date()
        };
        
        // Demo kullanıcıyı login et
        const { login } = useAuthStore.getState();
        login(demoUser, 'demo-token');
      }
    }, 100); // Kısa bir gecikme ile

    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/business/login');
  };

  // Plan yükseltme fonksiyonları
  const handlePlanUpgrade = (planType: string) => {
    setShowUpgradeModal(true);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const newServices = { ...prev };
      if (newServices[serviceId]) {
        delete newServices[serviceId];
      } else {
        newServices[serviceId] = 1;
      }
      return newServices;
    });
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedServices(prev => {
        const newServices = { ...prev };
        delete newServices[serviceId];
        return newServices;
      });
    } else {
      setSelectedServices(prev => ({
        ...prev,
        [serviceId]: quantity
      }));
    }
  };

  const calculateTotal = () => {
    const selectedPlan = plans[selectedPlan as keyof typeof plans];
    let basePrice = 0;
    
    if (billingCycle === 'monthly') {
      basePrice = selectedPlan.monthlyPrice;
    } else if (billingCycle === 'sixMonths') {
      basePrice = selectedPlan.sixMonthsPrice;
    } else {
      basePrice = selectedPlan.yearlyPrice;
    }
    
    return basePrice;
  };

  const handlePayment = () => {
    // Ödeme işlemi burada yapılacak
    console.log('Payment processed');
    setShowPaymentModal(false);
  };

  const handleCancelPlan = () => {
    setShowUpgradeModal(false);
    setSelectedFeatures([]);
    setSelectedServices({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="ml-0 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBars className="text-xl text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kontrol Paneli</h1>
                <p className="text-sm text-gray-600">Hoş geldiniz, {user?.name || 'MasApp'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{currentRestaurant?.name || 'MasApp Demo'}</p>
                <p className="text-xs text-gray-500">Premium Plan</p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaRocket className="inline mr-2" />
                Plan Yükselt
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-3 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                  <FaMoneyBillWave className="text-lg sm:text-xl text-green-600" />
                </div>
                <span className="text-xs sm:text-sm text-green-600 font-medium">+12% bu ay</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">₺{stats.dailyRevenue.toLocaleString('tr-TR')}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Günlük Ciro</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <FaShoppingCart className="text-lg sm:text-xl text-blue-600" />
                </div>
                <span className="text-xs sm:text-sm text-blue-600 font-medium">{stats.totalOrders} sipariş</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{stats.averageOrderValue}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Ortalama Sipariş</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                  <FaChartLine className="text-lg sm:text-xl text-purple-600" />
                </div>
                <span className="text-xs sm:text-sm text-purple-600 font-medium">₺{stats.monthlyRevenue.toLocaleString('tr-TR')}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Aylık</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Toplam Ciro</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                  <FaUsers className="text-lg sm:text-xl text-orange-600" />
                </div>
                <span className="text-xs sm:text-sm text-orange-600 font-medium">{stats.activeTables} aktif</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{currentRestaurant?.tableCount || 15}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Toplam Masa</p>
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aktif Siparişler */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Aktif Siparişler</h3>
                <Link href="/business/orders" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Tümünü Gör →
                </Link>
              </div>
              <div className="space-y-3">
                {activeOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-purple-600">{order.table}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Masa {order.table}</p>
                        <p className="text-sm text-gray-500">{order.items} ürün • ₺{order.total}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'ready' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'ready' ? 'Hazır' : 'Hazırlanıyor'}
                      </span>
                      <span className="text-xs text-gray-500">{order.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hızlı İşlemler */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hızlı İşlemler</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/business/menu" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex flex-col items-center justify-center gap-2">
                  <FaPlus className="text-xl text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Yeni Ürün</span>
                </Link>
                <Link href="/business/orders" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2">
                  <FaEye className="text-xl text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Siparişleri Gör</span>
                </Link>
                <Link href="/business/menu" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center justify-center gap-2">
                  <FaEdit className="text-xl text-green-600" />
                  <span className="text-sm font-medium text-green-800">Menüyü Düzenle</span>
                </Link>
                <button onClick={() => setShowAnnModal(true)} className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors flex flex-col items-center justify-center gap-2">
                  <FaBullhorn className="text-xl text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Duyurular (Aktif)</span>
                </button>
              </div>
            </div>
            <AnnouncementQuickModal isOpen={showAnnModal} onClose={() => setShowAnnModal(false)} />
          </div>

          {/* Aylık Özet */}
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-sm p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">Aylık Performans</h3>
                <p className="text-purple-200 mb-4">Bu ay harika gidiyorsunuz!</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-3xl font-bold">₺{stats.monthlyRevenue.toLocaleString('tr-TR')}</p>
                    <p className="text-purple-200 text-sm">Toplam Ciro</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">486</p>
                    <p className="text-purple-200 text-sm">Toplam Sipariş</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">4.8</p>
                    <p className="text-purple-200 text-sm">Ortalama Puan</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">92%</p>
                    <p className="text-purple-200 text-sm">Müşteri Memnuniyeti</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Eski Modal - Kaldırıldı */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Plan Yükseltme</h2>
              <button
                onClick={handleCancelPlan}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <BusinessPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPayment={handlePayment}
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
          totalAmount={calculateTotal()}
        />
      )}
    </div>
  );
}

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
  FaHeadset,
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
import { useLanguage } from '@/context/LanguageContext';

export default function BusinessDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentRestaurant } = useRestaurantStore();
  const { currentLanguage, setLanguage } = useLanguage();

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
      title: 'Business Dashboard',
      subtitle: 'Restaurant Management',
      logout: 'Logout'
    },
    tr: {
      title: 'İşletme Paneli',
      subtitle: 'Restoran Yönetimi',
      logout: 'Çıkış'
    },
    de: {
      title: 'Geschäfts-Dashboard',
      subtitle: 'Restaurant-Management',
      logout: 'Abmelden'
    }
  };

  const t = translations[languageCode as 'en' | 'tr' | 'de'] || translations.tr;
  
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
  const [dashboardStats, setDashboardStats] = useState({
    todayOrders: 0,
    activeOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    totalMenuItems: 0,
    activeCategories: 0,
    totalWaiters: 0,
    activeTables: 0,
    totalOrders: 0,
    averageRating: 0,
    customerSatisfaction: 0,
    ordersGrowth: 0,
    revenueGrowth: 0
  });
  const [activeOrders, setActiveOrders] = useState<any[]>([]);

  // localStorage'dan gerçek verileri yükle
  useEffect(() => {
    const loadDashboardData = () => {
      // Kullanıcının restoran ID'sini al
      const currentUser = user;
      const restaurantId = currentUser?.restaurantId;
      
      if (!restaurantId) {
        console.log('Restoran ID bulunamadı, genel veriler yükleniyor');
        return;
      }

      // Restoran özelinde sipariş verilerini yükle
      const savedOrders = localStorage.getItem(`masapp-restaurant-${restaurantId}-orders`);
      let orders = [];
      if (savedOrders) {
        try {
          orders = JSON.parse(savedOrders);
        } catch (e) {
          console.error('Sipariş verileri yüklenemedi:', e);
        }
      }

      // Restoran özelinde personel verilerini yükle
      const savedStaff = localStorage.getItem(`masapp-restaurant-${restaurantId}-staff`);
      let staff = [];
      if (savedStaff) {
        try {
          staff = JSON.parse(savedStaff);
        } catch (e) {
          console.error('Personel verileri yüklenemedi:', e);
        }
      }

      // Bugünkü siparişleri hesapla
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter((order: any) => 
        order.createdAt && order.createdAt.startsWith(today)
      );

      // Aktif siparişleri hesapla
      const activeOrdersList = orders.filter((order: any) => 
        ['pending', 'preparing', 'ready'].includes(order.status)
      );

      // Bugünkü ciroyu hesapla
      const todayRevenue = todayOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

      // Aylık ciroyu hesapla
      const currentMonth = new Date().toISOString().substring(0, 7);
      const monthlyOrders = orders.filter((order: any) => 
        order.createdAt && order.createdAt.startsWith(currentMonth)
      );
      const monthlyRevenue = monthlyOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

      // Menü ürünlerini hesapla (tüm siparişlerdeki benzersiz ürünler)
      const allItems = orders.flatMap((order: any) => order.items || []);
      const uniqueItems = new Set(allItems.map((item: any) => item.name));
      const totalMenuItems = uniqueItems.size;

      // Aktif kategorileri hesapla
      const categories = new Set(allItems.map((item: any) => item.category));
      const activeCategories = categories.size;

      // Aktif garsonları hesapla
      const activeWaiters = staff.filter((member: any) => 
        member.role === 'waiter' && member.status === 'active'
      ).length;

      // Aktif masaları hesapla (siparişi olan masalar)
      const activeTableNumbers = new Set(activeOrdersList.map((order: any) => order.tableNumber));
      const activeTables = activeTableNumbers.size;

      // Toplam sipariş sayısını hesapla
      const totalOrders = orders.length;

      // Ortalama puanı hesapla (siparişlerde rating varsa)
      const ordersWithRating = orders.filter((order: any) => order.rating && order.rating > 0);
      const averageRating = ordersWithRating.length > 0 
        ? ordersWithRating.reduce((sum: number, order: any) => sum + order.rating, 0) / ordersWithRating.length
        : 4.8; // Varsayılan değer

      // Müşteri memnuniyetini hesapla (4+ puanlı siparişlerin oranı)
      const satisfiedOrders = ordersWithRating.filter((order: any) => order.rating >= 4).length;
      const customerSatisfaction = ordersWithRating.length > 0 
        ? Math.round((satisfiedOrders / ordersWithRating.length) * 100)
        : 92; // Varsayılan değer

      // Büyüme oranlarını hesapla (dün vs bugün)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const yesterdayOrders = orders.filter((order: any) => 
        order.createdAt && order.createdAt.startsWith(yesterdayStr)
      );
      const yesterdayRevenue = yesterdayOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

      const ordersGrowth = yesterdayOrders.length > 0 
        ? Math.round(((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100)
        : 0;
      
      const revenueGrowth = yesterdayRevenue > 0 
        ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
        : 0;

      setDashboardStats({
        todayOrders: todayOrders.length,
        activeOrders: activeOrdersList.length,
        todayRevenue,
        monthlyRevenue,
        totalMenuItems,
        activeCategories,
        totalWaiters: activeWaiters,
        activeTables,
        totalOrders,
        averageRating: Math.round(averageRating * 10) / 10, // 1 ondalık basamak
        customerSatisfaction,
        ordersGrowth,
        revenueGrowth
      });

      // Aktif siparişleri formatla
      const formattedActiveOrders = activeOrdersList.slice(0, 3).map((order: any) => ({
        id: order.id,
        table: order.tableNumber,
        items: order.items?.length || 0,
        total: order.totalAmount || 0,
        status: order.status,
        time: order.estimatedTime ? `${order.estimatedTime} dk` : 'Bilinmiyor'
      }));

      setActiveOrders(formattedActiveOrders);
    };

    loadDashboardData();
  }, [user]);
  
  // Restoranlar sayfasından alınan planlar ve fiyatlar
  const plans = {
    premium: {
      name: 'Premium Paket',
      description: 'Küçük ve orta ölçekli işletmeler için',
      features: [
        'QR Menü Sistemi (Sınırsız menü, anlık güncelleme)',
        'Mutfak Paneli (5 kullanıcı, sipariş takibi)',
        'Garson Paneli (3 kullanıcı, masa yönetimi)',
        'İşletme Paneli (2 kullanıcı, raporlama)',
        'Müşteri Uygulaması (Sipariş verme, ödeme)',
        '7/24 WhatsApp Destek',
        'Google Yorum Entegrasyonu',
        'Detaylı Satış Raporları',
        'Mobil Uyumlu Tasarım',
        'Stok Yönetimi'
      ],
      pricing: {
        monthly: 4980,
        sixMonths: 24900,
        yearly: 47900
      }
    },
    corporate: {
      name: 'Kurumsal Paket',
      description: 'Büyük işletmeler ve zincirler için',
      features: [
        'Premium Paket\'in Tüm Özellikleri',
        'Sınırsız Kullanıcı (Tüm paneller)',
        'Çoklu Şube Yönetimi',
        'Özel Menü ve Logo Entegrasyonu',
        'Özel Tema Tasarımı',
        'API Entegrasyonları (POS, Muhasebe)',
        'Özel Eğitim ve Danışmanlık',
        'Öncelikli WhatsApp Destek',
        'Gelişmiş Analitik ve Raporlama',
        'Özel Geliştirmeler',
        'Dedicated Account Manager',
        '7/24 Telefon Desteği',
        'Özel Rapor Şablonları',
        'Beyaz Etiket Çözümü'
      ],
      pricing: {
        monthly: 9980,
        sixMonths: 49900,
        yearly: 95900
      }
    }
  };

  // Ek hizmetler ve fiyatlandırma (Türkiye şartlarına göre)
  const additionalServices = {
    'menu-customization': {
      name: 'Menü Özelleştirme',
      description: 'Özel tema, logo ve tasarım değişiklikleri',
      panel: 'Menü',
      basePrice: 2500,
      perChange: 500
    },
    'qr-design': {
      name: 'QR Kod Tasarımı',
      description: 'Özel QR kod tasarımı ve yerleşimi',
      panel: 'QR Kodlar',
      basePrice: 1500,
      perChange: 300
    },
    'report-customization': {
      name: 'Rapor Özelleştirme',
      description: 'Özel rapor şablonları ve analitik',
      panel: 'Raporlar',
      basePrice: 3000,
      perChange: 800
    },
    'staff-training': {
      name: 'Personel Eğitimi',
      description: 'Panel kullanımı ve sistem eğitimi',
      panel: 'Personel',
      basePrice: 2000,
      perChange: 500
    },
    'order-integration': {
      name: 'Sipariş Entegrasyonu',
      description: 'POS ve ödeme sistem entegrasyonu',
      panel: 'Siparişler',
      basePrice: 5000,
      perChange: 1500
    },
    'multi-branch-setup': {
      name: 'Çoklu Şube Kurulumu',
      description: 'Ek şube ekleme ve yönetimi',
      panel: 'Genel',
      basePrice: 4000,
      perChange: 2000
    }
  };

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
        login(demoUser, 'demo-token', 'demo-refresh-token');
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

  const calculateTotalPrice = () => {
    const planPrice = plans[selectedPlan].pricing[billingCycle];
    const servicesPrice = Object.entries(selectedServices).reduce((total, [serviceId, quantity]) => {
      const service = additionalServices[serviceId as keyof typeof additionalServices];
      return total + (service.basePrice + (service.perChange * (quantity - 1)));
    }, 0);
    return planPrice + servicesPrice;
  };

  const getServicesByPanel = (panel: string) => {
    return Object.entries(additionalServices).filter(([_, service]) => service.panel === panel);
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => {
      const newServices = { ...prev };
      delete newServices[serviceId];
      return newServices;
    });
  };

  const handlePaymentComplete = (paymentData: any) => {
    console.log(`💳 Ödeme tamamlandı:`, paymentData);
    
    // Ödeme başarılı mesajı
    alert(`Ödeme Başarılı! 🎉\n\nPlan: ${paymentData.plan}\nFaturalandırma: ${paymentData.billingCycle}\nTutar: ₺${paymentData.total.toLocaleString('tr-TR')}\nÖdeme Yöntemi: ${paymentData.method}\n\nPlanınız aktifleştirildi!`);
    
    // Modal'ları kapat
      setShowUpgradeModal(false);
    setShowPaymentModal(false);
    setSelectedServices({});
    
    console.log(`✅ Ödeme işlemi tamamlandı: ${paymentData.plan}`);
  };

  const handleCancelPlan = () => {
    setShowUpgradeModal(false);
    setSelectedFeatures([]);
  };

  // Demo istatistikler
  // Gerçek veriler artık dashboardStats state'inde

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
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <nav className="mt-4 sm:mt-6">
          <Link href="/business/dashboard" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 bg-purple-700 bg-opacity-50 border-l-4 border-white rounded-r-lg mx-2 sm:mx-0">
            <FaChartLine className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Kontrol Paneli</span>
          </Link>
          <Link href="/business/menu" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaUtensils className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Menü Yönetimi</span>
          </Link>
          <Link href="/business/staff" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaUsers className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Personel</span>
          </Link>
          <Link href="/business/qr-codes" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaQrcode className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">QR Kodlar</span>
          </Link>
          <Link href="/business/reports" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaChartBar className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Raporlar</span>
          </Link>
          <Link href="/business/support" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaHeadset className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Destek</span>
          </Link>
          <Link href="/business/settings" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaCog className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Ayarlar</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="border-t border-purple-700 pt-3 sm:pt-4">
            <div className="flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm font-medium">MasApp</p>
                <p className="text-xs text-purple-300">info@masapp.com</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <FaSignOutAlt className="text-sm sm:text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
                <FaBars className="text-lg text-gray-600" />
              </button>
            <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">{t.title}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">{t.subtitle}{user?.name ? `, ${user.name}` : ''} 👋</p>
            </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
              {/* Language Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('Turkish')}
                  className={`px-2 py-1 rounded text-xs ${languageCode === 'tr' ? 'bg-white text-purple-600' : 'text-gray-600'}`}
                >
                  TR
                </button>
                <button
                  onClick={() => setLanguage('English')}
                  className={`px-2 py-1 rounded text-xs ${languageCode === 'en' ? 'bg-white text-purple-600' : 'text-gray-600'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('German')}
                  className={`px-2 py-1 rounded text-xs ${languageCode === 'de' ? 'bg-white text-purple-600' : 'text-gray-600'}`}
                >
                  DE
                </button>
              </div>
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className={`px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
                  (currentRestaurant?.subscription?.plan || 'premium') === 'premium' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span className="hidden sm:inline">
                {(currentRestaurant?.subscription?.plan || 'premium') === 'premium' ? 'Premium' : 'Premium'} Plan
                </span>
                <span className="sm:hidden">
                  {(currentRestaurant?.subscription?.plan || 'premium') === 'premium' ? 'P' : 'P'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-3 sm:p-6 lg:p-8">

          {/* Support Modal */}
          {showSupportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={()=>setShowSupportModal(false)}>
              <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden" onClick={(e)=>e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold">Destek</h3>
                  <button onClick={() => setShowSupportModal(false)} className="text-gray-500 hover:text-gray-700">
                    <FaTimes />
                  </button>
                </div>
                <div className="h-[70vh]">
                  <iframe src="/business/support" className="w-full h-full" />
                </div>
              </div>
            </div>
          )}
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <FaShoppingCart className="text-lg sm:text-xl text-blue-600" />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${
                  dashboardStats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dashboardStats.ordersGrowth >= 0 ? '+' : ''}{dashboardStats.ordersGrowth}%
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{dashboardStats.todayOrders}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Bugünkü Siparişler</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                  <FaChartLine className="text-lg sm:text-xl text-green-600" />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${
                  dashboardStats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dashboardStats.revenueGrowth >= 0 ? '+' : ''}{dashboardStats.revenueGrowth}%
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">₺{dashboardStats.todayRevenue.toLocaleString('tr-TR')}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Bugünkü Ciro</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                  <FaUtensils className="text-lg sm:text-xl text-purple-600" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600">{dashboardStats.activeCategories} kategori</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{dashboardStats.totalMenuItems}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Menü Ürünleri</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                  <FaUsers className="text-lg sm:text-xl text-orange-600" />
                </div>
                <span className="text-xs sm:text-sm text-orange-600 font-medium">{dashboardStats.activeTables} aktif</span>
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
                {activeOrders.length > 0 ? (
                  activeOrders.map(order => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aktif sipariş yok</p>
                    <p className="text-sm">Yeni siparişler geldiğinde burada görünecek</p>
                  </div>
                )}
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
                <button data-open-announcements onClick={() => setShowAnnModal(true)} className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors flex flex-col items-center justify-center gap-2">
                  <FaBullhorn className="text-xl text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Duyurular (Aktif)</span>
                </button>
              </div>
            </div>
            <AnnouncementQuickModal isOpen={showAnnModal} onClose={() => setShowAnnModal(false)} />
            <script dangerouslySetInnerHTML={{__html:`
              (function(){
                window.addEventListener('masapp:open-announcements',function(){
                  var e = document.querySelector('[data-open-announcements]');
                  if(e){ e.click(); }
                });
              })();
            `}} />
          </div>

          {/* Aylık Özet */}
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-sm p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">Aylık Performans</h3>
                <p className="text-purple-200 mb-4">Bu ay harika gidiyorsunuz!</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-3xl font-bold">₺{dashboardStats.monthlyRevenue.toLocaleString('tr-TR')}</p>
                    <p className="text-purple-200 text-sm">Toplam Ciro</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{dashboardStats.totalOrders}</p>
                    <p className="text-purple-200 text-sm">Toplam Sipariş</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{dashboardStats.averageRating}</p>
                    <p className="text-purple-200 text-sm">Ortalama Puan</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{dashboardStats.customerSatisfaction}%</p>
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

            {/* Plan Detayları */}
            <div className="p-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedPlan}
                </h3>
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  ₺{calculateTotalPrice()}
                </div>
                <div className="text-gray-500">/ay</div>
              </div>

              {/* Özellikler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Dahil Özellikler</h4>
                  <ul className="space-y-3">
                    {selectedFeatures.map((featureId, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{featureId}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Mevcut Planınız</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-800 mb-2">
                      Premium Plan
                    </div>
                    <div className="text-2xl font-bold text-gray-600 mb-2">
                      ₺99
                    </div>
                    <div className="text-sm text-gray-500">/ay</div>
                  </div>
                </div>
              </div>

              {/* Ödeme Seçenekleri */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Ödeme Yöntemi</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left">
                    <div className="font-medium text-gray-800">Kredi Kartı</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard</div>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left">
                    <div className="font-medium text-gray-800">Banka Havalesi</div>
                    <div className="text-sm text-gray-500">EFT, Havale</div>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left">
                    <div className="font-medium text-gray-800">Dijital Cüzdan</div>
                    <div className="text-sm text-gray-500">PayPal, Stripe</div>
                  </button>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancelPlan}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-8 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Ödeme Yap (₺{calculateTotalPrice()})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gelişmiş Paket Yönetimi Modalı */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <FaCog className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Paket ve Hizmet Yönetimi</h3>
                  <p className="text-gray-500">İhtiyacınıza göre plan ve ek hizmetler seçin</p>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500 text-xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Kolon - Plan ve Hizmet Seçimi */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Mevcut Plan */}
                  <div className={`bg-gradient-to-r border rounded-xl p-6 ${
                    selectedPlan === 'corporate' 
                      ? 'from-purple-50 to-purple-100 border-purple-200' 
                      : 'from-orange-50 to-orange-100 border-orange-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedPlan === 'corporate' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}>
                        <FaCog className="text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Mevcut Planınız</h4>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className={`text-xl font-bold ${
                          selectedPlan === 'corporate' ? 'text-purple-600' : 'text-orange-600'
                        }`}>
                          {plans[selectedPlan].name}
                        </h5>
                        <p className="text-gray-600">
                          ₺{plans[selectedPlan].pricing[billingCycle].toLocaleString('tr-TR')}
                          {billingCycle === 'monthly' ? '/ay' : 
                           billingCycle === 'sixMonths' ? '/6 ay' : '/yıl'} - Aktif
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Sonraki ödeme</div>
                        <div className="font-semibold">15 Ocak 2024</div>
                      </div>
                    </div>
                  </div>

                  {/* Faturalandırma Seçimi */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Faturalandırma Dönemini Değiştir</h4>
                    <p className="text-sm text-gray-600 mb-4"></p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          billingCycle === 'monthly'
                            ? selectedPlan === 'corporate' 
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">Aylık</div>
                        <div className="text-sm text-gray-600">Her ay ödeme</div>
                        <div className={`text-lg font-bold mt-2 ${
                          selectedPlan === 'corporate' ? 'text-purple-600' : 'text-orange-600'
                        }`}>
                          ₺{plans[selectedPlan].pricing.monthly}
                        </div>
                      </button>
                      <button
                        onClick={() => setBillingCycle('sixMonths')}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          billingCycle === 'sixMonths'
                            ? selectedPlan === 'corporate' 
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">6 Aylık</div>
                        <div className="text-sm text-gray-600">%17 indirim</div>
                        <div className={`text-lg font-bold mt-2 ${
                          selectedPlan === 'corporate' ? 'text-purple-600' : 'text-orange-600'
                        }`}>
                          ₺{plans[selectedPlan].pricing.sixMonths}
                        </div>
                      </button>
                      <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          billingCycle === 'yearly'
                            ? selectedPlan === 'corporate' 
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">Yıllık</div>
                        <div className="text-sm text-gray-600">%20 indirim</div>
                        <div className={`text-lg font-bold mt-2 ${
                          selectedPlan === 'corporate' ? 'text-purple-600' : 'text-orange-600'
                        }`}>
                          ₺{plans[selectedPlan].pricing.yearly}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Ek Hizmetler */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Ek Hizmetler</h4>
                    <p className="text-sm text-gray-600 mb-6">
                      Dilediğiniz ek hizmet hangi paneldeyse hemen sepete ekleyin. 
                      Birden fazla seçebilirsiniz. Örneğin mutfak panelinde kaç tane değişiklik istiyorsanız 
                      o kadar sayı seçebilirsiniz, fiyat ona göre eklenecektir.
                    </p>
                    
                    <div className="space-y-6">
                      {['Menü', 'QR Kodlar', 'Raporlar', 'Personel', 'Siparişler', 'Genel'].map(panel => {
                        const panelServices = getServicesByPanel(panel);
                        if (panelServices.length === 0) return null;
                        
                        return (
                          <div key={panel} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              {panel === 'Menü' && <FaUtensils className="text-pink-500" />}
                              {panel === 'QR Kodlar' && <FaQrcode className="text-purple-500" />}
                              {panel === 'Raporlar' && <FaChartBar className="text-blue-500" />}
                              {panel === 'Personel' && <FaUsers className="text-green-500" />}
                              {panel === 'Siparişler' && <FaShoppingCart className="text-orange-500" />}
                              {panel === 'Genel' && <FaCog className="text-gray-500" />}
                              {panel} Paneli
                            </h5>
                            <div className="space-y-3">
                              {panelServices.map(([serviceId, service]) => (
                                <div key={serviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <h6 className="font-medium text-gray-800">{service.name}</h6>
                                    <p className="text-sm text-gray-600">{service.description}</p>
                                    <div className="text-sm text-orange-600 font-medium">
                                      ₺{service.basePrice} + ₺{service.perChange}/değişiklik
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateServiceQuantity(serviceId, (selectedServices[serviceId] || 0) - 1)}
                                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                                    >
                                      -
                                    </button>
                                    <span className="w-8 text-center font-medium">
                                      {selectedServices[serviceId] || 0}
                                    </span>
                                    <button
                                      onClick={() => updateServiceQuantity(serviceId, (selectedServices[serviceId] || 0) + 1)}
                                      className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sağ Kolon - Sepet ve Ödeme */}
                <div className="space-y-6">
                  {/* Sepet */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Sepetiniz</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{plans[selectedPlan].name}</span>
                        <span className="font-semibold">₺{plans[selectedPlan].pricing[billingCycle]}</span>
                      </div>
                      {Object.entries(selectedServices).map(([serviceId, quantity]) => {
                        const service = additionalServices[serviceId as keyof typeof additionalServices];
                        const totalPrice = service.basePrice + (service.perChange * (quantity - 1));
                        return (
                          <div key={serviceId} className="flex justify-between items-center">
                            <div className="flex-1">
                              <span className="text-gray-600 text-sm">{service.name}</span>
                              <span className="text-gray-500 text-xs ml-2">({quantity}x)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">₺{totalPrice}</span>
                              <button
                                onClick={() => removeService(serviceId)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Toplam</span>
                          <span>₺{calculateTotalPrice().toLocaleString('tr-TR')}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {billingCycle === 'monthly' ? 'Aylık' : 
                           billingCycle === 'sixMonths' ? '6 Aylık' : 'Yıllık'} ödeme
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ödeme Butonu */}
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Ödeme Yap (₺{calculateTotalPrice().toLocaleString('tr-TR')})
                  </button>

                  {/* Kurumsal Paket Tanıtımı kaldırıldı */}
                  {false && (
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <FaStore className="text-white text-lg" />
                      </div>
                      <div>
                        <h5 className="text-lg font-bold text-purple-800">Kurumsal Paket</h5>
                        <p className="text-sm text-purple-600">Büyük işletmeler ve zincirler için</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-purple-700">Özel Menü ve Logo Entegrasyonu</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-purple-700">Sınırsız kullanıcı (tüm paneller)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-purple-700">Çoklu şube yönetimi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-purple-700">API entegrasyonları</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-purple-700">7/24 Telefon Desteği</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-purple-700">Beyaz Etiket Çözümü</span>
                      </div>
                    </div>
                    
                    {/* Fiyatlandırma Seçenekleri */}
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <h6 className="font-semibold text-gray-800 mb-3 text-sm">Fiyatlandırma Seçenekleri</h6>
                      <div className="space-y-2">
                        <button
                          onClick={() => setCorporateBillingCycle('monthly')}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            corporateBillingCycle === 'monthly'
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Aylık</span>
                            <span className="font-bold text-purple-800">₺9,980</span>
                          </div>
                    </button>
                        <button
                          onClick={() => setCorporateBillingCycle('sixMonths')}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            corporateBillingCycle === 'sixMonths'
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">6 Aylık (%17 İndirim)</span>
                            <div className="text-right">
                              <span className="font-bold text-purple-800">₺49,900</span>
                              <div className="text-xs text-gray-500">8,320₺/ay</div>
                  </div>
                </div>
                        </button>
                        <button
                          onClick={() => setCorporateBillingCycle('yearly')}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            corporateBillingCycle === 'yearly'
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">1 Yıllık (%20 İndirim)</span>
                            <div className="text-right">
                              <span className="font-bold text-purple-800">₺95,900</span>
                              <div className="text-xs text-gray-500">7,990₺/ay</div>
              </div>
            </div>
                        </button>
          </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedPlan('corporate');
                        setBillingCycle(corporateBillingCycle);
                        alert('Kurumsal paket seçildi! Faturalandırma dönemini değiştirebilirsiniz.');
                      }}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Kurumsal Pakete Geç
                    </button>
        </div>
      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ödeme Modalı */}
      <BusinessPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={calculateTotalPrice()}
        planName={plans[selectedPlan].name}
        billingCycle={billingCycle === 'monthly' ? 'Aylık' : billingCycle === 'sixMonths' ? '6 Aylık' : 'Yıllık'}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

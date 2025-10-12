'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaCog, 
  FaChartLine,
  FaChartBar,
  FaQrcode,
  FaBell,
  FaPalette,
  FaUpload,
  FaSave,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWifi,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaSignOutAlt,
  FaTimes,
  FaHeadset,
  FaUtensils,
  FaUsers,
  FaImage,
  FaCreditCard,
  FaRocket,
  FaStar,
  FaInfoCircle,
  FaCheckCircle,
  FaSpinner,
  FaBars,
  FaCrown,
  FaPlug,
  FaGlobe,
  FaCheck,
  FaExclamationTriangle,
  FaDownload,
  FaSync
} from 'react-icons/fa';
import AnnouncementQuickModal from '@/components/AnnouncementQuickModal';
import PhonePreview from '@/components/PhonePreview';
import { useAuthStore } from '@/store/useAuthStore';
import { useRestaurantSettings } from '@/hooks/useRestaurantSettings';
import BusinessSidebar from '@/components/BusinessSidebar';

export default function SettingsPage() {
  const router = useRouter();
  const { authenticatedRestaurant, authenticatedStaff, isAuthenticated, logout, initializeAuth } = useAuthStore();
  
  // Sayfa yüklendiğinde auth'u initialize et
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Restaurant-specific settings kullan
  const {
    settings,
    accountInfo,
    stats,
    isLoading,
    activeTab,
    expandedSections,
    updateBasicInfo,
    updateBranding,
    updateStaffCredentials,
    generateStaffCredentials,
    updateMenuSettings,
    updatePaymentSettings,
    updateTechnicalSettings,
    updateCustomerExperience,
    updateNotificationSettings,
    updateIntegrations,
    updateSecuritySettings,
    updateBackupSettings,
    updateAccountInfo,
    setActiveTab,
    toggleSection,
    setLoading,
    exportSettings,
    validateSubdomain
  } = useRestaurantSettings(authenticatedRestaurant?.id);

  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({});
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [subdomainValidation, setSubdomainValidation] = useState<{
    isValid: boolean;
    isChecking: boolean;
    message: string;
  }>({ isValid: true, isChecking: false, message: '' });

  // Simple integration connect modal state
  const [integrationModal, setIntegrationModal] = useState<null | { name: string }>(null);

  // Service counts state for one-time services
  const [serviceCounts, setServiceCounts] = useState({
    personel: 0,
    siparis: 0,
    genel: 0,
    menu: 0,
    qr: 0,
    rapor: 0
  });

  const setServiceCount = (service: keyof typeof serviceCounts, count: number) => {
    setServiceCounts(prev => ({
      ...prev,
      [service]: count
    }));
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Restaurant bilgilerini settings'e senkronize et
  useEffect(() => {
    if (authenticatedRestaurant) {
      // Admin panelinden gelen restaurant bilgilerini settings'e aktar
      // Sadece boş olan alanları doldur, kullanıcı değiştirdiyse üzerine yazma
      const updates: any = {};
      
      if (!settings.basicInfo.name && authenticatedRestaurant.name) {
        updates.name = authenticatedRestaurant.name;
      }
      if (!settings.basicInfo.subdomain && authenticatedRestaurant.username) {
        updates.subdomain = authenticatedRestaurant.username;
      }
      if (!settings.basicInfo.address && authenticatedRestaurant.address) {
        updates.address = authenticatedRestaurant.address;
      }
      if (!settings.basicInfo.phone && authenticatedRestaurant.phone) {
        updates.phone = authenticatedRestaurant.phone;
      }
      if (!settings.basicInfo.email && authenticatedRestaurant.email) {
        updates.email = authenticatedRestaurant.email;
      }
      
      if (Object.keys(updates).length > 0) {
        updateBasicInfo(updates);
      }
      
      // Logo varsa ve settings'de logo yoksa branding'e ekle
      if (authenticatedRestaurant.logo && !settings.branding.logo) {
        updateBranding({
          logo: authenticatedRestaurant.logo
        });
      }
      
      // Renkler varsa ve settings'de yoksa branding'e ekle
      if (authenticatedRestaurant.primaryColor && !settings.branding.primaryColor) {
        updateBranding({
          primaryColor: authenticatedRestaurant.primaryColor
        });
      }
      if (authenticatedRestaurant.secondaryColor && !settings.branding.secondaryColor) {
        updateBranding({
          secondaryColor: authenticatedRestaurant.secondaryColor
        });
      }
    }
  }, [authenticatedRestaurant?.id]); // Sadece restaurant değiştiğinde çalışsın

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPassword(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification could be added here
  };

  // Payment UI state
  type BillingCycle = 'monthly' | 'semiannual' | 'annual';
  type PlanId = 'free' | 'premium';
  type ExtraId = 'extraUsers' | 'aiMenuTranslate' | 'prioritySupport' | 'customDomain' | 'apiAccess';
  type MonthlyServiceId = 'extraUsers' | 'aiMenuTranslate' | 'prioritySupport';
  type OneTimeServiceId = 'customDomain' | 'apiAccess';
  type IntegrationServiceId = 'posIntegration' | 'accountingIntegration';

  const PLANS: Record<PlanId, { name: string; priceMonthly: number; features: string[]; description?: string; highlight?: boolean }> = {
    free: { name: 'Ücretsiz Plan', priceMonthly: 0, features: ['Temel menü', 'Sınırlı görüntüleme'], description: 'Başlamak için ideal' },
    premium: { name: 'Premium Paket', priceMonthly: 4980, features: ['Sınırsız kategori', 'Çoklu şube', 'Gelişmiş raporlar'], highlight: true },
  };
  const BILLING: Record<BillingCycle, { months: number; discount: number; label: string }>= {
    monthly: { months: 1, discount: 0, label: 'Aylık' },
    semiannual: { months: 6, discount: 0.17, label: '6 Aylık' },
    annual: { months: 12, discount: 0.2, label: 'Yıllık' },
  };

  // Service definitions
  const EXTRAS: Record<ExtraId, { name: string; desc: string; priceMonthly: number }> = {
    extraUsers: { name: 'Ek Kullanıcı', desc: 'Her 5 kullanıcı için', priceMonthly: 500 },
    aiMenuTranslate: { name: 'AI Menü Çevirisi', desc: 'Otomatik çoklu dil desteği', priceMonthly: 200 },
    prioritySupport: { name: 'Öncelikli Destek', desc: '7/24 öncelikli müşteri desteği', priceMonthly: 300 },
    customDomain: { name: 'Özel Domain', desc: 'Kendi domain adresiniz', priceMonthly: 100 },
    apiAccess: { name: 'API Erişimi', desc: 'Gelişmiş API entegrasyonları', priceMonthly: 400 },
  };

  const MONTHLY_SERVICES: Record<MonthlyServiceId, { name: string; priceMonthly: number; desc: string; icon: any }> = {
    extraUsers: { name: 'Ek Kullanıcı', priceMonthly: 500, desc: '+10 kullanıcı', icon: '👥' },
    aiMenuTranslate: { name: 'AI Menü Çevirisi', priceMonthly: 200, desc: 'Sınırsız çeviri', icon: '🤖' },
    prioritySupport: { name: 'Öncelikli Destek', priceMonthly: 300, desc: '7/24 destek', icon: '🎧' },
  };

  const ONETIME_SERVICES: Record<OneTimeServiceId, { name: string; basePrice: number; changePrice: number; desc: string; icon: any }> = {
    customDomain: { name: 'Özel Domain', basePrice: 1000, changePrice: 0, desc: 'Kendi domain adresiniz', icon: '🌐' },
    apiAccess: { name: 'API Erişimi', basePrice: 2000, changePrice: 0, desc: 'Gelişmiş API entegrasyonları', icon: '🔌' },
  };

  const INTEGRATION_SERVICES: Record<IntegrationServiceId, { name: string; price: number; desc: string; icon: any }> = {
    posIntegration: { name: 'POS Entegrasyonu', price: 1500, desc: 'Sunmi/Ingenico vb.', icon: '💳' },
    accountingIntegration: { name: 'Muhasebe Entegrasyonu', price: 1200, desc: 'Logo/Netsis/Mikro', icon: '📊' },
  };

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('premium');
  const [billingCycleUI, setBillingCycleUI] = useState<BillingCycle>('monthly');
  const [selectedExtras, setSelectedExtras] = useState<Record<ExtraId, boolean>>({
    extraUsers: false,
    aiMenuTranslate: false,
    prioritySupport: false,
    customDomain: false,
    apiAccess: false,
  });
  const [selectedMonthlyServices, setSelectedMonthlyServices] = useState<Record<MonthlyServiceId, boolean>>({
    extraUsers: false,
    aiMenuTranslate: false,
    prioritySupport: false,
  });
  const [selectedOneTimeServices, setSelectedOneTimeServices] = useState<Record<OneTimeServiceId, boolean>>({
    customDomain: false,
    apiAccess: false,
  });
  const [selectedIntegrationServices, setSelectedIntegrationServices] = useState<Record<IntegrationServiceId, boolean>>({
    posIntegration: false,
    accountingIntegration: false,
  });

  const planMonthly = PLANS[selectedPlan].priceMonthly;
  const months = BILLING[billingCycleUI].months;

  // Calculate pricing
  const extrasMonthly = Object.entries(selectedExtras)
    .filter(([, selected]) => selected)
    .reduce((total, [id]) => total + EXTRAS[id as ExtraId].priceMonthly, 0);

  const monthlyServicesTotal = Object.entries(selectedMonthlyServices)
    .filter(([, selected]) => selected)
    .reduce((total, [id]) => total + MONTHLY_SERVICES[id as MonthlyServiceId].priceMonthly, 0);

  const oneTimeServicesTotal = Object.entries(selectedOneTimeServices)
    .filter(([, selected]) => selected)
    .reduce((total, [id]) => total + ONETIME_SERVICES[id as OneTimeServiceId].basePrice, 0);

  const integrationServicesTotal = Object.entries(selectedIntegrationServices)
    .filter(([, selected]) => selected)
    .reduce((total, [id]) => total + INTEGRATION_SERVICES[id as IntegrationServiceId].price, 0);

  const totalMonthly = planMonthly + extrasMonthly + monthlyServicesTotal;
  const discount = totalMonthly * BILLING[billingCycleUI].discount * BILLING[billingCycleUI].months;
  const grand = Math.round((totalMonthly * BILLING[billingCycleUI].months) - discount + oneTimeServicesTotal + integrationServicesTotal);

  const startCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          billing: billingCycleUI,
          items: [
            { name: PLANS[selectedPlan].name, unit_amount: planMonthly },
            ...Object.entries(selectedMonthlyServices)
              .filter(([, v]) => v)
              .map(([id]) => ({ name: MONTHLY_SERVICES[id as MonthlyServiceId].name, unit_amount: MONTHLY_SERVICES[id as MonthlyServiceId].priceMonthly })),
            ...Object.entries(selectedOneTimeServices)
              .filter(([, v]) => v)
              .map(([id]) => ({ name: ONETIME_SERVICES[id as OneTimeServiceId].name, unit_amount: ONETIME_SERVICES[id as OneTimeServiceId].basePrice })),
            ...Object.entries(selectedIntegrationServices)
              .filter(([, v]) => v)
              .map(([id]) => ({ name: INTEGRATION_SERVICES[id as IntegrationServiceId].name, unit_amount: INTEGRATION_SERVICES[id as IntegrationServiceId].price })),
          ],
        }),
      });
      if (!response.ok) throw new Error('stripe_disabled');
      const data = await response.json();
      if (data?.url) window.location.href = data.url; else throw new Error('no_url');
    } catch {
      alert('Canlı ödeme yapılandırılmadı. Demo akışında başarıya yönlendirileceksiniz.');
      window.location.href = '/admin/payment/success';
    }
  };

  const handleSave = async (section: string) => {
    setLoading(true);
    console.log(`💾 ${section} ayarları kaydediliyor...`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    console.log(`✅ ${section} ayarları kaydedildi`);
  };

  const handleSubdomainChange = async (subdomain: string) => {
    if (subdomain.length < 3) {
      setSubdomainValidation({ isValid: false, isChecking: false, message: 'Subdomain en az 3 karakter olmalıdır' });
      return;
    }

    setSubdomainValidation({ isValid: false, isChecking: true, message: 'Kontrol ediliyor...' });
    
    try {
      const isValid = await validateSubdomain(subdomain);
      setSubdomainValidation({
        isValid,
        isChecking: false,
        message: isValid ? 'Subdomain kullanılabilir' : 'Bu subdomain zaten kullanımda'
      });
    } catch (error) {
      setSubdomainValidation({
        isValid: false,
        isChecking: false,
        message: 'Kontrol sırasında hata oluştu'
      });
    }
  };


  const tabs = [
    { id: 'general', name: 'Genel Ayarlar', icon: FaCog },
    { id: 'branding', name: 'Görsel Kimlik', icon: FaPalette },
    { id: 'payment', name: 'Ödeme & Abonelik', icon: FaCreditCard },
    { id: 'integrations', name: 'Entegrasyonlar', icon: FaPlug },
    { id: 'notifications', name: 'Bildirimler', icon: FaBell }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Integration Connect Modal */}
      {integrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIntegrationModal(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{integrationModal.name} Bağlantısı</h3>
                <p className="text-sm text-gray-600 mt-1">Test aşamasında bilgileri buraya gireceksiniz. Şimdilik sahte verilerle bağlantıyı simüle ediyoruz.</p>
              </div>
              <button onClick={() => setIntegrationModal(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sağlayıcı</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Seçiniz (ör. Sunmi / Ingenico / Netsis / Logo)</option>
                  <option>Demo Sağlayıcı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Anahtarı / Kimlik</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Testte paylaşacağınız anahtar" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button onClick={() => setIntegrationModal(null)} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Vazgeç</button>
              <button onClick={() => { alert('Bağlantı testi başarılı (demo)'); setIntegrationModal(null); }} className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">Bağla</button>
            </div>
          </div>
        </div>
      )}
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
                <FaBars className="text-lg text-gray-600" />
              </button>
              <button className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg">
                <FaCog className="text-xl text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">Ayarlar</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">İşletme ayarlarınızı yönetin</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAnnModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                <span>📰</span>
                Duyurular
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-3 sm:p-6 lg:p-8">
          <AnnouncementQuickModal isOpen={showAnnModal} onClose={() => setShowAnnModal(false)} />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sol Kolon - Tab Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ayarlar</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="mr-3" />
                        <span className="text-sm font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Sağ Kolon - Tab Content */}
            <div className="lg:col-span-3">
              {/* Genel Ayarlar */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Hızlı Başlangıç Rehberi */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FaQrcode className="text-2xl text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-purple-800 mb-2">MasApp'e Hoş Geldiniz!</h3>
                        <p className="text-purple-700 text-sm mb-4">
                          İşletmenizi MasApp ile dijitalleştirin. QR kod menü sistemi, mutfak paneli, garson hizmetleri ve ödeme sistemi ile müşteri deneyimini geliştirin.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => window.open('/menu', '_blank')}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
                          >
                            <FaQrcode className="inline mr-1" /> QR Kod Menü
                          </button>
                          <button
                            onClick={() => window.open('/business/kitchen', '_blank')}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors"
                          >
                            <FaUtensils className="inline mr-1" /> Mutfak Paneli
                          </button>
                          <button 
                            onClick={() => window.open('/business/waiter', '_blank')}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                          >
                            <FaUsers className="inline mr-1" /> Garson Paneli
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* İşletme Bilgileri */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">İşletme Bilgileri</h3>
                      <button
                        onClick={() => handleSave('basicInfo')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                      >
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Kaydet
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {/* İşletme Adı */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İşletme Adı *
                        </label>
                        <input
                          type="text"
                          value={settings.basicInfo.name}
                          onChange={(e) => updateBasicInfo({ name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* İşletme Türü */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İşletme Türü *
                        </label>
                        <select
                          value={settings.basicInfo.businessType}
                          onChange={(e) => updateBasicInfo({ businessType: e.target.value as any })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="cafe">Cafe & Kahvehane</option>
                          <option value="restaurant">Restoran</option>
                          <option value="fastfood">Fast Food</option>
                          <option value="bar">Bar & Pub</option>
                          <option value="bakery">Fırın & Pastane</option>
                          <option value="pizzeria">Pizzeria</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                          İşletme türü menü tasarımını ve özelliklerini etkiler.
                        </p>
                      </div>

                      {/* Subdomain */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subdomain
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={settings.basicInfo.subdomain}
                            onChange={(e) => {
                              updateBasicInfo({ subdomain: e.target.value });
                              handleSubdomainChange(e.target.value);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium">
                            .guzellestir.com
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {subdomainValidation.isChecking && (
                            <FaSpinner className="animate-spin text-blue-500" />
                          )}
                          {!subdomainValidation.isChecking && subdomainValidation.isValid && (
                            <FaCheckCircle className="text-green-500" />
                          )}
                          {!subdomainValidation.isChecking && !subdomainValidation.isValid && (
                            <FaTimes className="text-red-500" />
                          )}
                          <span className={`text-sm ${
                            subdomainValidation.isValid ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {subdomainValidation.message}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Menü adresiniz: <span className="text-purple-600 font-medium">{settings.basicInfo.subdomain}.guzellestir.com</span>
                        </p>
                      </div>

                      {/* Açıklama */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açıklama
                        </label>
                        <textarea
                          value={settings.basicInfo.description}
                          onChange={(e) => updateBasicInfo({ description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Slogan */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slogan
                        </label>
                        <input
                          type="text"
                          value={settings.basicInfo.slogan || ''}
                          onChange={(e) => updateBasicInfo({ slogan: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Örn: Lezzetin Adresi"
                        />
                      </div>

                      {/* İletişim Bilgileri */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adres
                          </label>
                          <input
                            type="text"
                            value={settings.basicInfo.address}
                            onChange={(e) => updateBasicInfo({ address: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefon
                          </label>
                          <input
                            type="text"
                            value={settings.basicInfo.phone}
                            onChange={(e) => updateBasicInfo({ phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-posta
                          </label>
                          <input
                            type="email"
                            value={settings.basicInfo.email}
                            onChange={(e) => updateBasicInfo({ email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Web Sitesi
                          </label>
                          <input
                            type="url"
                            value={settings.basicInfo.website || ''}
                            onChange={(e) => updateBasicInfo({ website: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* WiFi Şifresi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WiFi Şifresi
                        </label>
                        <input
                          type="text"
                          value={settings.basicInfo.wifiPassword || ''}
                          onChange={(e) => updateBasicInfo({ wifiPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Çalışma Saatleri */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Çalışma Saatleri
                        </label>
                        <textarea
                          value={settings.basicInfo.workingHours}
                          onChange={(e) => updateBasicInfo({ workingHours: e.target.value })}
                          rows={3}
                          placeholder="Pazartesi - Cuma: 08:00 - 22:00&#10;Cumartesi - Pazar: 09:00 - 23:00"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Çalışma saatleri menünün alt kısmında gösterilecektir.
                        </p>
                      </div>

                      {/* Sosyal Medya Linkleri */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Facebook
                          </label>
                          <input
                            type="url"
                            value={settings.basicInfo.facebook || ''}
                            onChange={(e) => updateBasicInfo({ facebook: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instagram
                          </label>
                          <input
                            type="url"
                            value={settings.basicInfo.instagram || ''}
                            onChange={(e) => updateBasicInfo({ instagram: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Twitter
                          </label>
                          <input
                            type="url"
                            value={settings.basicInfo.twitter || ''}
                            onChange={(e) => updateBasicInfo({ twitter: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Durum */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durum
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="status"
                              value="active"
                              checked={settings.basicInfo.status === 'active'}
                              onChange={(e) => updateBasicInfo({ status: e.target.value as any })}
                              className="text-purple-600"
                            />
                            <span className="text-sm font-medium">Aktif</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="status"
                              value="inactive"
                              checked={settings.basicInfo.status === 'inactive'}
                              onChange={(e) => updateBasicInfo({ status: e.target.value as any })}
                              className="text-purple-600"
                            />
                            <span className="text-sm font-medium">Pasif</span>
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Pasif durumda menü görüntülenmeyecektir.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Görsel Kimlik */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">Görsel Kimlik</h3>
                      <button
                        onClick={() => handleSave('branding')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                      >
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Kaydet
                      </button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* Sol Kolon - Ayarlar */}
                      <div className="xl:col-span-2 space-y-8">
                        {/* Logo Yükleme */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaImage className="text-purple-600" />
                            Logo (Splash Ekranı)
                          </h4>
                          <p className="text-sm text-gray-500 mb-4">
                            Logo sadece uygulama açılış ekranında (splash) görünür. Menü tasarımında logo gösterilmez.
                          </p>
                          <input id="logoFileInput" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 2 * 1024 * 1024) { alert('Max 2MB'); return; }
                            const reader = new FileReader();
                            reader.onload = () => {
                              const dataUrl = reader.result as string;
                              updateBranding({ logo: dataUrl });
                            };
                            reader.readAsDataURL(file);
                          }} />
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
                            onClick={() => (document.getElementById('logoFileInput') as HTMLInputElement)?.click()}
                          >
                            {settings.branding.logo ? (
                              <div className="flex flex-col items-center">
                                <img src={settings.branding.logo} alt="Logo" className="max-h-24 object-contain mb-3" />
                                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                                  <FaUpload className="inline mr-2" />
                                  Logoyu Değiştir
                                </button>
                              </div>
                            ) : (
                              <>
                                <FaImage className="text-4xl text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">Logo yüklemek için tıklayın</p>
                                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                                  <FaUpload className="inline mr-2" />
                                  Logo Yükle
                                </button>
                                <p className="text-xs text-gray-500 mt-2">PNG, JPG veya SVG (Max: 2MB)</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Renk Seçimi */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaPalette className="text-purple-600" />
                            Menü Renk Paleti
                          </h4>
                          <p className="text-sm text-gray-500 mb-4">
                            Seçtiğiniz renkler menü tasarımında butonlar, kategoriler ve vurgular için kullanılır.
                          </p>
                          
                          {/* Ana Renk */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ana Renk</label>
                            <div className="flex flex-wrap gap-3 mb-3">
                              {[
                                { name: 'Mor', value: '#8B5CF6' },
                                { name: 'Mavi', value: '#3B82F6' },
                                { name: 'Yeşil', value: '#10B981' },
                                { name: 'Turuncu', value: '#F59E0B' },
                                { name: 'Kırmızı', value: '#EF4444' },
                                { name: 'Pembe', value: '#EC4899' },
                                { name: 'İndigo', value: '#6366F1' },
                                { name: 'Teal', value: '#14B8A6' }
                              ].map((color) => (
                                <button
                                  key={color.value}
                                  onClick={() => updateBranding({ primaryColor: color.value })}
                                  className={`w-12 h-12 rounded-lg border-2 transition-colors ${settings.branding.primaryColor === color.value ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-400'}`}
                                  style={{ backgroundColor: color.value }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={settings.branding.primaryColor}
                                onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                                className="w-12 h-10 p-0 border rounded cursor-pointer"
                              />
                              <span className="text-sm text-gray-600">{settings.branding.primaryColor}</span>
                            </div>
                          </div>

                          {/* İkinci Renk */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">İkinci Renk</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={settings.branding.secondaryColor}
                                onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                                className="w-12 h-10 p-0 border rounded cursor-pointer"
                              />
                              <span className="text-sm text-gray-600">{settings.branding.secondaryColor}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Arka plan ve vurgu renkleri otomatik hesaplanacak</p>
                          </div>
                        </div>

                        {/* Font Ayarları */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="text-purple-600">A</span>
                            Font Ayarları
                          </h4>
                          
                          {/* Font Ailesi */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Font Ailesi</label>
                            <select
                              value={settings.branding.fontFamily}
                              onChange={(e) => updateBranding({ fontFamily: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="Poppins">Poppins (Şık)</option>
                              <option value="Inter">Inter (Modern)</option>
                              <option value="Roboto">Roboto (Klasik)</option>
                              <option value="Open Sans">Open Sans (Temiz)</option>
                              <option value="Montserrat">Montserrat (Elegant)</option>
                              <option value="Lato">Lato (Profesyonel)</option>
                              <option value="Nunito">Nunito (Dostane)</option>
                              <option value="Source Sans Pro">Source Sans Pro (Okunabilir)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Menüde kullanılacak font ailesi</p>
                          </div>

                          {/* Font Boyutu */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Temel Font Boyutu</label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: 'small', name: 'Küçük', size: '14px' },
                                { id: 'medium', name: 'Orta', size: '16px' },
                                { id: 'large', name: 'Büyük', size: '18px' }
                              ].map((size) => (
                                <button
                                  key={size.id}
                                  onClick={() => updateBranding({ fontSize: size.id as any })}
                                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                    settings.branding.fontSize === size.id
                                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                >
                                  {size.name} ({size.size})
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Temel metin boyutu</p>
                          </div>
                        </div>

                        {/* Stil Ayarları */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaPalette className="text-purple-600" />
                            Stil Ayarları
                          </h4>
                          
                          {/* Header Stili */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Header Stili</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: 'gradient', name: 'Gradyan', desc: 'Renk geçişli' },
                                { id: 'solid', name: 'Düz', desc: 'Tek renk' },
                                { id: 'outline', name: 'Çerçeveli', desc: 'Sadece kenarlık' },
                                { id: 'minimal', name: 'Minimal', desc: 'Sade ve temiz' }
                              ].map((style) => (
                                <button
                                  key={style.id}
                                  onClick={() => updateBranding({ headerStyle: style.id as any })}
                                  className={`p-3 text-left rounded-lg border transition-colors ${
                                    settings.branding.headerStyle === style.id
                                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                >
                                  <div className="font-medium text-sm">{style.name}</div>
                                  <div className="text-xs text-gray-500">{style.desc}</div>
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Sayfa başlığının görünüm stili</p>
                          </div>
                        </div>
                      </div>

                      {/* Sağ Kolon - Canlı Önizleme */}
                      <div className="xl:col-span-1">
                        <div className="sticky top-6">
                          <div className="bg-white rounded-lg shadow-sm p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <FaEye className="text-purple-600" />
                              Canlı Önizleme
                            </h4>
                            <p className="text-sm text-gray-600 mb-6">
                              Değişikliklerinizi anlık olarak görüntüleyin
                            </p>
                            
                            {/* Telefon Önizleme - Daha büyük */}
                            <div className="relative flex justify-center">
                              <div className="scale-110">
                                <PhonePreview 
                                  settings={settings}
                                  className="mx-auto"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-6 text-center">
                              <p className="text-xs text-gray-500">
                                Ayarlarınızı değiştirdikçe önizleme otomatik güncellenir
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Ödeme & Abonelik */}
              {activeTab === 'payment' && (
  <div className="space-y-12">
    {/* Paketler */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Kurumsal Paket */}
  <div className="rounded-2xl bg-white shadow-lg p-8 border-2 border-purple-300 flex flex-col justify-between relative" style={{boxShadow:'0 4px 32px 0 rgba(128,0,255,0.08)'}}>
    <div>
      <div className="text-center mb-4">
        <h3 className="text-2xl md:text-3xl font-extrabold text-purple-700 mb-2 leading-tight">Büyük İşletmeler ve Zincirler</h3>
        <div className="flex justify-center items-end mb-2">
          <span className="text-5xl md:text-6xl font-extrabold text-purple-600 leading-none">₺9.980</span>
          <span className="text-2xl md:text-3xl font-bold text-gray-400 ml-1 mb-1">/ay</span>
        </div>
        <div className="flex flex-col gap-2 items-center mb-2">
          <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full font-semibold text-base">6 Ay: ₺49.900 (%17 indirim)</span>
          <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-semibold text-base">Yıllık: ₺95.900 (%20 indirim)</span>
        </div>
      </div>
      <ul className="space-y-3 mb-6 text-base">
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />Özel Menü & Logo Entegrasyonu</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />Sınırsız Kullanıcı (Tüm Paneller)</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />Çoklu Şube Yönetimi</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />API Entegrasyonları</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />7/24 Telefon Desteği</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />Beyaz Etiket Çözümü</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />Özel Eğitim & Kurulum</li>
      </ul>
    </div>
    <button className="w-full py-3 rounded-lg border-2 border-purple-400 text-purple-700 font-bold text-lg hover:bg-purple-50 transition">Kurumsal Çözüm Al</button>
  </div>
  {/* Premium Paket */}
  <div className="rounded-2xl bg-white shadow-lg p-8 border-2 border-orange-300 flex flex-col justify-between relative" style={{boxShadow:'0 4px 32px 0 rgba(255,128,0,0.08)'}}>
    <div>
      <div className="text-center mb-4">
        <h3 className="text-2xl md:text-3xl font-extrabold text-orange-600 mb-2 leading-tight">Premium Paket</h3>
        <div className="flex justify-center items-end mb-2">
          <span className="text-5xl md:text-6xl font-extrabold text-orange-500 leading-none">₺4.980</span>
          <span className="text-2xl md:text-3xl font-bold text-gray-400 ml-1 mb-1">/ay</span>
        </div>
        <div className="flex flex-col gap-2 items-center mb-2">
          <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full font-semibold text-base">6 Ay: ₺24.900 (%17 indirim)</span>
          <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-semibold text-base">Yıllık: ₺47.900 (%20 indirim)</span>
        </div>
      </div>
      <ul className="space-y-3 mb-6 text-base">
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />QR Menü & Sipariş Sistemi</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />AI Menü Optimizasyonu</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />Tüm Panel Erişimi</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />Gelişmiş Analitik</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />Öncelikli Destek</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />Ücretsiz Kurulum</li>
        <li className="flex items-center gap-2"><FaCheck className="text-green-600" />SSL Güvenlik</li>
      </ul>
    </div>
    <button className="w-full py-3 rounded-lg border-2 border-orange-400 text-orange-600 font-bold text-lg hover:bg-orange-50 transition">Premium Paketi Seç</button>
  </div>
</div>

    {/* Ek Hizmetler */}
    <div className="mt-12">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Ek Hizmetler</h2>
  <div className="space-y-6">
    {/* Personel Eğitimi */}
    <div className="bg-gray-50 rounded-xl p-6 mb-2 border flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-700">
          <span className="inline-block text-xl text-orange-500"><FaUsers /></span>
          Personel Eğitimi
        </div>
        <div className="text-gray-600 text-base">Panel kullanımı ve sistem eğitimi</div>
        <div className="mt-1 text-orange-600 font-semibold text-base">₺2000 + ₺500/değişiklik</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-full bg-gray-200 text-lg text-gray-500" onClick={() => setServiceCount('personel', Math.max(0, serviceCounts.personel - 1))}>-</button>
        <span className="w-8 text-center font-bold text-lg">{serviceCounts.personel}</span>
        <button className="h-10 w-10 rounded-full bg-orange-500 text-lg text-white" onClick={() => setServiceCount('personel', serviceCounts.personel + 1)}>+</button>
      </div>
    </div>
    {/* Siparişler Paneli */}
    <div className="bg-gray-50 rounded-xl p-6 mb-2 border flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-700">
          <span className="inline-block text-xl text-orange-600"><FaUtensils /></span>
          Siparişler Paneli
        </div>
        <div className="font-medium text-gray-900">Sipariş Entegrasyonu</div>
        <div className="text-gray-600 text-base">POS ve ödeme sistem entegrasyonu</div>
        <div className="mt-1 text-orange-600 font-semibold text-base">₺5000 + ₺1500/değişiklik</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-full bg-gray-200 text-lg text-gray-500" onClick={() => setServiceCount('siparis', Math.max(0, serviceCounts.siparis - 1))}>-</button>
        <span className="w-8 text-center font-bold text-lg">{serviceCounts.siparis}</span>
        <button className="h-10 w-10 rounded-full bg-orange-500 text-lg text-white" onClick={() => setServiceCount('siparis', serviceCounts.siparis + 1)}>+</button>
      </div>
    </div>
    {/* Genel Paneli */}
    <div className="bg-gray-50 rounded-xl p-6 mb-2 border flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-700">
          <span className="inline-block text-xl text-gray-700"><FaCog /></span>
          Genel Paneli
        </div>
        <div className="font-medium text-gray-900">Çoklu Şube Kurulumu</div>
        <div className="text-gray-600 text-base">Ek şube ekleme ve yönetimi</div>
        <div className="mt-1 text-orange-600 font-semibold text-base">₺4000 + ₺2000/değişiklik</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-full bg-gray-200 text-lg text-gray-500" onClick={() => setServiceCount('genel', Math.max(0, serviceCounts.genel - 1))}>-</button>
        <span className="w-8 text-center font-bold text-lg">{serviceCounts.genel}</span>
        <button className="h-10 w-10 rounded-full bg-orange-500 text-lg text-white" onClick={() => setServiceCount('genel', serviceCounts.genel + 1)}>+</button>
      </div>
    </div>
    {/* Menü Paneli */}
    <div className="bg-gray-50 rounded-xl p-6 mb-2 border flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-700">
          <span className="inline-block text-xl text-pink-500"><FaUtensils /></span>
          Menü Paneli
        </div>
        <div className="font-medium text-gray-900">Menü Özelleştirme</div>
        <div className="text-gray-600 text-base">Özel tema, logo ve tasarım değişiklikleri</div>
        <div className="mt-1 text-orange-600 font-semibold text-base">₺2500 + ₺500/değişiklik</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-full bg-gray-200 text-lg text-gray-500" onClick={() => setServiceCount('menu', Math.max(0, serviceCounts.menu - 1))}>-</button>
        <span className="w-8 text-center font-bold text-lg">{serviceCounts.menu}</span>
        <button className="h-10 w-10 rounded-full bg-orange-500 text-lg text-white" onClick={() => setServiceCount('menu', serviceCounts.menu + 1)}>+</button>
      </div>
    </div>
    {/* QR Kodlar Paneli */}
    <div className="bg-gray-50 rounded-xl p-6 mb-2 border flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-700">
          <span className="inline-block text-xl text-purple-500"><FaQrcode /></span>
          QR Kodlar Paneli
        </div>
        <div className="font-medium text-gray-900">QR Kod Tasarımı</div>
        <div className="text-gray-600 text-base">Özel QR kod tasarımı ve yerleşimi</div>
        <div className="mt-1 text-orange-600 font-semibold text-base">₺1500 + ₺300/değişiklik</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-full bg-gray-200 text-lg text-gray-500" onClick={() => setServiceCount('qr', Math.max(0, serviceCounts.qr - 1))}>-</button>
        <span className="w-8 text-center font-bold text-lg">{serviceCounts.qr}</span>
        <button className="h-10 w-10 rounded-full bg-orange-500 text-lg text-white" onClick={() => setServiceCount('qr', serviceCounts.qr + 1)}>+</button>
      </div>
    </div>
    {/* Raporlar Paneli */}
    <div className="bg-gray-50 rounded-xl p-6 mb-2 border flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-700">
          <span className="inline-block text-xl text-blue-500"><FaChartBar /></span>
          Raporlar Paneli
        </div>
        <div className="font-medium text-gray-900">Rapor Özelleştirme</div>
        <div className="text-gray-600 text-base">Özel rapor şablonları ve analitik</div>
        <div className="mt-1 text-orange-600 font-semibold text-base">₺3000 + ₺800/değişiklik</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-full bg-gray-200 text-lg text-gray-500" onClick={() => setServiceCount('rapor', Math.max(0, serviceCounts.rapor - 1))}>-</button>
        <span className="w-8 text-center font-bold text-lg">{serviceCounts.rapor}</span>
        <button className="h-10 w-10 rounded-full bg-orange-500 text-lg text-white" onClick={() => setServiceCount('rapor', serviceCounts.rapor + 1)}>+</button>
      </div>
    </div>
  </div>
</div>

    {/* Genel Bilgilendirme */}
    <div className="mt-12 flex flex-wrap gap-6 justify-center items-center">
      <div className="flex flex-col items-center">
        <span className="text-2xl">🚀</span>
        <span className="font-bold mt-2">14 Gün Ücretsiz</span>
        <span className="text-sm text-gray-600">Deneme Süresi</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl">🔒</span>
        <span className="font-bold mt-2">30 Gün İade</span>
        <span className="text-sm text-gray-600">Garantisi</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl">✅</span>
        <span className="font-bold mt-2">SSL Güvenlik</span>
        <span className="text-sm text-gray-600">Sertifikası</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl">👥</span>
        <span className="font-bold mt-2">Ücretsiz Kurulum</span>
        <span className="text-sm text-gray-600">6+ Ay Planlar</span>
      </div>
    </div>
  </div>
)}

              {/* Entegrasyonlar */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Entegrasyonlar</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { 
                          name: 'POS Sistemleri', 
                          icon: FaCreditCard, 
                          status: 'available',
                          desc: 'Yazar kasa ve POS sistemleri ile entegrasyon'
                        },
                        { 
                          name: 'Muhasebe', 
                          icon: FaSync, 
                          status: 'available',
                          desc: 'Muhasebe programları ile otomatik senkronizasyon'
                        },
                        { 
                          name: 'Online Ödeme', 
                          icon: FaCreditCard, 
                          status: 'active',
                          desc: 'Kredi kartı ve online ödeme sistemleri'
                        },
                        { 
                          name: 'Stok Yönetimi', 
                          icon: FaSync, 
                          status: 'coming',
                          desc: 'Stok takip sistemleri ile entegrasyon'
                        },
                        { 
                          name: 'CRM Sistemleri', 
                          icon: FaUsers, 
                          status: 'coming',
                          desc: 'Müşteri ilişkileri yönetimi'
                        },
                        { 
                          name: 'Rezervasyon', 
                          icon: FaSync, 
                          status: 'coming',
                          desc: 'Rezervasyon sistemleri ile entegrasyon'
                        }
                      ].map((integration, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <integration.icon className="text-purple-600" />
                              </div>
                              <h4 className="font-semibold text-gray-800">{integration.name}</h4>
                            </div>
                            {integration.status === 'active' && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                Aktif
                              </span>
                            )}
                            {integration.status === 'available' && (
                              <button onClick={() => setIntegrationModal({ name: integration.name })} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium hover:bg-purple-200 transition-colors">
                                Bağla
                              </button>
                            )}
                            {integration.status === 'coming' && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                Yakında
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{integration.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bildirimler */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">Bildirim Ayarları</h3>
                      <button
                        onClick={() => handleSave('notifications')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                      >
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Kaydet
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* E-posta Bildirimleri */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">E-posta Bildirimleri</h4>
                        <div className="space-y-3">
                          {[
                            { id: 'new_orders', label: 'Yeni siparişler', desc: 'Yeni sipariş geldiğinde e-posta gönder' },
                            { id: 'daily_reports', label: 'Günlük raporlar', desc: 'Her gün sonunda satış raporu gönder' },
                            { id: 'system_updates', label: 'Sistem güncellemeleri', desc: 'Yeni özellikler hakkında bilgi ver' }
                          ].map((notification) => (
                            <label key={notification.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                              <input
                                type="checkbox"
                                className="mt-1"
                                defaultChecked
                              />
                              <div>
                                <div className="font-medium text-gray-800">{notification.label}</div>
                                <div className="text-sm text-gray-600">{notification.desc}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* SMS Bildirimleri */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">SMS Bildirimleri</h4>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2">
                            <FaCrown className="text-yellow-600" />
                            <span className="font-medium text-yellow-800">Premium Özellik</span>
                          </div>
                          <p className="text-sm text-yellow-700 mt-1">
                            SMS bildirimleri Premium plan ile kullanılabilir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

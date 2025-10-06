'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaBell, FaArrowLeft, FaStar, FaPlus, FaInfo, FaUtensils, FaFilter, FaQrcode, FaMoneyBillWave, FaTint, FaBroom, FaClipboardList, FaStickyNote } from 'react-icons/fa';
import { useCartStore } from '@/store';
import useRestaurantStore from '@/store/useRestaurantStore';
import { useAuthStore } from '@/store/useAuthStore';
import useNotificationStore from '@/store/useNotificationStore';
import AnnouncementPopup from '@/components/AnnouncementPopup';
import Toast from '@/components/Toast';
import MenuItemModal from '@/components/MenuItemModal';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import TranslatedText from '@/components/TranslatedText';
import { useRestaurantSettings } from '@/hooks/useRestaurantSettings';
import SetBrandColor from '@/components/SetBrandColor';
import { createSessionToken, validateToken, getSessionToken, markTokenAsUsed, getRemainingTime } from '@/utils/sessionToken';

export function MenuPageContent() {
  // Store states
  const { currentLanguage, translate } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const tableNumber = useCartStore(state => state.tableNumber);
  const setRestaurantId = useCartStore(state => state.setRestaurantId);
  
  // Session token state (basitleştirildi)
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean>(true); // Her zaman true
  
  // Notification store
  const createWaiterCallNotification = useNotificationStore(state => state.createWaiterCallNotification);
  
  // Toast message state
  const [toastMessage, setToastMessage] = useState<string>('Ürün sepete eklendi!');
  
  // Waiter call modal
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [customNote, setCustomNote] = useState<string>('');
  
  // URL parametrelerinden veya subdomain'den restaurant bilgisini al
  const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string>('Menü');
  const setTableNumber = useCartStore(state => state.setTableNumber);
  
  // Subdomain'e göre restoran adını belirle
  const getRestaurantDisplayName = (slug: string | null) => {
    if (!slug) return 'Menü';
    
    switch (slug) {
      case 'lezzet':
        return 'Lezzet Restaurant';
      case 'kardesler':
        return 'Kardeşler Lokantası';
      case 'pizza':
        return 'Pizza Palace';
      case 'cafe':
        return 'Cafe Central';
      default:
        return slug.charAt(0).toUpperCase() + slug.slice(1) + ' Restaurant';
    }
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Önce subdomain'den restaurant bilgisini almaya çalış
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];
      const mainDomains = ['localhost', 'www', 'guzellestir'];
      
      let restaurantFromUrl = null;
      let tableFromUrl = null;
      
      // Eğer subdomain varsa ve ana domain değilse, subdomain'i restaurant olarak kullan
      if (!mainDomains.includes(subdomain) && hostname.includes('.')) {
        restaurantFromUrl = subdomain;
        
        // URL path'inden masa numarasını al (/menu/masa/5 formatında)
        const pathParts = window.location.pathname.split('/');
        if (pathParts.includes('masa') && pathParts.length > pathParts.indexOf('masa') + 1) {
          tableFromUrl = pathParts[pathParts.indexOf('masa') + 1];
        }
      }
      
      // Fallback: URL parametrelerinden al
      const params = new URLSearchParams(window.location.search);
      const restaurant = params.get('restaurant');
      const tableParam = params.get('table') || params.get('masa');
      const urlToken = params.get('token');
      
      // Subdomain'den gelen bilgileri öncelikle kullan
      const finalRestaurant = restaurantFromUrl || restaurant;
      const finalTable = tableFromUrl || tableParam;
      
      setRestaurantSlug(finalRestaurant);
      setRestaurantName(getRestaurantDisplayName(finalRestaurant));
      
      // Masa numarasını URL'den al ve store'a kaydet (opsiyonel)
      if (finalTable) {
        const tableNum = parseInt(finalTable, 10);
        if (!isNaN(tableNum)) {
          setTableNumber(tableNum);
        }
      }
      
      // Token'ı basitçe kabul et (validation yok)
      if (urlToken) {
        setSessionToken(urlToken);
      }
      
      // Her durumda token'ı geçerli kabul et
      setTokenValid(true);
    }
  }, [setTableNumber]);
  
  // Restaurant store
  const { authenticatedRestaurant } = useAuthStore();
  const restaurants = useRestaurantStore(state => state.restaurants);
  // URL'de restaurant parametresi varsa onu kullan, yoksa authenticated restaurant
  const activeRestaurant = restaurantSlug 
    ? restaurants.find(r => 
        r.username === restaurantSlug || 
        r.id === restaurantSlug ||
        r.name.toLowerCase() === restaurantSlug.toLowerCase() ||
        r.name.toLowerCase().replace(/\s+/g, '-') === restaurantSlug.toLowerCase()
      )
    : authenticatedRestaurant;
  
  // Restaurant değiştiğinde cart'ı restaurant-specific yap
  useEffect(() => {
    if (activeRestaurant?.id) {
      setRestaurantId(activeRestaurant.id);
    }
  }, [activeRestaurant?.id, setRestaurantId]);
  
  // Menü verilerini restoran bazlı al
  const allCategories = useRestaurantStore(state => state.categories);
  const allMenuItems = useRestaurantStore(state => state.menuItems);
  
  // Sadece bu restoranın kategorilerini ve ürünlerini filtrele
  const categories = allCategories.filter(c => c.restaurantId === activeRestaurant?.id);
  const items = allMenuItems.filter(i => i.restaurantId === activeRestaurant?.id);
  const subcategories: any[] = []; // Şimdilik subcategory yok
  
  // Local states
  const [activeCategory, setActiveCategory] = useState('popular');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState('Menüde ara...');
  
  // Restaurant-specific settings kullan
  const { settings } = useRestaurantSettings(activeRestaurant?.id);
  const [showSplash, setShowSplash] = useState(false);
  const primary = settings.branding.primaryColor;
  const secondary = settings.branding.secondaryColor || settings.branding.primaryColor;
  
  // Mount on client
  useEffect(() => {
    setIsClient(true);
    try {
      const hasVisited = typeof window !== 'undefined' && sessionStorage.getItem('menuVisitedOnce');
      if (!hasVisited) {
        setShowSplash(true);
        sessionStorage.setItem('menuVisitedOnce', '1');
        setTimeout(() => setShowSplash(false), 1600);
      }
    } catch {}
  }, []);

  // Update search placeholder based on language
  useEffect(() => {
    if (currentLanguage === 'Turkish') {
      setSearchPlaceholder('Menüde ara...');
    } else {
      // For other languages, we'll translate this
      const translatePlaceholder = async () => {
        try {
          const translated = await translate('Menüde ara...');
          setSearchPlaceholder(translated);
        } catch (error) {
          setSearchPlaceholder('Search menu...');
        }
      };
      translatePlaceholder();
    }
  }, [currentLanguage, translate]);

  // Helper functions - defined inside component to avoid dependency issues
  const getPopularItems = () => {
    return items.filter(item => item.isPopular);
  };

  const getItemsByCategory = (categoryId: string) => {
    return items.filter(item => item.categoryId === categoryId && item.isAvailable);
  };

  const getItemsBySubcategory = (subcategoryId: string) => {
    return items.filter(item => (item as any).subcategory === subcategoryId);
  };

  const getSubcategoriesByParent = (parentId: string) => {
    return subcategories.filter(subcategory => subcategory.parentId === parentId);
  };

  // Get cart count - only calculate on client side to avoid hydration mismatch
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isClient) {
      setCartCount(cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0));
    }
  }, [isClient, cartItems]);

  // Get language code for menu data
  const language = currentLanguage === 'Turkish' ? 'tr' : 'en';
  
  // Get menu categories
  const menuCategories = [
    { id: 'popular', name: currentLanguage === 'Turkish' ? 'Popüler' : 'Popular' },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name[language as keyof typeof cat.name]
    }))
  ];

  // Get subcategories for active category
  const activeSubcategories = activeCategory === 'popular' ? [] : getSubcategoriesByParent(activeCategory);
  
  // Get filtered items
  let filteredItems = activeCategory === 'popular'
    ? getPopularItems()
    : activeSubcategory
      ? getItemsBySubcategory(activeSubcategory)
      : getItemsByCategory(activeCategory);

  if (search.trim() !== '') {
    filteredItems = filteredItems.filter(item =>
      item.name[language as keyof typeof item.name].toLowerCase().includes(search.toLowerCase()) ||
      (item.description[language as keyof typeof item.description] && item.description[language as keyof typeof item.description].toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Event handlers
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
  };

  const handleSubcategoryChange = (subcategoryId: string | null) => {
    setActiveSubcategory(subcategoryId);
  };

  const addToCart = (item: any) => {
    try {
      // İlk ürün sepete eklendiğinde token'ı kullanıldı olarak işaretle
      if (cartItems.length === 0) {
        markTokenAsUsed();
      }
      
      addItem({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image
      });
      setToastMessage('Ürün sepete eklendi!');
      setToastVisible(true);
      // Auto hide toast after 3 seconds
      setTimeout(() => setToastVisible(false), 3000);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  
  // Garson çağır modal aç
  const handleCallWaiter = () => {
    setShowWaiterModal(true);
  };
  
  // Hızlı seçenek ile garson çağır
  const handleQuickRequest = (requestType: string, message: string) => {
    if (tableNumber) {
      createWaiterCallNotification(tableNumber, message);
      setToastMessage(message);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
      setShowWaiterModal(false);
      setCustomNote('');
    }
  };
  
  // Özel not ile garson çağır
  const handleCustomRequest = () => {
    if (tableNumber && customNote.trim()) {
      createWaiterCallNotification(tableNumber, customNote);
      setToastMessage('Özel talebiniz iletildi');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
      setShowWaiterModal(false);
      setCustomNote('');
    }
  };

  // Token validation kaldırıldı - menü her zaman açık
  if (false) { // Bu blok artık çalışmaz
    return (
      <>
        <SetBrandColor />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaQrcode className="text-red-600 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Oturum Geçersiz</h2>
              <p className="text-gray-600">Menü yüklenemiyor</p>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-start">
                <FaBell className="text-yellow-600 mt-0.5 mr-3" />
                <div className="text-left">
                  <h3 className="font-semibold text-yellow-800 mb-1">Güvenlik Önlemi</h3>
                  <p className="text-sm text-yellow-700">
                    Her sipariş için QR kodunu tekrar taramanız gerekmektedir. Bu, yetkisiz siparişleri önler.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center text-gray-600 text-sm">
                <FaQrcode className="mr-2" />
                <span>Masanızdaki QR kodu tarayın</span>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaQrcode />
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SetBrandColor />
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white animate-fadeIn">
          <div className="text-center px-6 animate-scaleIn">
            <div className="relative inline-flex items-center justify-center mb-3">
              <div className="absolute inset-0 -z-10 h-24 w-24 rounded-full opacity-10" style={{ backgroundColor: 'var(--brand-primary)' }} />
              {settings.branding.logo ? (
                <img src={settings.branding.logo} alt="Logo" className="h-20 w-20 object-contain rounded-md shadow-sm" />
              ) : (
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: 'var(--brand-primary)' }}>
                  {(settings.basicInfo.name || 'Işletme').slice(0,1)}
                </div>
              )}
            </div>
            <div className="text-dynamic-xl font-bold text-gray-900">{activeRestaurant?.name || settings.basicInfo.name || 'İşletme'}</div>
            {settings.branding.showSloganOnLoading !== false && settings.basicInfo.slogan && (
              <div className="text-dynamic-sm text-gray-600 mt-1">{settings.basicInfo.slogan}</div>
            )}
            <div className="mt-4 mx-auto h-[1px] w-40 bg-gray-200" />
            <div className="mt-3 w-40 h-1 bg-gray-100 rounded overflow-hidden mx-auto">
              <div className="h-full bg-brand animate-progress" />
            </div>
          </div>
          <style jsx>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes scaleIn { from { transform: scale(.96); opacity: .4 } to { transform: scale(1); opacity: 1 } }
            @keyframes progress { 0% { transform: translateX(-100%) } 100% { transform: translateX(0) } }
            .animate-fadeIn { animation: fadeIn 200ms ease-out }
            .animate-scaleIn { animation: scaleIn 300ms ease-out }
            .animate-progress { animation: progress 900ms ease-out forwards }
          `}</style>
        </div>
      )}
      <Toast 
        message={toastMessage} 
        visible={toastVisible} 
        onClose={() => setToastVisible(false)} 
      />
      <AnnouncementPopup />
      
      {/* Garson Çağır Modal */}
      {showWaiterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                <TranslatedText>Garson Çağır</TranslatedText>
              </h3>
              <button 
                onClick={() => {
                  setShowWaiterModal(false);
                  setCustomNote('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Hızlı Seçenekler */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => handleQuickRequest('bill', 'Hesap istiyorum')}
                className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
              >
                <FaMoneyBillWave className="text-green-600 text-2xl mb-2" />
                <span className="text-sm font-medium text-green-800">
                  <TranslatedText>Hesap Öde</TranslatedText>
                </span>
              </button>
              
              <button 
                onClick={() => handleQuickRequest('water', 'Su istiyorum')}
                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <FaTint className="text-blue-600 text-2xl mb-2" />
                <span className="text-sm font-medium text-blue-800">
                  <TranslatedText>Su İste</TranslatedText>
                </span>
              </button>
              
              <button 
                onClick={() => handleQuickRequest('clean', 'Masayı temizleyebilir misiniz?')}
                className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
              >
                <FaBroom className="text-purple-600 text-2xl mb-2" />
                <span className="text-sm font-medium text-purple-800">
                  <TranslatedText>Masa Temizliği</TranslatedText>
                </span>
              </button>
              
              <button 
                onClick={() => handleQuickRequest('cutlery', 'Yeni tabak/çatal bıçak istiyorum')}
                className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
              >
                <FaClipboardList className="text-orange-600 text-2xl mb-2" />
                <span className="text-sm font-medium text-orange-800">
                  <TranslatedText>Tabak/Çatal</TranslatedText>
                </span>
              </button>
            </div>
            
            {/* Özel Not */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaStickyNote className="inline mr-2" />
                <TranslatedText>Özel Not</TranslatedText>
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Özel bir talebiniz varsa buraya yazın..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={handleCustomRequest}
                disabled={!customNote.trim()}
                className="w-full mt-3 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <TranslatedText>Gönder</TranslatedText>
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="min-h-screen pb-20">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-3 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="mr-2">
                <FaArrowLeft size={16} />
              </Link>
              <h1 className="text-dynamic-lg font-bold text-primary">
                {restaurantName}
              </h1>
              {tableNumber && (
                <div className="ml-2 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: 'var(--tone1-bg)', color: 'var(--tone1-text)', border: '1px solid var(--tone1-border)' }}>
                  <TranslatedText>Masa</TranslatedText> #{tableNumber}
                </div>
              )}
            </div>
          </div>
          {/* Dil seçici sağ üstte, arama ve diğer içerikten tamamen ayrı */}
          <div className="fixed top-4 right-4 z-30">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-1">
              <LanguageSelector />
            </div>
          </div>
        </header>

        {/* Search */}
        <div className="pt-16 px-3 flex items-center mb-4">
          <input
            type="text"
            className="border rounded p-2 w-full mr-2"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Anlık Duyurular Slider */}
        <div className="px-3 mb-4">
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <div className="flex animate-slide">
              <div className="min-w-full text-white p-3 bg-brand-gradient">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🎉</span>
                  <div>
                    <div className="font-semibold text-sm">
                      <TranslatedText>Bugüne Özel!</TranslatedText>
                    </div>
                    <div className="text-xs opacity-90">
                      <TranslatedText>Tüm tatlılarda %20 indirim - Sadece bugün geçerli</TranslatedText>
                    </div>
                  </div>
                </div>
              </div>
              <div className="min-w-full text-white p-3 bg-brand-gradient">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🍲</span>
                  <div>
                    <div className="font-semibold text-sm">
                      <TranslatedText>Günün Çorbası</TranslatedText>
                    </div>
                    <div className="text-xs opacity-90">
                      <TranslatedText>Ezogelin çorbası - Ev yapımı lezzet</TranslatedText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide {
            0%, 45% { transform: translateX(0); }
            50%, 95% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          .animate-slide {
            animation: slide 8s infinite;
          }
        `}</style>

        {/* Categories */}
        <div className="pb-2 overflow-x-auto">
          <div className="flex px-3 space-x-2 min-w-max">
            {menuCategories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-dynamic-sm ${
                  activeCategory === category.id
                    ? 'btn-gradient'
                    : 'bg-brand-surface text-gray-700'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        {activeCategory !== 'popular' && activeSubcategories.length > 0 && (
          <div className="overflow-x-auto bg-gray-50 py-2 mb-4">
            <div className="flex px-3 space-x-2 min-w-max">
              <button
                className={`px-3 py-1 rounded-full whitespace-nowrap text-xs flex items-center ${
                  activeSubcategory === null
                    ? 'text-white'
                    : 'bg-white border text-gray-700'
                }`}
                onClick={() => handleSubcategoryChange(null)}
                style={activeSubcategory === null ? { backgroundColor: primary, borderColor: 'transparent' } : { borderColor: 'var(--brand-subtle)' }}
              >
                <FaFilter className="mr-1" size={10} />
                <TranslatedText>Tümü</TranslatedText>
              </button>

              {activeSubcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  className={`px-3 py-1 rounded-full whitespace-nowrap text-xs ${
                    activeSubcategory === subcategory.id
                      ? 'btn-gradient'
                      : 'bg-white border text-gray-700'
                  }`}
                  onClick={() => handleSubcategoryChange(subcategory.id)}
                  style={activeSubcategory === subcategory.id ? { borderColor: 'transparent' } : { borderColor: 'var(--brand-subtle)' }}
                >
                  {subcategory.name[language as keyof typeof subcategory.name]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="container mx-auto px-3 py-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FaUtensils className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                <TranslatedText>Henüz menü eklenmemiş</TranslatedText>
              </h3>
              <p className="text-gray-600 mb-4">
                <TranslatedText>Restoran sahibi henüz menü ürünlerini eklememiş. Lütfen daha sonra tekrar deneyin.</TranslatedText>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  <TranslatedText>Restoran sahibiyseniz, işletme panelinizden menü ürünlerinizi ekleyebilirsiniz.</TranslatedText>
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border p-3 flex">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={item.image || '/placeholder-food.jpg'}
                    alt={item.name[language as keyof typeof item.name] || 'Menu item'}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  {item.isPopular && (
                    <div className="absolute top-0 left-0 text-white text-xs px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--brand-strong)' }}>
                      <FaStar className="inline-block mr-1" size={8} />
                      <TranslatedText>Popüler</TranslatedText>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-dynamic-sm">{item.name[language as keyof typeof item.name] || item.name.tr || item.name.en}</h3>
                    <span className="font-semibold text-dynamic-sm" style={{ color: primary }}>{item.price} ₺</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {item.description[language as keyof typeof item.description] || item.description.tr || item.description.en}
                  </p>

                  {/* Allergens */}
                  {item.allergens && (item.allergens as any).tr && (item.allergens as any).tr.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(item.allergens as any).tr.slice(0, 3).map((allergen: string, i: number) => (
                        <span key={i} className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => openModal(item)}
                      className="text-xs flex items-center"
                      style={{ color: primary }}
                    >
                      <FaInfo className="mr-1" size={10} />
                      <TranslatedText>Detayları Gör</TranslatedText>
                    </button>
                    <button
                      className="btn btn-secondary py-1 px-3 text-xs rounded flex items-center"
                      onClick={() => addToCart(item)}
                    >
                      <FaPlus className="mr-1" size={10} />
                      <TranslatedText>Sepete Ekle</TranslatedText>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>

        {/* Sabit Duyurular */}
        <div className="container mx-auto px-3 py-4 mb-20">
          <div className="rounded-xl p-5 shadow-lg border bg-tone1">
            <div className="grid grid-cols-1 gap-3">
              {/* WiFi Info */}
              {settings.basicInfo.wifiPassword && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border-l-4" style={{ borderLeftColor: 'var(--brand-subtle)' }}>
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📶</span>
                    <span className="text-sm font-medium text-gray-700">
                      <TranslatedText>WiFi Şifresi</TranslatedText>
                    </span>
                  </div>
                  <span className="text-sm font-bold px-2 py-1 rounded" style={{ color: 'var(--brand-strong)', backgroundColor: 'var(--brand-surface)' }}>{settings.basicInfo.wifiPassword}</span>
                </div>
              )}
              {/* Google Review Button */}
              {settings.basicInfo.googleReviewLink && (
                <a
                  href={settings.basicInfo.googleReviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg shadow-sm border-l-4 transition group bg-tone2"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">⭐</span>
                    <span className="text-sm font-medium text-gray-800">
                      <TranslatedText>Google'da Değerlendir</TranslatedText>
                    </span>
                  </div>
                  <button className="text-xs font-semibold px-3 py-1 rounded-lg shadow group-hover:scale-105 transition btn-secondary">
                    <TranslatedText>Yorum Yap</TranslatedText>
                  </button>
                </a>
              )}
              {/* Working Hours */}
              {settings.basicInfo.workingHours && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border-l-4" style={{ borderLeftColor: 'var(--brand-subtle)' }}>
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🕒</span>
                    <span className="text-sm font-medium text-gray-700">
                      <TranslatedText>Çalışma Saatleri</TranslatedText>
                    </span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: 'var(--brand-strong)' }}>{settings.basicInfo.workingHours}</span>
                </div>
              )}
              {/* Instagram Button */}
              {settings.basicInfo.instagram && (
                <a
                  href={settings.basicInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg shadow-sm border-l-4 transition group bg-tone3"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📱</span>
                    <span className="text-sm font-medium text-gray-800">
                      <TranslatedText>Instagram'da Takip Et</TranslatedText>
                    </span>
                  </div>
                  <button className="text-sm font-bold px-3 py-1 rounded-lg shadow group-hover:scale-105 transition btn-primary">
                    <TranslatedText>Takip Et</TranslatedText>
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg z-40">
          <div className="container mx-auto flex justify-around">
            <button className="flex flex-col items-center" style={{ color: primary }}>
              <FaUtensils className="mb-0.5" size={16} />
              <span className="text-[10px]"><TranslatedText>Menü</TranslatedText></span>
            </button>
            <div className="flex flex-col items-center relative" style={{ color: cartCount > 0 ? primary : '#9CA3AF' }}>
              <div className="relative">
                <FaShoppingCart className="mb-0.5" size={16} />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]"><TranslatedText>Sepet</TranslatedText></span>
            </div>
            <button 
              onClick={handleCallWaiter}
              className="flex flex-col items-center" 
              style={{ color: primary }}
            >
              <FaBell className="mb-0.5" size={16} />
              <span className="text-[10px]"><TranslatedText>Garson Çağır</TranslatedText></span>
            </button>
          </div>
        </nav>
      </main>

      {/* Menu Item Modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default function MenuPage() {
  return (
    <LanguageProvider>
      <MenuPageContent />
    </LanguageProvider>
  );
}

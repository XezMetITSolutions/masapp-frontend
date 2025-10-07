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
import { saveKardeslerDataToLocalStorage } from '@/utils/saveKardeslerData';

export function MenuPageContent() {
  // Store states
  const { currentLanguage, translate } = useLanguage();
  const { 
    addItem, 
    items: cartItems, 
    getTotal, 
    clearCart, 
    setTableNumber, 
    tableNumber,
    orderStatus,
    setOrderStatus,
    paid,
    setPaid
  } = useCartStore();
  
  const { 
    currentRestaurant, 
    categories: allCategories, 
    menuItems: allMenuItems,
    fetchRestaurantByUsername,
    loading
  } = useRestaurantStore();
  
  const { getActiveNotifications, markAsRead } = useNotificationStore();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [restaurantSettings, setRestaurantSettings] = useState<any>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isSessionValid, setIsSessionValid] = useState<boolean>(false);

  // Subdomain'den restoran bilgisini al
  useEffect(() => {
    const getRestaurantFromSubdomain = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        const mainDomains = ['localhost', 'www', 'guzellestir'];
        
        if (!mainDomains.includes(subdomain) && hostname.includes('.')) {
          // Backend'den restoran verilerini çek
          fetchRestaurantByUsername(subdomain);
        }
      }
    };

    getRestaurantFromSubdomain();
  }, [fetchRestaurantByUsername]);

  // Restoran ID'ye göre kategorileri ve menü ürünlerini filtrele
  const categories = allCategories.filter(c => c.restaurantId === currentRestaurant?.id);
  const menuItems = allMenuItems.filter(i => i.restaurantId === currentRestaurant?.id);

  // Filtrelenmiş menü ürünleri
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.name.tr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.tr?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  });

  // Bildirimleri yükle
  useEffect(() => {
    const loadNotifications = () => {
      const activeNotifs = getActiveNotifications();
      setNotifications(activeNotifs);
    };
    
    loadNotifications();
    const interval = setInterval(loadNotifications, 2000);
    return () => clearInterval(interval);
  }, [getActiveNotifications]);

  // Restoran ayarlarını yükle
  useEffect(() => {
    if (currentRestaurant?.id) {
      const settings = JSON.parse(localStorage.getItem(`restaurant_settings_${currentRestaurant.id}`) || '{}');
      setRestaurantSettings(settings);
    }
  }, [currentRestaurant]);

  // Session token kontrolü
  useEffect(() => {
    const token = getSessionToken();
    if (token) {
      setSessionToken(token);
      const isValid = validateToken(token);
      setIsSessionValid(isValid);
      
      if (isValid) {
        const remaining = getRemainingTime(token);
        setRemainingTime(remaining);
      }
    }
  }, []);

  // Bildirim okundu olarak işaretle
  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    setShowNotifications(false);
  };

  // Ürün ekleme
  const handleAddToCart = (item: any) => {
    addItem({
      itemId: item.id,
      name: item.name[currentLanguage] || item.name.tr,
      price: item.price,
      quantity: 1,
      image: item.image,
      notes: ''
    });
    
    setToastMessage(translate('Ürün sepete eklendi'));
    setShowToast(true);
  };

  // Ürün detayı göster
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  // Sipariş gönder
  const handleOrder = () => {
    if (cartItems.length === 0) {
      setToastMessage(translate('Sepetiniz boş'));
      setShowToast(true);
      return;
    }
    
    setOrderStatus('pending');
    setToastMessage(translate('Siparişiniz gönderildi'));
    setShowToast(true);
    
    // 3 saniye sonra siparişi hazır olarak işaretle
    setTimeout(() => {
      setOrderStatus('ready');
    }, 3000);
  };

  // Ödeme yap
  const handlePayment = () => {
    setPaid(true);
    setToastMessage(translate('Ödeme başarılı'));
    setShowToast(true);
    
    // 2 saniye sonra sepeti temizle
    setTimeout(() => {
      clearCart();
      setPaid(false);
      setOrderStatus('idle');
    }, 2000);
  };

  // Restoran yükleniyor mu?
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Restoran bulunamadı
  if (!currentRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restoran Bulunamadı</h1>
          <p className="text-gray-600 mb-4">Bu subdomain için restoran bulunamadı.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  // Menü boş
  if (menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/" className="text-gray-600 hover:text-gray-800">
                  <FaArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="ml-4 text-xl font-semibold text-gray-900">
                  {currentRestaurant.name}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-800"
                >
                  <FaBell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <FaUtensils className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Henüz menü eklenmemiş</h2>
            <p className="text-gray-600 mb-6">
              Restoran sahibi henüz menü ürünlerini eklememiş. Lütfen daha sonra tekrar deneyin.
            </p>
            <p className="text-sm text-gray-500">
              Restoran sahibiyseniz, işletme panelinizden menü ürünlerinizi ekleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {currentRestaurant.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-800"
              >
                <FaBell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement */}
      {showAnnouncement && (
        <AnnouncementPopup
          onClose={() => setShowAnnouncement(false)}
          restaurantId={currentRestaurant.id}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={translate('Menüde ara...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">{translate('Tüm Kategoriler')}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name[currentLanguage] || category.name.tr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {translate('Tümü')}
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.name[currentLanguage] || category.name.tr}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <Image
                      src={item.image || '/placeholder-food.jpg'}
                      alt={item.name[currentLanguage] || item.name.tr}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    {item.isPopular && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        <FaStar className="inline mr-1" />
                        {translate('Popüler')}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.name[currentLanguage] || item.name.tr}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description[currentLanguage] || item.description.tr}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">
                        ₺{item.price}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleItemClick(item)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <FaInfo className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FaPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {translate('Sepet')}
                </h2>
                <span className="text-sm text-gray-500">
                  Masa #{tableNumber}
                </span>
              </div>

              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {translate('Sepetiniz boş')}
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ₺{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">
                        {translate('Toplam')}
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        ₺{getTotal().toFixed(2)}
                      </span>
                    </div>

                    {orderStatus === 'idle' && (
                      <button
                        onClick={handleOrder}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        {translate('Sipariş Ver')}
                      </button>
                    )}

                    {orderStatus === 'pending' && (
                      <div className="text-center py-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">{translate('Sipariş hazırlanıyor...')}</p>
                      </div>
                    )}

                    {orderStatus === 'ready' && !paid && (
                      <button
                        onClick={handlePayment}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        {translate('Ödeme Yap')}
                      </button>
                    )}

                    {paid && (
                      <div className="text-center py-3">
                        <div className="text-green-600 mb-2">
                          <FaMoneyBillWave className="h-8 w-8 mx-auto" />
                        </div>
                        <p className="text-sm text-gray-600">{translate('Ödeme başarılı!')}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{translate('Bildirimler')}</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">{translate('Bildirim yok')}</p>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Menu Item Modal */}
      {showItemModal && selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setShowItemModal(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <LanguageProvider>
      <MenuPageContent />
    </LanguageProvider>
  );
}
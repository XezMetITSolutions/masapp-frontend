'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaBell, FaArrowLeft, FaStar, FaPlus, FaInfo, FaUtensils, FaFilter } from 'react-icons/fa';
import { useCartStore } from '@/store';
import useRestaurantStore from '@/store/useRestaurantStore';
import { useAuthStore } from '@/store/useAuthStore';
import AnnouncementPopup from '@/components/AnnouncementPopup';
import Toast from '@/components/Toast';
import MenuItemModal from '@/components/MenuItemModal';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import TranslatedText from '@/components/TranslatedText';
import useBusinessSettingsStore from '@/store/useBusinessSettingsStore';
import SetBrandColor from '@/components/SetBrandColor';

export function MenuPageContent() {
  // Store states
  const { currentLanguage, translate } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const tableNumber = useCartStore(state => state.tableNumber);
  
  // URL parametrelerinden restaurant slug'ını al
  const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRestaurantSlug(params.get('restaurant'));
    }
  }, []);
  
  // Restaurant store
  const { authenticatedRestaurant } = useAuthStore();
  const restaurants = useRestaurantStore(state => state.restaurants);
  
  // URL'de restaurant parametresi varsa onu kullan, yoksa authenticated restaurant
  const activeRestaurant = restaurantSlug 
    ? restaurants.find(r => r.username === restaurantSlug || r.id === restaurantSlug)
    : authenticatedRestaurant;
  
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
  const { settings } = useBusinessSettingsStore();
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
    return items.filter(item => item.popular);
  };

  const getItemsByCategory = (categoryId: string) => {
    return items.filter(item => item.category === categoryId);
  };

  const getItemsBySubcategory = (subcategoryId: string) => {
    return items.filter(item => item.subcategory === subcategoryId);
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
      addItem({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image
      });
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
      <Toast message="Ürün sepete eklendi!" visible={toastVisible} onClose={() => setToastVisible(false)} />
      <AnnouncementPopup />
      <main className="min-h-screen pb-20">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-3 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="mr-2">
                <FaArrowLeft size={16} />
              </Link>
              <h1 className="text-dynamic-lg font-bold text-primary">
                <TranslatedText>Menü</TranslatedText>
              </h1>
              <div className="ml-2 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: 'var(--tone1-bg)', color: 'var(--tone1-text)', border: '1px solid var(--tone1-border)' }}>
                <TranslatedText>Masa</TranslatedText> #{tableNumber}
              </div>
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
                  {item.popular && (
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
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.allergens.slice(0, 3).map((allergen, i) => (
                        <span key={i} className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full">
                          {allergen[language as keyof typeof allergen] || allergen.tr || allergen.en}
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
        </div>

        {/* Sabit Duyurular */}
        <div className="container mx-auto px-3 py-4 mb-20">
          <div className="rounded-xl p-5 shadow-lg border bg-tone1">
            <div className="grid grid-cols-1 gap-3">
              {/* WiFi Info */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border-l-4" style={{ borderLeftColor: 'var(--brand-subtle)' }}>
                <div className="flex items-center">
                  <span className="text-lg mr-3">📶</span>
                  <span className="text-sm font-medium text-gray-700">
                    <TranslatedText>WiFi Şifresi</TranslatedText>
                  </span>
                </div>
                <span className="text-sm font-bold px-2 py-1 rounded" style={{ color: 'var(--brand-strong)', backgroundColor: 'var(--brand-surface)' }}>restoran2024</span>
              </div>
              {/* Google Review Button */}
              <a
                href="https://www.google.com/maps/place/restoranadi/reviews" // Change to actual Google review URL
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
              {/* Working Hours */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border-l-4" style={{ borderLeftColor: 'var(--brand-subtle)' }}>
                <div className="flex items-center">
                  <span className="text-lg mr-3">🕒</span>
                  <span className="text-sm font-medium text-gray-700">
                    <TranslatedText>Çalışma Saatleri</TranslatedText>
                  </span>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--brand-strong)' }}>09:00 - 23:00</span>
              </div>
              {/* Instagram Button */}
              <a
                href="https://instagram.com/restoranadi" // Change to actual Instagram URL
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
                  @restoranadi
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg">
          <div className="container mx-auto flex justify-around">
            <Link href="/menu" className="flex flex-col items-center" style={{ color: primary }}>
              <FaUtensils className="mb-0.5" size={16} />
              <span className="text-[10px]"><TranslatedText>Menü</TranslatedText></span>
            </Link>
            <Link href="/menu" className="flex flex-col items-center" style={{ color: primary }}>
              <div className="relative">
                <FaShoppingCart className="mb-0.5" size={16} />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]"><TranslatedText>Sepet</TranslatedText></span>
            </Link>
            <Link href="/business/waiter" className="flex flex-col items-center" style={{ color: primary }}>
              <FaBell className="mb-0.5" size={16} />
              <span className="text-[10px]"><TranslatedText>Garson Çağır</TranslatedText></span>
            </Link>
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

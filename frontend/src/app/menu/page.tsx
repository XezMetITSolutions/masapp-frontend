'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaBell, FaArrowLeft, FaStar, FaPlus, FaInfo, FaUtensils, FaFilter } from 'react-icons/fa';
import { useCartStore } from '@/store';
import useRestaurantStore from '@/store/useRestaurantStore';
import AnnouncementPopup from '@/components/AnnouncementPopup';
import Toast from '@/components/Toast';
import MenuItemModal from '@/components/MenuItemModal';
import useBusinessSettingsStore from '@/store/useBusinessSettingsStore';
import SetBrandColor from '@/components/SetBrandColor';
import { useSearchParams } from 'next/navigation';

function MenuPageContent() {
  // Store states
  const addItem = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const tableNumber = useCartStore(state => state.tableNumber);
  const searchParams = useSearchParams();
  
  // Restaurant store (BACKEND DATA)
  const { 
    restaurants, 
    categories: allCategories, 
    menuItems: allMenuItems,
    fetchRestaurantByUsername,
    loading 
  } = useRestaurantStore();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const subcategories: any[] = []; // Not used in this page
  
  // Local states
  const [activeCategory, setActiveCategory] = useState('popular');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { settings } = useBusinessSettingsStore();
  const [showSplash, setShowSplash] = useState(false);
  const primary = settings.branding.primaryColor;
  const secondary = settings.branding.secondaryColor || settings.branding.primaryColor;
  
  // Fetch restaurant and menu on mount
  useEffect(() => {
    setIsClient(true);
    
    // Splash screen
    try {
      const hasVisited = typeof window !== 'undefined' && sessionStorage.getItem('menuVisitedOnce');
      if (!hasVisited) {
        setShowSplash(true);
        sessionStorage.setItem('menuVisitedOnce', '1');
        setTimeout(() => setShowSplash(false), 1600);
      }
    } catch {}

    // Get restaurant from subdomain
    const getRestaurantFromSubdomain = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        const mainDomains = ['localhost', 'www', 'guzellestir'];
        
        if (!mainDomains.includes(subdomain) && hostname.includes('.')) {
          return subdomain;
        }
      }
      return null;
    };

    const subdomain = getRestaurantFromSubdomain();
    const restaurantParam = searchParams.get('restaurant');
    const targetRestaurant = subdomain || restaurantParam || 'aksaray'; // Default to aksaray for testing

    console.log('[MENU] Target restaurant:', targetRestaurant);
    console.log('[MENU] Restaurants in store:', restaurants.length);

    if (targetRestaurant) {
      // Find restaurant in store
      const foundRestaurant = restaurants.find(r => 
        r.username === targetRestaurant || 
        r.name.toLowerCase().replace(/\s+/g, '-') === targetRestaurant ||
        r.name.toLowerCase().includes(targetRestaurant)
      );

      if (foundRestaurant) {
        console.log('[MENU] Found restaurant in store:', foundRestaurant.name);
        setRestaurant(foundRestaurant);
        
        // Filter categories and items for this restaurant
        const restaurantCategories = allCategories.filter(c => c.restaurantId === foundRestaurant.id);
        const restaurantItems = allMenuItems.filter(i => i.restaurantId === foundRestaurant.id);
        
        console.log('[MENU] Categories:', restaurantCategories.length);
        console.log('[MENU] Menu items:', restaurantItems.length);
        
        setCategories(restaurantCategories);
        setItems(restaurantItems);
      } else if (!loading) {
        // Fetch from backend
        console.log('[MENU] Fetching from backend:', targetRestaurant);
        fetchRestaurantByUsername(targetRestaurant).then((res) => {
          if (res) {
            console.log('[MENU] Fetched restaurant:', res.name);
            setRestaurant(res);
            
            // Get updated data from store
            const restaurantCategories = allCategories.filter(c => c.restaurantId === res.id);
            const restaurantItems = allMenuItems.filter(i => i.restaurantId === res.id);
            
            console.log('[MENU] After fetch - Categories:', restaurantCategories.length);
            console.log('[MENU] After fetch - Items:', restaurantItems.length);
            
            setCategories(restaurantCategories);
            setItems(restaurantItems);
          }
        });
      }
    }
  }, [restaurants, allCategories, allMenuItems, searchParams, fetchRestaurantByUsername, loading]);
  
  
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
  
  // Get menu categories
  const menuCategories = [
    { id: 'popular', name: 'Popüler' },
    ...categories.map(cat => ({
      id: cat.id,
      name: typeof cat.name === 'string' ? cat.name : (cat.name?.tr || '')
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
    filteredItems = filteredItems.filter(item => {
      const name = typeof item.name === 'string' ? item.name : (item.name?.tr || '');
      const description = typeof item.description === 'string' ? item.description : (item.description?.tr || '');
      return name.toLowerCase().includes(search.toLowerCase()) ||
             description.toLowerCase().includes(search.toLowerCase());
    });
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
            <div className="text-dynamic-xl font-bold text-gray-900">{settings.basicInfo.name || 'İşletme'}</div>
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
                Menü
              </h1>
              <div className="ml-2 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: 'var(--tone1-bg)', color: 'var(--tone1-text)', border: '1px solid var(--tone1-border)' }}>
                Masa #{tableNumber}
              </div>
            </div>
          </div>
        </header>

        {/* Search */}
        <div className="pt-16 px-3 flex items-center mb-4">
          <input
            type="text"
            className="border rounded p-2 w-full mr-2"
            placeholder="Menüde ara..."
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
                      Bugüne Özel!
                    </div>
                    <div className="text-xs opacity-90">
                      Tüm tatlılarda %20 indirim - Sadece bugün geçerli
                    </div>
                  </div>
                </div>
              </div>
              <div className="min-w-full text-white p-3 bg-brand-gradient">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🍲</span>
                  <div>
                    <div className="font-semibold text-sm">
                      Günün Çorbası
                    </div>
                    <div className="text-xs opacity-90">
                      Ezogelin çorbası - Ev yapımı lezzet
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
                Tümü
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
                  style={activeSubcategory.id ? { borderColor: 'transparent' } : { borderColor: 'var(--brand-subtle)' }}
                >
                  {subcategory.name?.tr || subcategory.name}
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
                    alt={item.name?.tr || item.name || 'Menu item'} 
                    width={80} 
                    height={80} 
                    className="object-cover w-full h-full rounded-lg"
                  />
                  {item.popular && (
                    <div className="absolute top-0 left-0 text-white text-xs px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--brand-strong)' }}>
                      <FaStar className="inline-block mr-1" size={8} />
                      Popüler
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-dynamic-sm">{item.name?.tr || item.name}</h3>
                    <span className="font-semibold text-dynamic-sm" style={{ color: primary }}>{item.price} ₺</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {item.description?.tr || item.description}
                  </p>
                  
                  {/* Allergens */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.allergens.slice(0, 3).map((allergen, i) => (
                        <span key={i} className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full">
                          {allergen?.tr || allergen}
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
                      Detayları Gör
                    </button>
                    <button 
                      className="btn btn-secondary py-1 px-3 text-xs rounded flex items-center"
                      onClick={() => addToCart(item)}
                    >
                      <FaPlus className="mr-1" size={10} />
                      Sepete Ekle
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
                    WiFi Şifresi
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
                    Google'da Değerlendir
                  </span>
                </div>
                <button className="text-xs font-semibold px-3 py-1 rounded-lg shadow group-hover:scale-105 transition btn-secondary">
                  Yorum Yap
                </button>
              </a>
              {/* Working Hours */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border-l-4" style={{ borderLeftColor: 'var(--brand-subtle)' }}>
                <div className="flex items-center">
                  <span className="text-lg mr-3">🕒</span>
                  <span className="text-sm font-medium text-gray-700">
                    Çalışma Saatleri
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
                    Instagram'da Takip Et
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg z-50">
          <div className="container mx-auto flex justify-around">
            <Link href="/menu" className="flex flex-col items-center" style={{ color: primary }}>
              <FaUtensils className="mb-0.5" size={20} />
              <span className="text-xs font-medium">Menü</span>
            </Link>
            <button 
              onClick={() => {
                // Sepet sayfasına yönlendir veya modal aç
                window.location.href = '/cart';
              }}
              className="flex flex-col items-center" 
              style={{ color: primary }}
            >
              <div className="relative">
                <FaShoppingCart className="mb-0.5" size={20} />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">Sepet</span>
            </button>
            <button 
              onClick={() => {
                // Garson çağır fonksiyonu
                alert('Garson çağrıldı! Masa numaranız: ' + tableNumber);
              }}
              className="flex flex-col items-center" 
              style={{ color: primary }}
            >
              <FaBell className="mb-0.5" size={20} />
              <span className="text-xs font-medium">Garson Çağır</span>
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
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <MenuPageContent />
    </Suspense>
  );
}

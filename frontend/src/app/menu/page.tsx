'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaBell, FaArrowLeft, FaStar, FaPlus, FaInfo, FaUtensils, FaFilter } from 'react-icons/fa';
import { useMenuStore, useCartStore } from '@/store';
import AnnouncementPopup from '@/components/AnnouncementPopup';
import Toast from '@/components/Toast';
import MenuItemModal from '@/components/MenuItemModal';
import useBusinessSettingsStore from '@/store/useBusinessSettingsStore';
import SetBrandColor from '@/components/SetBrandColor';

function MenuPageContent() {
  // Store states
  const addItem = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const tableNumber = useCartStore(state => state.tableNumber);
    
  // Menu store
  const items = useMenuStore(state => state.items);
  const categories = useMenuStore(state => state.categories);
  const subcategories = useMenuStore(state => state.subcategories);
  const fetchMenu = useMenuStore(state => state.fetchMenu);
    
  // Local states
  const [activeCategory, setActiveCategory] = useState('popular');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search menu...'); // Default to English
  const { settings } = useBusinessSettingsStore();
  const [showSplash, setShowSplash] = useState(false);
  const primary = settings.branding.primaryColor;
  const secondary = settings.branding.secondaryColor || settings.branding.primaryColor;
    
  // Fetch menu on mount
  useEffect(() => {
    fetchMenu();
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
    
  const language = 'en'; // Fixed to 'en' or any default key you prefer

  // Get menu categories (simplified, defaulting to 'en' key or static English for 'popular')
  const menuCategories = [
    { id: 'popular', name: 'Popular' }, // Replaced Turkish with English string
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name[language as keyof typeof cat.name] || cat.name.en || cat.name.tr // Use default key
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
      (item.name[language as keyof typeof item.name] || item.name.en || item.name.tr).toLowerCase().includes(search.toLowerCase()) ||
      ((item.description[language as keyof typeof item.description] || item.description.en || item.description.tr) && (item.description[language as keyof typeof item.description] || item.description.en || item.description.tr).toLowerCase().includes(search.toLowerCase()))
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
                  {(settings.basicInfo.name || 'Business').slice(0,1)}
                </div>
              )}
            </div>
            <div className="text-dynamic-xl font-bold text-gray-900">{settings.basicInfo.name || 'Business'}</div>
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
      <Toast message="Item added to cart!" visible={toastVisible} onClose={() => setToastVisible(false)} />
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
                Menu
              </h1>
              <div className="ml-2 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: 'var(--tone1-bg)', color: 'var(--tone1-text)', border: '1px solid var(--tone1-border)' }}>
                Table #{tableNumber}
              </div>
            </div>
          </div>
          {/* Dil seçici sağ üstte, arama ve diğer içerikten tamamen ayrı */}
          
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
                      Special Today!
                    </div>
                    <div className="text-xs opacity-90">
                      20% off all desserts - only valid today
                    </div>
                  </div>
                </div>
              </div>
              <div className="min-w-full text-white p-3 bg-brand-gradient">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🍲</span>
                  <div>
                    <div className="font-semibold text-sm">
                      Soup of the Day
                    </div>
                    <div className="text-xs opacity-90">
                      Lentil Soup - Homemade Taste
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
                All
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
                  {subcategory.name[language as keyof typeof subcategory.name] || subcategory.name.en || subcategory.name.tr}
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
                      Popular
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-dynamic-sm">{item.name[language as keyof typeof item.name] || item.name.en || item.name.tr}</h3>
                    <span className="font-semibold text-dynamic-sm" style={{ color: primary }}>{item.price} ₺</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {item.description[language as keyof typeof item.description] || item.description.en || item.description.tr}
                  </p>
                  
                  {/* Allergens */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.allergens.slice(0, 3).map((allergen, i) => (
                        <span key={i} className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full">
                          {allergen[language as keyof typeof allergen] || allergen.en || allergen.tr}
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
                      View Details
                    </button>
                    <button 
                      className="btn btn-secondary py-1 px-3 text-xs rounded flex items-center"
                      onClick={() => addToCart(item)}
                    >
                      <FaPlus className="mr-1" size={10} />
                      Add to Cart
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
                    WiFi Password
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
                    Review on Google
                  </span>
                </div>
                <button className="text-xs font-semibold px-3 py-1 rounded-lg shadow group-hover:scale-105 transition btn-secondary">
                  Comment
                </button>
              </a>
              {/* Working Hours */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border-l-4" style={{ borderLeftColor: 'var(--brand-subtle)' }}>
                <div className="flex items-center">
                  <span className="text-lg mr-3">🕒</span>
                  <span className="text-sm font-medium text-gray-700">
                    Working Hours
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
                    Follow on Instagram
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
              <span className="text-[10px]">Menu</span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center" style={{ color: primary }}>
              <div className="relative">
                <FaShoppingCart className="mb-0.5" size={16} />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Cart</span>
            </Link>
            <Link href="/waiter" className="flex flex-col items-center" style={{ color: primary }}>
              <FaBell className="mb-0.5" size={16} />
              <span className="text-[10px]">Call Waiter</span>
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
    <MenuPageContent />
  );
}
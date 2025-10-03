'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import FadeTransition from '@/components/FadeTransition';
import ZoomGallery from '@/components/ZoomGallery';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaBell, FaArrowLeft, FaStar, FaPlus, FaMinus, FaInfo, FaUtensils, FaFilter } from 'react-icons/fa';
import { useMenuStore, useCartStore, useLanguageStore } from '@/store';
import { MenuSubcategory, MenuItem as MenuItemType } from '@/store/useMenuStore';

type MenuItem = MenuItemType & { images?: string[] };

import AnnouncementPopup from '@/components/AnnouncementPopup';
import Toast from '@/components/Toast';
import MenuItemModal from '@/components/MenuItemModal';

export default function MenuPage() {
  // Use Zustand stores
  const { language, setLanguage } = useLanguageStore(state => ({
    language: state.language,
    setLanguage: state.setLanguage
  }));
  
  const { items: cartItems, addItem } = useCartStore();
  const { 
    items, 
    categories, 
    subcategories, 
    fetchMenu, 
    getPopularItems, 
    getItemsByCategory, 
    getItemsBySubcategory,
    getSubcategoriesByParent 
  } = useMenuStore();
  
  const [activeCategory, setActiveCategory] = useState('popular');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  
  // Fetch menu data on component mount
  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);
  
  // Client-side rendering için
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Get cart count (reactive) - only calculate on client side to avoid hydration mismatch
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    if (isClient) {
      setCartCount(useCartStore.getState().items.reduce((sum, it) => sum + (it.quantity || 0), 0));
    }
  }, [isClient]);
  
  // Get table number from cart store
  const { tableNumber } = useCartStore();
  
  // Get translations
  const translations = {
    en: {
      menu: 'Menu',
      cart: 'Cart',
      callWaiter: 'Call Waiter',
      popular: 'Popular',
      starters: 'Starters',
      mains: 'Main Dishes',
      desserts: 'Desserts',
      drinks: 'Drinks',
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      tableNumber: 'Table',
      allergens: 'Allergens',
      calories: 'Calories',
      servingInfo: 'Serving Info',
    },
    tr: {
      menu: 'Menü',
      cart: 'Sepet',
      callWaiter: 'Garson Çağır',
      popular: 'Popüler',
      starters: 'Başlangıçlar',
      mains: 'Ana Yemekler',
      desserts: 'Tatlılar',
      drinks: 'İçecekler',
      addToCart: 'Sepete Ekle',
      viewDetails: 'Detayları Gör',
      tableNumber: 'Masa',
      allergens: 'Alerjenler',
      calories: 'Kalori',
      servingInfo: 'Servis Bilgisi',
    }
  };
  
  const t = translations[language as 'en' | 'tr'];

  // Create category list from store data and add popular option
  const menuCategories = useMemo(() => [
    { id: 'popular', name: t.popular },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name[language as keyof typeof cat.name]
    }))
  ], [categories, language, t.popular]);

  // Arama için state
  const [search, setSearch] = useState('');
  
  // Modal state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get subcategories for the active category - memoized to prevent re-renders
  const activeSubcategories = useMemo(() => {
    if (activeCategory === 'popular') return [];
    return getSubcategoriesByParent(activeCategory);
  }, [activeCategory, getSubcategoriesByParent]);

  // Get filtered items based on active category, subcategory, and search - memoized
  const filteredItems = useMemo(() => {
    let items = activeCategory === 'popular' 
      ? getPopularItems()
      : activeSubcategory 
        ? getItemsBySubcategory(activeSubcategory)
        : getItemsByCategory(activeCategory);
        
    if (search.trim() !== '') {
      items = items.filter(item =>
        item.name[language].toLowerCase().includes(search.toLowerCase()) ||
        (item.description[language] && item.description[language].toLowerCase().includes(search.toLowerCase()))
      );
    }
    return items;
  }, [activeCategory, activeSubcategory, search, language, getPopularItems, getItemsByCategory, getItemsBySubcategory]);
    
  // Handle category change - useCallback to prevent re-renders
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
  }, []);

  // Add item to cart
  const [toastVisible, setToastVisible] = useState(false);

  const addToCart = useCallback((item: MenuItem) => {
    addItem({
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    });
    setToastVisible(true);
  }, [addItem]);

  // Modal functions
  const openModal = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
  }, []);

  const handleSubcategoryChange = useCallback((subcategoryId: string | null) => {
    setActiveSubcategory(subcategoryId);
  }, []);

  return (
    <>
      <Toast message={language === 'tr' ? 'Ürün sepete eklendi!' : 'Item added to cart!'} visible={toastVisible} onClose={() => setToastVisible(false)} />
      <AnnouncementPopup />
      <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-3 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <FaArrowLeft size={16} />
            </Link>
            <h1 className="text-lg font-bold text-primary">{t.menu}</h1>
            <div className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs">
              {t.tableNumber} #{tableNumber}
            </div>
          </div>
          <div className="flex items-center ml-4">
            {/* Dil Seçimi */}
            <button 
              onClick={() => setLanguage('tr')}
              className={`mr-2 px-3 py-1 rounded ${language === 'tr' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              TR
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Arama */}
      <div className="pt-16 px-3 flex items-center">
        <input
          type="text"
          className="border rounded p-2 w-full mr-2"
          placeholder={language === 'tr' ? 'Menüde ara...' : 'Search menu...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setSearch(search)}
        >
          {language === 'tr' ? 'Ara' : 'Search'}
        </button>
      </div>
      {/* Categories */}
      <div className="pb-2 overflow-x-auto">
        <div className="flex px-3 space-x-2 min-w-max">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Subcategories - only show if a main category is selected and it has subcategories */}
      {activeCategory !== 'popular' && activeSubcategories.length > 0 && (
        <div className="overflow-x-auto bg-gray-50 py-2">
          <div className="flex px-3 space-x-2 min-w-max">
            <button
              className={`px-3 py-1 rounded-full whitespace-nowrap text-xs flex items-center ${
                activeSubcategory === null
                  ? 'bg-secondary text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
              onClick={() => handleSubcategoryChange(null)}
            >
              <FaFilter className="mr-1" size={10} />
              {language === 'en' ? 'All' : 'Tümü'}
            </button>
            
            {activeSubcategories.map((subcategory: MenuSubcategory) => (
              <button
                key={subcategory.id}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-xs ${
                  activeSubcategory === subcategory.id
                    ? 'bg-secondary text-white'
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}
                onClick={() => handleSubcategoryChange(subcategory.id)}
              >
                {subcategory.name[language as keyof typeof subcategory.name]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Banner */}
      <div className="container mx-auto px-3 pt-2">
        <div className="mb-4 rounded-lg bg-gradient-to-r from-orange-400 to-pink-500 text-white p-4 flex items-center shadow-lg animate-pulse">
          <span className="font-bold text-lg mr-3">🎉</span>
          <div>
            <div className="font-semibold">Eylül Ayı Kampanyası!</div>
            <div className="text-xs">Tüm salatalarda %20 indirim. Sadece bu ay geçerli!</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-3 py-2">
        <FadeTransition triggerKey={activeCategory + '-' + (activeSubcategory || '') + '-' + search}>
          <div className="grid grid-cols-1 gap-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="card flex p-3 shadow-sm">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.name[language]} 
                    width={80} 
                    height={80} 
                    className="object-cover w-full h-full rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-food.jpg';
                    }}
                  />
                  {item.popular && (
                    <div className="absolute top-0 left-0 bg-secondary text-white text-xs px-1 py-0.5">
                      <FaStar className="inline-block mr-1" size={8} />
                      {language === 'tr' ? 'Popüler' : 'Popular'}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-sm">{item.name[language]}</h3>
                    <span className="font-semibold text-secondary text-sm">{item.price} ₺</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">{item.description[language]}</p>
                  {/* Allerjen ve Diyet Etiketleri */}
                  <div className="flex flex-wrap gap-1 mb-1">
                    {item.allergens && item.allergens.length > 0 && item.allergens.map((a, i) => (
                      <span key={i} className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full">{a[language]}</span>
                    ))}
                    {/* Demo diyet etiketi: Vegan, Glutensiz */}
                    {item.id === 'caesar-salad' && (
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">Vegan</span>
                    )}
                    {item.id === 'bruschetta' && (
                      <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full">Glutensiz</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => openModal(item)}
                      className="text-xs text-secondary flex items-center hover:text-primary"
                    >
                      <FaInfo className="mr-1" size={10} />
                      {t.viewDetails}
                    </button>
                    <button 
                      className="btn bg-secondary hover:bg-secondary/90 text-white py-1 px-2 text-xs flex items-center"
                      onClick={() => addToCart(item)}
                    >
                      <FaPlus className="mr-1" size={10} />
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeTransition>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg">
        <div className="container mx-auto flex justify-around">
          <Link href="/demo/menu" className="flex flex-col items-center text-orange-500">
            <FaUtensils className="mb-0.5" size={16} />
            <span className="text-[10px]">{t.menu}</span>
          </Link>
            <Link href="/demo/cart" className="flex flex-col items-center text-blue-600">
              <div className="relative">
                <FaShoppingCart className="mb-0.5" size={16} />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{t.cart}</span>
            </Link>
          <Link href="/demo/waiter" className="flex flex-col items-center text-blue-600">
            <FaBell className="mb-0.5" size={16} />
            <span className="text-[10px]">{t.callWaiter}</span>
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

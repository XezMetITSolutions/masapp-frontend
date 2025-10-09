'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useRestaurantStore from '@/store/useRestaurantStore';
import { 
  FaShoppingCart, 
  FaSearch,
  FaUtensils,
  FaFire,
  FaTag,
  FaPlus,
  FaMinus,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

function CustomerMenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    restaurants, 
    categories: allCategories, 
    menuItems: allMenuItems,
    fetchRestaurantByUsername,
    loading 
  } = useRestaurantStore();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [tableNumber, setTableNumber] = useState('1');
  const [showSplash, setShowSplash] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Splash screen göster
  useEffect(() => {
    try {
      const hasVisited = typeof window !== 'undefined' && sessionStorage.getItem('menuVisited');
      if (!hasVisited) {
        setShowSplash(true);
        sessionStorage.setItem('menuVisited', '1');
        setTimeout(() => setShowSplash(false), 1600);
      }
    } catch {}
  }, []);

  // Subdomain'den restaurant bul ve menüyü yükle
  useEffect(() => {
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
    const targetRestaurant = subdomain || restaurantParam;

    if (targetRestaurant) {
      const foundRestaurant = restaurants.find(r => 
        r.username === targetRestaurant || 
        r.name.toLowerCase().replace(/\s+/g, '-') === targetRestaurant ||
        r.name.toLowerCase().includes(targetRestaurant)
      );

      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        const restaurantCategories = allCategories.filter(c => c.restaurantId === foundRestaurant.id);
        const restaurantItems = allMenuItems.filter(i => i.restaurantId === foundRestaurant.id);
        
        setCategories(restaurantCategories);
        setMenuItems(restaurantItems);
      } else if (!loading) {
        fetchRestaurantByUsername(targetRestaurant).then((res) => {
          if (res) {
            setRestaurant(res);
            const restaurantCategories = allCategories.filter(c => c.restaurantId === res.id);
            const restaurantItems = allMenuItems.filter(i => i.restaurantId === res.id);
            setCategories(restaurantCategories);
            setMenuItems(restaurantItems);
          }
        });
      }
    }
  }, [restaurants, allCategories, allMenuItems, searchParams, fetchRestaurantByUsername, loading]);

  // Sepete ürün ekle
  const addToCart = (item: any) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    setToastMessage('Ürün sepete eklendi!');
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // Sepetten ürün çıkar
  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prev.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  // Toplam fiyat hesapla
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Popüler ürünleri al
  const popularItems = menuItems.filter(item => item.isPopular);

  // Filtrelenmiş ürünler
  let filteredItems = activeCategory === 'all' 
    ? menuItems
    : activeCategory === 'popular'
    ? popularItems
    : menuItems.filter(item => item.categoryId === activeCategory);

  if (searchTerm.trim() !== '') {
    filteredItems = filteredItems.filter(item => {
      const name = item.name || '';
      const description = item.description || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  if (!restaurant && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FaUtensils className="text-6xl text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restoran Bulunamadı</h1>
          <p className="text-gray-600 mb-4">
            Aradığınız restoran bulunamadı veya menü henüz hazırlanmamış.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white animate-fadeIn">
          <div className="text-center px-6 animate-scaleIn">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                {restaurant?.name?.charAt(0) || 'M'}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{restaurant?.name || 'Menü'}</h1>
            <div className="mt-4 mx-auto h-1 w-40 bg-gray-200 rounded overflow-hidden">
              <div className="h-full bg-blue-600 animate-progress" />
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

      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          {toastMessage}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">{restaurant?.name || 'Menü'}</h1>
                {tableNumber && (
                  <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Masa #{tableNumber}
                  </span>
                )}
              </div>
              
              {/* Sepet */}
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaShoppingCart className="mr-2" />
                Sepet
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Arama */}
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Menüde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Kategori Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Tümü
              </button>
              {popularItems.length > 0 && (
                <button
                  onClick={() => setActiveCategory('popular')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center ${
                    activeCategory === 'popular'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaFire className="mr-1" />
                  Popüler
                </button>
              )}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menü İçeriği */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h2>
                <p className="text-gray-600">Arama kriterlerinize uygun ürün bulunamadı.</p>
              </div>
            ) : (
              filteredItems.map((item: any) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg flex-1">{item.name}</h3>
                    {item.isPopular && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center ml-2">
                        <FaFire className="mr-1" />
                        Popüler
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  )}
                  {item.ingredients && (
                    <p className="text-gray-500 text-xs mb-2">🥗 {item.ingredients}</p>
                  )}
                  {item.allergens && item.allergens.length > 0 && (
                    <p className="text-red-500 text-xs mb-2">⚠️ {item.allergens.join(', ')}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₺{item.price}</span>
                      {item.calories && (
                        <span className="text-xs text-gray-500 ml-2">({item.calories} kcal)</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <FaPlus className="mr-1" />
                      Ekle
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sepet Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Sepetim</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Sepetiniz boş</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-gray-600">₺{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          <FaMinus />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Toplam:</span>
                  <span className="text-2xl font-bold text-blue-600">₺{getTotalPrice().toFixed(2)}</span>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <FaCheck className="mr-2" />
                  Siparişi Tamamla
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function CustomerMenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <CustomerMenuContent />
    </Suspense>
  );
}

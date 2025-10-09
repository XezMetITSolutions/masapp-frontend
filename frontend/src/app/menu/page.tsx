'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useRestaurantStore from '@/store/useRestaurantStore';
import { 
  FaShoppingCart, 
  FaBell, 
  FaSearch,
  FaUtensils,
  FaFire,
  FaTag,
  FaLanguage,
  FaPlus,
  FaMinus,
  FaCheck
} from 'react-icons/fa';

function CustomerMenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    restaurants, 
    categories: allCategories, 
    menuItems: allMenuItems,
    fetchRestaurants,
    fetchRestaurantByUsername,
    loading 
  } = useRestaurantStore();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  
  // İlk yüklemede tüm restoranları çek
  useEffect(() => {
    if (restaurants.length === 0) {
      console.log('📡 Restoranlar yükleniyor...');
      fetchRestaurants();
    }
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
      console.log('🔍 Aranan restoran:', targetRestaurant);
      
      // Store'dan restaurant bul
      const foundRestaurant = restaurants.find(r => 
        r.username === targetRestaurant || 
        r.name.toLowerCase().replace(/\s+/g, '-') === targetRestaurant ||
        r.name.toLowerCase().includes(targetRestaurant)
      );

      if (foundRestaurant) {
        console.log('✅ Restoran bulundu:', foundRestaurant);
        setRestaurant(foundRestaurant);
        
        // Bu restorana ait kategorileri ve ürünleri filtrele
        const restaurantCategories = allCategories.filter(c => c.restaurantId === foundRestaurant.id);
        const restaurantItems = allMenuItems.filter(i => i.restaurantId === foundRestaurant.id);
        
        console.log('📦 Kategoriler:', restaurantCategories.length);
        console.log('🍽️ Ürünler:', restaurantItems.length);
        
        setCategories(restaurantCategories);
        setMenuItems(restaurantItems);
      } else {
        console.log('⚠️ Store\'da bulunamadı, backend\'den çekiliyor...');
        // Backend'den çekmeyi dene
        fetchRestaurantByUsername(targetRestaurant);
      }
    }
  }, [restaurants, allCategories, allMenuItems, searchParams, fetchRestaurantByUsername]);
  
  // Store'dan gelen veriyi dinle ve güncelle
  useEffect(() => {
    if (allCategories.length > 0 || allMenuItems.length > 0) {
      const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : null;
      const targetRestaurant = subdomain || searchParams.get('restaurant');
      
      if (targetRestaurant && restaurant) {
        const restaurantCategories = allCategories.filter(c => c.restaurantId === restaurant.id);
        const restaurantItems = allMenuItems.filter(i => i.restaurantId === restaurant.id);
        
        setCategories(restaurantCategories);
        setMenuItems(restaurantItems);
      }
    }
  }, [allCategories, allMenuItems, restaurant, searchParams]);

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

  // Filtrelenmiş ürünler
  const filteredItems = menuItems.filter(item => {
    const name = item.name?.[selectedLanguage] || item.name?.tr || item.name?.en || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Kategoriye göre grupla
  const groupedItems = categories.reduce((acc, category) => {
    acc[category.id] = {
      ...category,
      items: filteredItems.filter(item => item.categoryId === category.id)
    };
    return acc;
  }, {} as any);

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

  if (!restaurant) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
              {tableNumber && (
                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Masa #{tableNumber}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dil Seçici */}
              <div className="flex items-center space-x-2">
                <FaLanguage className="text-gray-500" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="tr">TR</option>
                  <option value="en">EN</option>
                </select>
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
              </div>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Arama */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
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

        {/* Menü İçeriği */}
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Henüz menü eklenmemiş</h2>
            <p className="text-gray-600">
              Restoran sahibi henüz menü ürünlerini eklememiş. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(groupedItems).map((category: any) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category.name?.[selectedLanguage] || category.name?.tr || category.name?.en || category.name}
                  </h2>
                  {category.description && (
                    <p className="text-gray-600 mt-2">
                      {category.description?.[selectedLanguage] || category.description?.tr || category.description?.en || category.description}
                    </p>
                  )}
        </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((item: any) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {item.name?.[selectedLanguage] || item.name?.tr || item.name?.en || item.name}
                            </h3>
                            {item.description && (
                              <p className="text-gray-600 text-sm mt-1">
                                {item.description?.[selectedLanguage] || item.description?.tr || item.description?.en || item.description}
                              </p>
                            )}
                    </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {item.isPopular && (
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <FaFire className="mr-1" />
                                Popüler
                              </span>
                            )}
                            {item.isNew && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <FaTag className="mr-1" />
                                Yeni
                              </span>
                            )}
                    </div>
                  </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">
                            ₺{item.price}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <FaPlus className="mr-1" />
                            Ekle
                          </button>
                </div>
              </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                  ✕
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
                        <h3 className="font-medium text-gray-900">
                          {item.name?.[selectedLanguage] || item.name?.tr || item.name?.en || item.name}
                        </h3>
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
    </div>
  );
}

export default function CustomerMenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Menü yükleniyor...</p>
        </div>
      </div>
    }>
      <CustomerMenuContent />
    </Suspense>
  );
}
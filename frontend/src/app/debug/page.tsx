'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';

export default function DebugPage() {
  const [hostname, setHostname] = useState('');
  const [subdomain, setSubdomain] = useState('');
  
  // Auth store
  const { authenticatedRestaurant, authenticatedStaff } = useAuthStore();
  
  // Restaurant store
  const { 
    restaurants, 
    categories: allCategories, 
    menuItems: allMenuItems,
    currentRestaurant,
    setRestaurants,
    setCategories,
    setMenuItems
  } = useRestaurantStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname);
      setSubdomain(window.location.hostname.split('.')[0]);
    }
  }, []);

  // Subdomain'e göre restaurant bul
  const findRestaurantBySubdomain = (slug: string) => {
    return restaurants.find(r => 
      r.username === slug || 
      r.id === slug ||
      r.name.toLowerCase() === slug.toLowerCase() ||
      r.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
    );
  };

  const activeRestaurant = findRestaurantBySubdomain(subdomain);

  // Restaurant ID'ye göre filtrele
  const getFilteredData = (restaurantId: string | undefined) => {
    if (!restaurantId) return { categories: [], items: [] };
    
    return {
      categories: allCategories.filter(c => c.restaurantId === restaurantId),
      items: allMenuItems.filter(i => i.restaurantId === restaurantId)
    };
  };

  const filteredData = getFilteredData(activeRestaurant?.id);

  // Demo data yükleme fonksiyonu
  const loadDemoData = () => {
    const demoRestaurants = [
      {
        id: 'lezzet-restaurant-id',
        name: 'Lezzet Restaurant',
        username: 'lezzet',
        email: 'info@lezzetrestaurant.com',
        phone: '+90 555 123 4567',
        address: 'İstanbul, Türkiye',
        primaryColor: '#8B4513',
        secondaryColor: '#D2691E',
        isActive: true,
        subscription: { plan: 'premium', expiresAt: '2024-12-31' },
        createdAt: new Date().toISOString()
      },
      {
        id: 'kardesler-restaurant-id',
        name: 'Kardeşler Lokantası',
        username: 'kardesler',
        email: 'iletisim@kardeslerlokantasi.com',
        phone: '+90 555 987 6543',
        address: 'Ankara, Türkiye',
        primaryColor: '#2E8B57',
        secondaryColor: '#90EE90',
        isActive: true,
        subscription: { plan: 'premium', expiresAt: '2024-12-31' },
        createdAt: new Date().toISOString()
      }
    ];

    const demoCategories = [
      {
        id: 'cat-lezzet-ana',
        restaurantId: 'lezzet-restaurant-id',
        name: { tr: 'Ana Yemekler', en: 'Main Dishes' },
        description: { tr: 'Lezzetli ana yemekler', en: 'Delicious main dishes' },
        displayOrder: 1,
        isActive: true
      },
      {
        id: 'cat-kardesler-ana',
        restaurantId: 'kardesler-restaurant-id',
        name: { tr: 'Ana Yemekler', en: 'Main Dishes' },
        description: { tr: 'Kardeşler ana yemekleri', en: 'Kardesler main dishes' },
        displayOrder: 1,
        isActive: true
      },
      {
        id: 'cat-kardesler-icecek',
        restaurantId: 'kardesler-restaurant-id',
        name: { tr: 'İçecekler', en: 'Beverages' },
        description: { tr: 'Soğuk ve sıcak içecekler', en: 'Cold and hot beverages' },
        displayOrder: 2,
        isActive: true
      }
    ];

    const demoMenuItems = [
      // Lezzet Restaurant items
      {
        id: 'item-lezzet-1',
        restaurantId: 'lezzet-restaurant-id',
        categoryId: 'cat-lezzet-ana',
        name: { tr: 'Lezzet Kebap', en: 'Lezzet Kebab' },
        description: { tr: 'Özel baharatlarla marine edilmiş', en: 'Marinated with special spices' },
        price: 75,
        image: '/placeholder-food.jpg',
        isActive: true,
        isPopular: true,
        allergens: [],
        nutritionalInfo: {},
        preparationTime: 15,
        displayOrder: 1
      },
      // Kardeşler Lokantası items (20 items)
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `item-kardesler-${i + 1}`,
        restaurantId: 'kardesler-restaurant-id',
        categoryId: i < 15 ? 'cat-kardesler-ana' : 'cat-kardesler-icecek',
        name: { 
          tr: i < 15 ? `Kardeşler Yemeği ${i + 1}` : `İçecek ${i - 14}`, 
          en: i < 15 ? `Kardesler Dish ${i + 1}` : `Beverage ${i - 14}` 
        },
        description: { 
          tr: i < 15 ? `Özel ${i + 1}. yemek` : `Soğuk içecek ${i - 14}`, 
          en: i < 15 ? `Special dish ${i + 1}` : `Cold beverage ${i - 14}` 
        },
        price: i < 15 ? 25 + (i * 5) : 10 + (i * 2),
        image: '/placeholder-food.jpg',
        isActive: true,
        isPopular: i < 3,
        allergens: [],
        nutritionalInfo: {},
        preparationTime: i < 15 ? 10 + i : 2,
        displayOrder: i + 1
      }))
    ];

    // Store'a yükle (TypeScript hatalarını ignore et)
    setRestaurants(demoRestaurants as any);
    setCategories(demoCategories as any);
    setMenuItems(demoMenuItems as any);

    alert(`Demo data yüklendi!\n- ${demoRestaurants.length} restaurant\n- ${demoCategories.length} kategori\n- ${demoMenuItems.length} menü item`);
  };

  // Tüm verileri temizleme fonksiyonu
  const clearAllData = () => {
    if (confirm('TÜM VERİLER SİLİNECEK! Emin misiniz?')) {
      setRestaurants([]);
      setCategories([]);
      setMenuItems([]);
      alert('Tüm veriler temizlendi!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔍 Restaurant Store Debug</h1>
          <div className="flex gap-3">
            <button
              onClick={clearAllData}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
            >
              🗑️ Tüm Verileri Sil
            </button>
            <button
              onClick={loadDemoData}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              📊 Demo Data Yükle
            </button>
          </div>
        </div>
        
        {/* URL Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📍 URL Bilgileri</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-600">Hostname:</span>
              <span className="ml-2 text-blue-600">{hostname}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Subdomain:</span>
              <span className="ml-2 text-green-600">{subdomain}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Full URL:</span>
              <span className="ml-2 text-purple-600">{typeof window !== 'undefined' ? window.location.href : 'Loading...'}</span>
            </div>
          </div>
        </div>

        {/* Auth Store */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔐 Auth Store</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-600">Authenticated Restaurant:</span>
              <span className="ml-2 text-blue-600">{authenticatedRestaurant?.name || 'None'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Restaurant ID:</span>
              <span className="ml-2 text-green-600">{authenticatedRestaurant?.id || 'None'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Authenticated Staff:</span>
              <span className="ml-2 text-purple-600">{authenticatedStaff?.name || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Restaurant Store Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🏪 Restaurant Store Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{restaurants.length}</div>
              <div className="text-sm text-gray-600">Total Restaurants</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{allCategories.length}</div>
              <div className="text-sm text-gray-600">Total Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{allMenuItems.length}</div>
              <div className="text-sm text-gray-600">Total Menu Items</div>
            </div>
          </div>
        </div>

        {/* All Restaurants */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🏢 All Restaurants</h2>
          {restaurants.length === 0 ? (
            <div className="text-red-600 font-medium">⚠️ No restaurants found in store!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Categories</th>
                    <th className="px-4 py-2 text-left">Menu Items</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((restaurant, index) => {
                    const restaurantCategories = allCategories.filter(c => c.restaurantId === restaurant.id);
                    const restaurantItems = allMenuItems.filter(i => i.restaurantId === restaurant.id);
                    
                    return (
                      <tr key={restaurant.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 font-medium">{restaurant.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{restaurant.id}</td>
                        <td className="px-4 py-2 text-sm text-blue-600">{restaurant.username || 'N/A'}</td>
                        <td className="px-4 py-2 text-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {restaurantCategories.length}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {restaurantItems.length}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Active Restaurant (Subdomain Match) */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🎯 Active Restaurant (Subdomain: {subdomain})</h2>
          {activeRestaurant ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800">✅ Restaurant Found!</div>
                <div className="mt-2 space-y-1">
                  <div><span className="font-medium">Name:</span> {activeRestaurant.name}</div>
                  <div><span className="font-medium">ID:</span> {activeRestaurant.id}</div>
                  <div><span className="font-medium">Username:</span> {activeRestaurant.username || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-blue-600">{filteredData.categories.length}</div>
                  <div className="text-sm text-gray-600">Categories for this restaurant</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-purple-600">{filteredData.items.length}</div>
                  <div className="text-sm text-gray-600">Menu items for this restaurant</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="font-medium text-red-800">❌ No restaurant found for subdomain: {subdomain}</div>
              <div className="mt-2 text-sm text-red-600">
                This means the subdomain doesn't match any restaurant's username, id, or name in the store.
              </div>
            </div>
          )}
        </div>

        {/* Menu Items Details */}
        {filteredData.items.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🍽️ Menu Items for {activeRestaurant?.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.items.slice(0, 9).map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="font-medium text-gray-800">{item.name.tr || item.name.en}</div>
                  <div className="text-sm text-gray-600">₺{item.price}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {item.restaurantId}</div>
                </div>
              ))}
            </div>
            {filteredData.items.length > 9 && (
              <div className="mt-4 text-center text-gray-600">
                ... and {filteredData.items.length - 9} more items
              </div>
            )}
          </div>
        )}

        {/* Raw Data */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Raw Data (JSON)</h2>
          <div className="space-y-4">
            <details className="border rounded-lg">
              <summary className="p-3 bg-gray-50 cursor-pointer font-medium">All Restaurants JSON</summary>
              <pre className="p-3 text-xs bg-gray-100 overflow-auto max-h-64">
                {JSON.stringify(restaurants, null, 2)}
              </pre>
            </details>
            
            <details className="border rounded-lg">
              <summary className="p-3 bg-gray-50 cursor-pointer font-medium">All Menu Items JSON</summary>
              <pre className="p-3 text-xs bg-gray-100 overflow-auto max-h-64">
                {JSON.stringify(allMenuItems, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

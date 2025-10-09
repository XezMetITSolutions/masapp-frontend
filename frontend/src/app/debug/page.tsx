'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';
import { apiService } from '@/services/api';

export default function DebugPage() {
  const [hostname, setHostname] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  // Auth store
  const { authenticatedRestaurant, authenticatedStaff, initializeAuth } = useAuthStore();
  
  // Restaurant store
  const { 
    restaurants, 
    categories: allCategories, 
    menuItems: allMenuItems,
    currentRestaurant,
    setRestaurants,
    addRestaurant,
    setCategories,
    addCategory,
    setMenuItems,
    addMenuItem,
    fetchRestaurantByUsername,
    fetchRestaurantMenu,
    loading,
    error
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

  // Test fonksiyonları
  const addTestResult = (name: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setTestResults(prev => [...prev, { name, status, message, data, timestamp: new Date().toISOString() }]);
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    try {
      // Test 1: Auth initialization
      addTestResult('Auth Init', 'info', 'Initializing auth...', null);
      initializeAuth();
      await new Promise(resolve => setTimeout(resolve, 500));
      addTestResult('Auth Init', authenticatedRestaurant ? 'success' : 'info', 
        authenticatedRestaurant ? `Authenticated as: ${authenticatedRestaurant.name}` : 'No authenticated restaurant',
        { authenticatedRestaurant, authenticatedStaff });

      // Test 2: Subdomain detection
      addTestResult('Subdomain', 'info', `Detected subdomain: ${subdomain}`, { hostname, subdomain });

      // Test 3: Fetch restaurant by username (aksaray)
      addTestResult('API: fetchRestaurantByUsername', 'info', 'Fetching restaurant by username: aksaray...', null);
      try {
        const restaurant = await fetchRestaurantByUsername('aksaray');
        if (restaurant) {
          addTestResult('API: fetchRestaurantByUsername', 'success', 
            `Restaurant found: ${restaurant.name} (ID: ${restaurant.id})`, restaurant);
        } else {
          addTestResult('API: fetchRestaurantByUsername', 'error', 'Restaurant not found', null);
        }
      } catch (err: any) {
        addTestResult('API: fetchRestaurantByUsername', 'error', `Error: ${err.message}`, err);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test 4: Check currentRestaurant in store
      addTestResult('Store: currentRestaurant', currentRestaurant ? 'success' : 'error',
        currentRestaurant ? `Current restaurant: ${currentRestaurant.name}` : 'No current restaurant in store',
        currentRestaurant);

      // Test 5: Fetch menu for current restaurant
      if (currentRestaurant?.id) {
        addTestResult('API: fetchRestaurantMenu', 'info', `Fetching menu for restaurant ID: ${currentRestaurant.id}...`, null);
        try {
          const menuData = await fetchRestaurantMenu(currentRestaurant.id);
          addTestResult('API: fetchRestaurantMenu', 'success', 
            `Menu fetched: ${allCategories.length} categories, ${allMenuItems.length} items`, 
            { categories: allCategories.length, items: allMenuItems.length, menuData });
        } catch (err: any) {
          addTestResult('API: fetchRestaurantMenu', 'error', `Error: ${err.message}`, err);
        }
      } else {
        addTestResult('API: fetchRestaurantMenu', 'error', 'Cannot fetch menu: No restaurant ID', null);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test 6: Direct API call to backend
      addTestResult('Direct API: getRestaurantByUsername', 'info', 'Making direct API call...', null);
      try {
        const response = await apiService.getRestaurantByUsername('aksaray');
        addTestResult('Direct API: getRestaurantByUsername', response.success ? 'success' : 'error',
          response.success ? 'API call successful' : 'API call failed',
          response);
      } catch (err: any) {
        addTestResult('Direct API: getRestaurantByUsername', 'error', `API Error: ${err.message}`, err);
      }

      // Test 7: Check menu items in store
      addTestResult('Store: Menu Items', allMenuItems.length > 0 ? 'success' : 'error',
        `${allMenuItems.length} menu items in store`,
        { count: allMenuItems.length, items: allMenuItems.slice(0, 3) });

      // Test 8: Check categories in store
      addTestResult('Store: Categories', allCategories.length > 0 ? 'success' : 'error',
        `${allCategories.length} categories in store`,
        { count: allCategories.length, categories: allCategories });

    } catch (err: any) {
      addTestResult('Test Suite', 'error', `Test suite error: ${err.message}`, err);
    } finally {
      setIsRunningTests(false);
    }
  };

  const testDirectMenuFetch = async () => {
    if (!currentRestaurant?.id) {
      alert('No current restaurant! Run "All Tests" first.');
      return;
    }
    
    addTestResult('Manual Menu Fetch', 'info', `Fetching menu for ${currentRestaurant.name}...`, null);
    try {
      await fetchRestaurantMenu(currentRestaurant.id);
      addTestResult('Manual Menu Fetch', 'success', 
        `Menu loaded: ${allCategories.length} categories, ${allMenuItems.length} items`,
        { categories: allCategories, items: allMenuItems });
    } catch (err: any) {
      addTestResult('Manual Menu Fetch', 'error', err.message, err);
    }
  };

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

  // Lezzet ve Kardeşler restaurant'larını oluştur
  const createLezzetAndKardesler = () => {
    // Mevcut restoranları kontrol et
    const existingLezzet = restaurants.find(r => r.username === 'lezzet');
    const existingKardesler = restaurants.find(r => r.username === 'kardesler');
    
    if (existingLezzet && existingKardesler) {
      alert('⚠️ Lezzet ve Kardeşler restoranları zaten mevcut!');
      return;
    }
    
    const timestamp = Date.now();
    
    const lezzetRestaurant = {
      id: `rest_${timestamp}`,
      name: 'Lezzet Restaurant',
      username: 'lezzet',
      password: '123456',
      email: 'info@lezzet.com',
      phone: '+90 555 987 6543',
      address: 'İstanbul, Türkiye',
      primaryColor: '#8B4513',
      secondaryColor: '#D2691E',
      isActive: true,
      ownerId: `owner_${timestamp}`,
      tableCount: 20,
      qrCodes: [],
      settings: {
        language: ['tr'],
        currency: 'TRY',
        taxRate: 18,
        serviceChargeRate: 0,
        allowTips: true,
        allowOnlinePayment: true,
        autoAcceptOrders: false,
        workingHours: [
          { day: 'Pazartesi', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Salı', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Çarşamba', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Perşembe', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Cuma', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Cumartesi', open: '09:00', close: '23:00', isOpen: true },
          { day: 'Pazar', open: '09:00', close: '23:00', isOpen: true }
        ]
      },
      subscription: {
        plan: 'premium',
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'active'
      },
      createdAt: new Date(),
      status: 'active'
    };

    const kardeslerRestaurant = {
      id: `rest_${timestamp + 1}`,
      name: 'Kardeşler Lokantası',
      username: 'kardesler',
      password: '123456',
      email: 'info@kardesler.com',
      phone: '+90 555 123 4567',
      address: 'Ankara, Türkiye',
      primaryColor: '#2E8B57',
      secondaryColor: '#90EE90',
      isActive: true,
      ownerId: `owner_${timestamp + 1}`,
      tableCount: 15,
      qrCodes: [],
      settings: {
        language: ['tr'],
        currency: 'TRY',
        taxRate: 18,
        serviceChargeRate: 0,
        allowTips: true,
        allowOnlinePayment: true,
        autoAcceptOrders: false,
        workingHours: [
          { day: 'Pazartesi', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Salı', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Çarşamba', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Perşembe', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Cuma', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Cumartesi', open: '09:00', close: '23:00', isOpen: true },
          { day: 'Pazar', open: '09:00', close: '23:00', isOpen: true }
        ]
      },
      subscription: {
        plan: 'premium',
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'active'
      },
      createdAt: new Date(),
      status: 'active'
    };

    // Kardeşler için demo kategoriler
    const kardeslerCategories = [
      {
        id: `cat_${timestamp}_1`,
        restaurantId: kardeslerRestaurant.id,
        name: { tr: 'Ana Yemekler', en: 'Main Dishes' },
        description: { tr: 'Kardeşler ana yemekleri', en: 'Kardesler main dishes' },
        displayOrder: 1,
        order: 1,
        isActive: true
      },
      {
        id: `cat_${timestamp}_2`,
        restaurantId: kardeslerRestaurant.id,
        name: { tr: 'İçecekler', en: 'Beverages' },
        description: { tr: 'Soğuk ve sıcak içecekler', en: 'Cold and hot beverages' },
        displayOrder: 2,
        order: 2,
        isActive: true
      }
    ];

    // Kardeşler için 20 demo ürün
    const kardeslerItems = [
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `item_${timestamp}_${i + 1}`,
        restaurantId: kardeslerRestaurant.id,
        categoryId: kardeslerCategories[0].id,
        name: { tr: `Kardeşler Yemeği ${i + 1}`, en: `Kardesler Dish ${i + 1}` },
        description: { tr: `Özel ${i + 1}. yemek`, en: `Special dish ${i + 1}` },
        price: 25 + (i * 5),
        image: '/placeholder-food.jpg',
        isActive: true,
        isAvailable: true,
        isPopular: i < 3,
        allergens: { tr: [], en: [] },
        nutritionalInfo: {},
        preparationTime: 10 + i,
        displayOrder: i + 1,
        order: i + 1
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `item_${timestamp}_${i + 16}`,
        restaurantId: kardeslerRestaurant.id,
        categoryId: kardeslerCategories[1].id,
        name: { tr: `İçecek ${i + 1}`, en: `Beverage ${i + 1}` },
        description: { tr: `Soğuk içecek ${i + 1}`, en: `Cold beverage ${i + 1}` },
        price: 10 + (i * 2),
        image: '/placeholder-food.jpg',
        isActive: true,
        isAvailable: true,
        isPopular: false,
        allergens: { tr: [], en: [] },
        nutritionalInfo: {},
        preparationTime: 2,
        displayOrder: i + 16,
        order: i + 16
      }))
    ];

    // Lezzet için 1 kategori
    const lezzetCategories = [
      {
        id: `cat_${timestamp}_3`,
        restaurantId: lezzetRestaurant.id,
        name: { tr: 'Ana Yemekler', en: 'Main Dishes' },
        description: { tr: 'Lezzet ana yemekleri', en: 'Lezzet main dishes' },
        displayOrder: 1,
        order: 1,
        isActive: true
      }
    ];

    // Lezzet için 1 demo ürün
    const lezzetItems = [
      {
        id: `item_${timestamp}_21`,
        restaurantId: lezzetRestaurant.id,
        categoryId: lezzetCategories[0].id,
        name: { tr: 'Lezzet Kebap', en: 'Lezzet Kebab' },
        description: { tr: 'Özel baharatlarla marine edilmiş', en: 'Marinated with special spices' },
        price: 75,
        image: '/placeholder-food.jpg',
        isActive: true,
        isAvailable: true,
        isPopular: true,
        allergens: { tr: [], en: [] },
        nutritionalInfo: {},
        preparationTime: 15,
        displayOrder: 1,
        order: 1
      }
    ];

    // Store'a ekle - Mevcut verileri koruyarak ekle
    if (!existingLezzet) {
      addRestaurant(lezzetRestaurant as any);
      lezzetCategories.forEach(cat => addCategory(cat as any));
      lezzetItems.forEach(item => addMenuItem(item as any));
    }
    
    if (!existingKardesler) {
      addRestaurant(kardeslerRestaurant as any);
      kardeslerCategories.forEach(cat => addCategory(cat as any));
      kardeslerItems.forEach(item => addMenuItem(item as any));
    }

    const message = `✅ Başarıyla oluşturuldu!

${!existingLezzet ? '🏢 Lezzet Restaurant:\n- Username: lezzet\n- Password: 123456\n- 1 kategori, 1 ürün\n' : ''}
${!existingKardesler ? '🏢 Kardeşler Lokantası:\n- Username: kardesler\n- Password: 123456\n- 2 kategori, 20 ürün\n' : ''}

⚠️ ÖNEMLİ: Admin panelinde görmek için aynı domainden erişin!
📍 Şu URL'den deneyin: ${window.location.origin.replace(/^https?:\/\/[^.]+\./, 'https://')}/admin/restaurants`;

    alert(message);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔍 Backend API Debug & Test</h1>
          <div className="flex gap-3">
            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTests ? '⏳ Testing...' : '🧪 Run All Tests'}
            </button>
            <button
              onClick={testDirectMenuFetch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              📥 Fetch Menu
            </button>
            <button
              onClick={() => setTestResults([])}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
            >
              🗑️ Clear Results
            </button>
          </div>
        </div>

        {/* Store Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Current Store Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{loading ? '⏳' : '✓'}</div>
              <div className="text-sm text-gray-600">Loading: {loading ? 'Yes' : 'No'}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{error ? '❌' : '✓'}</div>
              <div className="text-sm text-gray-600">Error: {error || 'None'}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{allCategories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{allMenuItems.length}</div>
              <div className="text-sm text-gray-600">Menu Items</div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🧪 Test Results</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className={`border-l-4 p-4 rounded ${
                  result.status === 'success' ? 'bg-green-50 border-green-500' :
                  result.status === 'error' ? 'bg-red-50 border-red-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : 'ℹ️'} {result.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{result.message}</div>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View data
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 ml-4">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-Domain LocalStorage Info */}
        <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">✅ Cross-Domain localStorage Aktif!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p className="mb-2">Tüm subdomain'ler artık <strong>aynı localStorage'ı paylaşıyor</strong>!</p>
                <p className="mb-2">
                  <strong>Şu anki domain:</strong> <code className="bg-green-100 px-2 py-1 rounded">{hostname}</code>
                </p>
                <p className="mb-2">
                  <strong>Storage Bridge:</strong> <code className="bg-green-100 px-2 py-1 rounded">guzellestir.com/storage-bridge.html</code>
                </p>
                <p className="font-medium">
                  🎉 Herhangi bir subdomain'den oluşturduğunuz restoran, tüm subdomain'lerde ve admin panelinde görünecek!
                </p>
              </div>
            </div>
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
              {filteredData.items.slice(0, 9).map((item) => {
                const itemName = typeof item.name === 'string' ? item.name : (item.name as any)?.tr || (item.name as any)?.en || 'N/A';
                return (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="font-medium text-gray-800">{itemName}</div>
                    <div className="text-sm text-gray-600">₺{item.price}</div>
                    <div className="text-xs text-gray-500 mt-1">ID: {item.restaurantId}</div>
                  </div>
                );
              })}
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

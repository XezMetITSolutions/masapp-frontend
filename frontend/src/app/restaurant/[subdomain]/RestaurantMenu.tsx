'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import useRestaurantStore from '@/store/useRestaurantStore';
import { 
  FaUtensils, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  ingredients?: string[];
  allergens?: string[];
  preparationTime?: number;
  rating?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  rating: number;
  cuisine: string;
  image?: string;
  logo?: string;
  categories: string[];
  menuItems: MenuItem[];
}

export default function RestaurantMenu() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const { restaurants } = useRestaurantStore();

  // Zustand store'dan restoran verilerini al ve dinamik menü oluştur
  const restaurant = useMemo(() => {
    let storeRestaurant = restaurants.find(r => r.slug === subdomain);
    
    // Eğer store'da restoran bulunamazsa, temel bir restoran oluştur
    if (!storeRestaurant) {
      // Temel fallback restoran
      storeRestaurant = {
        id: subdomain,
        name: subdomain.charAt(0).toUpperCase() + subdomain.slice(1).replace(/-/g, ' '),
        slug: subdomain,
        address: 'İstanbul, Türkiye',
        phone: '+90 212 555 0000',
        email: `info@${subdomain}.com`,
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        ownerId: 'temp',
        tableCount: 10,
        qrCodes: [],
        settings: {
          language: ['tr'],
          currency: 'TRY',
          taxRate: 18,
          serviceChargeRate: 0,
          allowTips: true,
          allowOnlinePayment: true,
          autoAcceptOrders: false,
          workingHours: []
        },
        subscription: {
          plan: 'basic' as const,
          startDate: new Date(),
          endDate: new Date(),
          status: 'active' as const
        },
        createdAt: new Date(),
        status: 'active' as const
      };
    }

    // Temel kategoriler
    const defaultCategories = ['Ana Yemekler', 'Çorbalar', 'Salatalar', 'Tatlılar', 'İçecekler'];
    
    // Temel menü öğeleri (her restoran için)
    const defaultMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Günün Menüsü',
        description: 'Şefimizin özel hazırladığı günlük menü',
        price: 65,
        category: 'Ana Yemekler',
        isAvailable: true,
        preparationTime: 15,
        rating: 4.5,
        isVegetarian: false
      },
      {
        id: '2',
        name: 'Mercimek Çorbası',
        description: 'Geleneksel kırmızı mercimek çorbası',
        price: 25,
        category: 'Çorbalar',
        isAvailable: true,
        preparationTime: 10,
        rating: 4.6,
        isVegetarian: true,
        isVegan: true
      },
      {
        id: '3',
        name: 'Mevsim Salatası',
        description: 'Taze mevsim sebzeleri ile hazırlanan salata',
        price: 35,
        category: 'Salatalar',
        isAvailable: true,
        preparationTime: 5,
        rating: 4.4,
        isVegetarian: true,
        isVegan: true
      },
      {
        id: '4',
        name: 'Ev Yapımı Tatlı',
        description: 'Günlük taze hazırlanan özel tatlımız',
        price: 45,
        category: 'Tatlılar',
        isAvailable: true,
        preparationTime: 5,
        rating: 4.7,
        isVegetarian: true
      },
      {
        id: '5',
        name: 'Türk Çayı',
        description: 'Geleneksel demleme çay',
        price: 8,
        category: 'İçecekler',
        isAvailable: true,
        preparationTime: 2,
        rating: 4.5,
        isVegetarian: true,
        isVegan: true
      },
      {
        id: '6',
        name: 'Taze Sıkılmış Portakal Suyu',
        description: 'Günlük taze sıkılmış doğal portakal suyu',
        price: 18,
        category: 'İçecekler',
        isAvailable: true,
        preparationTime: 3,
        rating: 4.3,
        isVegetarian: true,
        isVegan: true
      }
    ];

    // Store'daki restoran verileriyle uyumlu format oluştur
    return {
      id: storeRestaurant.id,
      name: storeRestaurant.name,
      description: `${storeRestaurant.name} - Lezzetli yemekler ve kaliteli hizmet`,
      address: storeRestaurant.address,
      phone: storeRestaurant.phone,
      email: storeRestaurant.email,
      openingHours: '09:00 - 23:00', // Varsayılan çalışma saatleri
      rating: 4.5, // Varsayılan rating
      cuisine: 'Türk Mutfağı', // Varsayılan mutfak türü
      categories: defaultCategories,
      menuItems: defaultMenuItems
    };
  }, [restaurants, subdomain]);

  useEffect(() => {
    setCurrentRestaurant(restaurant);
    setLoading(false);
  }, [restaurant]);

  const filteredMenuItems = currentRestaurant?.menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  }) || [];

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = currentRestaurant?.menuItems.find(item => item.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restoran Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Bu subdomain için restoran bilgisi bulunamadı.</p>
          <a 
            href="https://guzellestir.com" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
              <FaUtensils className="text-3xl text-gray-400" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentRestaurant.name}</h1>
              <p className="text-gray-600 mb-4">{currentRestaurant.description}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  {currentRestaurant.rating}
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  {currentRestaurant.openingHours}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  {currentRestaurant.address}
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-1" />
                  {currentRestaurant.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories and Search */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Kategoriler</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tümü
                </button>
                {currentRestaurant.categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Ara</h4>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {selectedCategory === 'all' ? 'Menü' : selectedCategory}
              </h2>

              <div className="space-y-4">
                {filteredMenuItems.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          {item.isVegetarian && (
                            <span className="text-green-600 text-xs">🌱</span>
                          )}
                          {item.isVegan && (
                            <span className="text-green-600 text-xs">🌿</span>
                          )}
                          {item.isGlutenFree && (
                            <span className="text-blue-600 text-xs">GF</span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            {item.preparationTime} dk
                          </div>
                          {item.rating && (
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 mr-1" />
                              {item.rating}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ₺{item.price.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {cart[item.id] ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{cart[item.id]}</span>
                              <button
                                onClick={() => addToCart(item.id)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                            >
                              <FaShoppingCart className="mr-1" />
                              Ekle
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMenuItems.length === 0 && (
                <div className="text-center py-8">
                  <FaUtensils className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Ürün bulunamadı</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Seçilen kategoride ürün bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Sepet</h3>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  {getCartItemCount()}
                </span>
              </div>

              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-8">
                  <FaShoppingCart className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 text-sm mt-2">Sepetiniz boş</p>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {Object.entries(cart).map(([itemId, quantity]) => {
                    const item = currentRestaurant.menuItems.find(item => item.id === itemId);
                    if (!item) return null;
                    
                    return (
                      <div key={itemId} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-gray-500">₺{item.price.toFixed(2)} x {quantity}</div>
                        </div>
                        <div className="font-medium">
                          ₺{(item.price * quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {Object.keys(cart).length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-900">Toplam:</span>
                    <span className="font-semibold text-gray-900">₺{getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">
                    Siparişi Tamamla
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

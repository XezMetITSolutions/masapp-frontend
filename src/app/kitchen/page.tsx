'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaClock, 
  FaCheckCircle, 
  FaUtensils, 
  FaBell,
  FaSort,
  FaSearch,
  FaSignOutAlt,
  FaChartLine
} from 'react-icons/fa';
import useCentralOrderStore from '@/store/useCentralOrderStore';
import { useLanguage } from '@/context/LanguageContext';

export default function StandaloneKitchenPage() {
  const router = useRouter();
  const { currentLanguage, setLanguage } = useLanguage();
  const { 
    getKitchenOrders, 
    updateOrderStatus, 
    updateItemStatus, 
    initializeDemoData 
  } = useCentralOrderStore();

  const getLanguageCode = () => {
    switch (currentLanguage) {
      case 'English': return 'en';
      case 'German': return 'de';
      default: return 'tr';
    }
  };

  const languageCode = getLanguageCode();

  const translations = {
    en: {
      title: 'Kitchen Panel',
      subtitle: 'Order Management',
      all: 'All',
      active: 'Active',
      completed: 'Completed',
      time: 'Time',
      priority: 'Priority',
      table: 'Table',
      search: 'Search orders...',
      tableNumber: 'Table',
      orderTime: 'Order Time',
      items: 'Items',
      status: 'Status',
      actions: 'Actions',
      markReady: 'Mark Ready',
      markCompleted: 'Mark Completed',
      noOrders: 'No orders found',
      redirecting: 'Redirecting to kitchen panel...'
    },
    tr: {
      title: 'Mutfak Paneli',
      subtitle: 'Sipariş Yönetimi',
      all: 'Tümü',
      active: 'Aktif',
      completed: 'Tamamlanan',
      time: 'Süre',
      priority: 'Öncelik',
      table: 'Masa',
      search: 'Sipariş ara...',
      tableNumber: 'Masa',
      orderTime: 'Sipariş Zamanı',
      items: 'Ürünler',
      status: 'Durum',
      actions: 'İşlemler',
      markReady: 'Hazır İşaretle',
      markCompleted: 'Tamamlandı İşaretle',
      noOrders: 'Sipariş bulunamadı',
      redirecting: 'Mutfak paneline yönlendiriliyor...'
    },
    de: {
      title: 'Küchen-Panel',
      subtitle: 'Bestellungsverwaltung',
      all: 'Alle',
      active: 'Aktiv',
      completed: 'Abgeschlossen',
      time: 'Zeit',
      priority: 'Priorität',
      table: 'Tisch',
      search: 'Bestellungen suchen...',
      tableNumber: 'Tisch',
      orderTime: 'Bestellzeit',
      items: 'Artikel',
      status: 'Status',
      actions: 'Aktionen',
      markReady: 'Als bereit markieren',
      markCompleted: 'Als abgeschlossen markieren',
      noOrders: 'Keine Bestellungen gefunden',
      redirecting: 'Weiterleitung zum Küchen-Panel...'
    }
  };

  const t = translations[languageCode as 'en' | 'tr' | 'de'] || translations.tr;
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' = tüm siparişler, 'active' = aktif siparişler, 'served' = tamamlanan
  const [sortBy, setSortBy] = useState('time'); // time, priority, table
  const [searchTerm, setSearchTerm] = useState('');
  const [changeNotifs, setChangeNotifs] = useState<any[]>([]);
  const [dismissedNotifs, setDismissedNotifs] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);
  const [readyConfirmations, setReadyConfirmations] = useState<Set<string>>(new Set());
  const [itemReadyConfirmations, setItemReadyConfirmations] = useState<Set<string>>(new Set());
  const [itemCompletedConfirmations, setItemCompletedConfirmations] = useState<Set<string>>(new Set());

  // Sadece değişiklik bildirimlerini dinle
  useEffect(() => {
    const interval = setInterval(() => {
      const arr = JSON.parse(localStorage.getItem('kitchen_change_notifications') || '[]');
      const unread = arr.filter((n: any) => !n.read);
      if (unread.length > 0) {
        setChangeNotifs((prev) => [...unread.map((n: any) => ({ ...n, id: 'ls_' + n.timestamp })) , ...prev]);
        const updated = arr.map((n: any) => ({ ...n, read: true }));
        localStorage.setItem('kitchen_change_notifications', JSON.stringify(updated));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const dismissNotification = (tableNumber: number) => {
    setDismissedNotifs(prev => {
      const newSet = new Set(prev);
      newSet.add(tableNumber.toString());
      return newSet;
    });
  };

  const handleReadyWithConfirmation = (orderId: string) => {
    // Önce "Hazırlandı" bildirimi göster
    setReadyConfirmations(prev => {
      const newSet = new Set(prev);
      newSet.add(orderId);
      return newSet;
    });
    
    // 2 saniye sonra sipariş durumunu güncelle ve bildirimi kaldır
    setTimeout(() => {
      handleUpdateOrderStatus(orderId, 'ready');
      setReadyConfirmations(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 2000);
  };

  const handleItemReadyWithConfirmation = (orderId: string, itemIndex: number) => {
    const itemKey = `${orderId}-${itemIndex}`;
    
    // Önce "Hazırlandı" bildirimi göster
    setItemReadyConfirmations(prev => {
      const newSet = new Set(prev);
      newSet.add(itemKey);
      return newSet;
    });
    
    // 2 saniye sonra ürün durumunu güncelle ve bildirimi kaldır
    setTimeout(() => {
      handleUpdateItemStatus(orderId, itemIndex, 'ready');
      setItemReadyConfirmations(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }, 2000);
  };

  const handleItemCompletedWithConfirmation = (orderId: string, itemIndex: number) => {
    const itemKey = `${orderId}-${itemIndex}`;
    
    // Önce "Sipariş Tamamlandı" bildirimi göster
    setItemCompletedConfirmations(prev => {
      const newSet = new Set(prev);
      newSet.add(itemKey);
      return newSet;
    });
    
    // 2 saniye sonra ürün durumunu güncelle ve bildirimi kaldır
    setTimeout(() => {
      handleUpdateItemStatus(orderId, itemIndex, 'served');
      setItemCompletedConfirmations(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }, 2000);
  };

  // Sipariş seviyesinde toplu işlem fonksiyonları
  const handleOrderBulkPrepare = (orderId: string) => {
    const order = filteredOrders.find(o => o.id === orderId);
    if (order) {
      order.items.forEach((item: any, index: number) => {
        if (item && item.status === 'preparing') {
          handleItemReadyWithConfirmation(orderId, index);
        }
      });
    }
  };

  const handleOrderBulkReady = (orderId: string) => {
    const order = filteredOrders.find(o => o.id === orderId);
    if (order) {
      order.items.forEach((item: any, index: number) => {
        if (item && item.status === 'ready') {
          handleItemCompletedWithConfirmation(orderId, index);
        }
      });
    }
  };

  // Auth guard (localStorage tabanlı demo)
  // Mutfak sayfası artık doğrudan erişilebilir, giriş kontrolü yok

  // Client-side mount kontrolü
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Demo verilerini başlat (her zaman)
  useEffect(() => {
    // Önce mevcut verileri temizle
    localStorage.removeItem('central-orders');
    // Demo verileri yükle
    initializeDemoData();
  }, [initializeDemoData]);

  // Demo: mutfak için bir örnek "siparişte değişiklik" bildirimi tohumla
  useEffect(() => {
    try {
      // Önce mevcut bildirimleri temizle
      localStorage.removeItem('kitchen_change_notifications');
      const arr: any[] = [];
      const samples = [
        {
          tableNumber: 5,
          orderId: 'order-1',
          message: 'Siparişte değişiklik var',
          timestamp: Date.now() - 30 * 1000,
          read: false,
          __demoSample: true
        },
        {
          tableNumber: 3,
          orderId: 'order-5',
          message: 'Siparişte değişiklik var',
          timestamp: Date.now() - 60 * 1000,
          read: false,
          __demoSample: true
        },
        {
          tableNumber: 12,
          orderId: 'order-4',
          message: 'Siparişte değişiklik var',
          timestamp: Date.now() - 90 * 1000,
          read: false,
          __demoSample: true
        }
      ];
      const next = [...samples, ...arr].slice(0, 20);
        localStorage.setItem('kitchen_change_notifications', JSON.stringify(next));
      setChangeNotifs((prev) => [...samples.map(s => ({ ...s, id: 'demo_' + s.timestamp })), ...prev]);
    } catch {}
  }, []);


  // Tüm siparişleri al (served dahil)
  const allOrders = getKitchenOrders();
  
  // Filtreye göre siparişleri seç - 'active' durumunda tüm aktif siparişleri göster
  const orders = allOrders;
  
  
  console.log('🍳 Debug - Tüm siparişler:', allOrders.length, allOrders);
  console.log('🍳 Debug - Gösterilecek siparişler:', orders.length);
  console.log('🍳 Debug - Aktif filtre:', activeFilter);
  console.log('🍳 Debug - Sıralama:', sortBy);
  console.log('🍳 Debug - Arama terimi:', searchTerm);
  console.log('🍳 Debug - isClient:', isClient);
  
  // Calculate completed orders count for the button
  const completedOrdersCount = useMemo(() => {
    const allOrders = getKitchenOrders();
    // Apply the same filtering logic as in filteredOrders but without the activeFilter
    let filtered = allOrders.filter(order => {
      const hasFoodItems = order.items && order.items.some((item: any) => 
        item && item.category === 'food'
      );
      const searchMatch = searchTerm === '' || 
        order.tableNumber.toString().includes(searchTerm) ||
        (order.items && order.items.some((item: any) => 
          item && item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      return hasFoodItems && searchMatch;
    });

    // Aynı masadaki siparişleri benzersiz hale getir - en son siparişi al
    const uniqueTableOrders = filtered.reduce((acc, order) => {
      const tableNumber = order.tableNumber;
      if (!acc[tableNumber] || new Date(order.createdAt) > new Date(acc[tableNumber].createdAt)) {
        acc[tableNumber] = order;
      }
      return acc;
    }, {} as any);
    
    // Benzersiz siparişleri diziye çevir
    filtered = Object.values(uniqueTableOrders);

    const groupedOrders = filtered.map((order: any) => {
      const foodItems = (order.items || []).filter((item: any) => 
        item && item.category === 'food'
      );
      
      if (foodItems.length === 0) {
        return {
          ...order,
          items: [],
          status: 'served'
        };
      }
      
      const allItemsServed = foodItems.every((item: any) => item && item.status === 'served');
      const hasPreparingItems = foodItems.some((item: any) => item && item.status === 'preparing');
      const hasReadyItems = foodItems.some((item: any) => item && item.status === 'ready');
      
      let orderStatus = 'preparing';
      if (allItemsServed) {
        orderStatus = 'served';
      } else if (hasPreparingItems) {
        orderStatus = 'preparing';
      } else if (hasReadyItems) {
        orderStatus = 'ready';
      }
      
      return {
        ...order,
        items: foodItems,
        status: orderStatus
      };
    });

    return groupedOrders.filter(order => order.status === 'served').length;
  }, [searchTerm]);
  
  const filteredOrders = useMemo(() => {
    // Önce boş siparişleri ve yemek ürünü olmayan siparişleri filtrele
    let filtered = orders.filter(order => {
      // Sadece yemek ürünleri olan siparişleri göster - güvenli kontrol
      const hasFoodItems = order.items && order.items.some((item: any) => 
        item && item.category === 'food'
      );
      
      // Arama filtresi - güvenli kontrol
      const searchMatch = searchTerm === '' || 
        order.tableNumber.toString().includes(searchTerm) ||
        (order.items && order.items.some((item: any) => 
          item && item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      return hasFoodItems && searchMatch;
    });

    // Aynı masadaki siparişleri benzersiz hale getir - en son siparişi al
    const uniqueTableOrders = filtered.reduce((acc, order) => {
      const tableNumber = order.tableNumber;
      if (!acc[tableNumber] || new Date(order.createdAt) > new Date(acc[tableNumber].createdAt)) {
        acc[tableNumber] = order;
      }
      return acc;
    }, {} as any);

    // Benzersiz siparişleri diziye çevir
    filtered = Object.values(uniqueTableOrders);

    // Her masa için tek sipariş - direkt işle
    const groupedOrders = filtered.map((order: any) => {
      // Güvenli filtreleme - item undefined kontrolü
      const foodItems = (order.items || []).filter((item: any) => 
        item && item.category === 'food'
      );
      
      // Boş ürün listesi kontrolü
      if (foodItems.length === 0) {
        return {
          ...order,
          items: [],
          status: 'served', // Boş siparişleri tamamlanmış say
          orderTime: order.orderTime || new Date(order.createdAt).toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
      }
      
      // Tüm ürünlerin durumunu kontrol et
      const allItemsServed = foodItems.every((item: any) => item && item.status === 'served');
      const hasPreparingItems = foodItems.some((item: any) => item && item.status === 'preparing');
      const hasReadyItems = foodItems.some((item: any) => item && item.status === 'ready');
      
      // Sipariş durumunu belirle
      let orderStatus = 'preparing'; // Varsayılan durum
      if (allItemsServed) {
        orderStatus = 'served';
      } else if (hasPreparingItems) {
        orderStatus = 'preparing';
      } else if (hasReadyItems) {
        orderStatus = 'ready';
      }
      
      return {
        ...order,
        items: foodItems,
        status: orderStatus,
        orderTime: order.orderTime || new Date(order.createdAt).toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
    });

    // Filtre uygula
    let finalFilteredOrders = groupedOrders;
    console.log('🍳 Debug - Gruplandırılmış siparişler:', groupedOrders.length);
    console.log('🍳 Debug - Uygulanacak filtre:', activeFilter);
    
    if (activeFilter === 'served') {
      // Sadece tamamen tamamlanmış siparişleri göster
      finalFilteredOrders = groupedOrders.filter(order => order.status === 'served');
      console.log('🍳 Debug - Tamamlanan siparişler:', finalFilteredOrders.length);
    } else if (activeFilter === 'active') {
      // Sadece aktif siparişleri göster (hazırlanan ve hazır)
      finalFilteredOrders = groupedOrders.filter(order => order.status !== 'served');
      console.log('🍳 Debug - Aktif siparişler:', finalFilteredOrders.length);
    } else {
      console.log('🍳 Debug - Tüm siparişler gösteriliyor:', finalFilteredOrders.length);
    }
    // activeFilter === 'all' ise tüm siparişleri göster (zaten finalFilteredOrders = groupedOrders)

    // Sıralama mantığı
    finalFilteredOrders.sort((a, b) => {
      // Önce duruma göre sırala (preparing > ready > served)
      const statusOrder = { 'preparing': 1, 'ready': 2, 'served': 3 };
      const aStatusOrder = statusOrder[a.status as keyof typeof statusOrder] || 0;
      const bStatusOrder = statusOrder[b.status as keyof typeof statusOrder] || 0;
      
      if (aStatusOrder !== bStatusOrder) {
        return aStatusOrder - bStatusOrder;
      }
      
      // Aynı durumda olan siparişler için seçilen sıralama kuralını uygula
      switch (sortBy) {
        case 'table':
          return a.tableNumber - b.tableNumber;
        case 'priority':
          // Öncelik sıralaması: high > normal > low
          const priorityOrder = { 'high': 1, 'normal': 2, 'low': 3 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }
          // Aynı öncelikte ise zamana göre sırala
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'time':
        default:
          // Zamana göre sırala (en yeni üstte)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return finalFilteredOrders;
  }, [orders, activeFilter, searchTerm, sortBy]);

  const hasChangeForTable = (tableNumber: number) =>
    changeNotifs.some(n => n.tableNumber === tableNumber);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'text-orange-600 bg-orange-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'served': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Hazırlanıyor';
      case 'ready': return 'Hazır';
      case 'served': return 'Servis Edildi';
      default: return 'Bilinmiyor';
    }
  };


  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
  };

  const handleUpdateItemStatus = (orderId: string, itemIndex: number, newStatus: string) => {
    updateItemStatus(orderId, itemIndex, newStatus as any);
  };

  const getWaitTime = (createdAt: string) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    return diffMinutes;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div 
            className="flex items-center gap-2 sm:gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              setActiveFilter('all');
              setSearchTerm('');
            }}
            title="Mutfak paneli ana sayfasına dön"
          >
            {/* Logo - sadece tablet ve üzerinde göster */}
            <div className="hidden sm:block bg-white bg-opacity-20 p-3 rounded-lg">
              <FaUtensils className="text-2xl" />
            </div>
          <div>
              <h2 className="text-lg sm:text-2xl font-bold">{t.title}</h2>
              <p className="text-orange-100 text-xs sm:text-sm hidden sm:block">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Selector */}
            <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
              <button
                onClick={() => setLanguage('Turkish')}
                className={`px-2 py-1 rounded text-xs ${languageCode === 'tr' ? 'bg-white text-orange-600' : 'text-white'}`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('English')}
                className={`px-2 py-1 rounded text-xs ${languageCode === 'en' ? 'bg-white text-orange-600' : 'text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('German')}
                className={`px-2 py-1 rounded text-xs ${languageCode === 'de' ? 'bg-white text-orange-600' : 'text-white'}`}
              >
                DE
              </button>
            </div>
            <button
              onClick={() => { router.replace('/business/login'); }}
              className="px-2 sm:px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <FaSignOutAlt className="text-sm sm:text-base" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Kontrol Paneli */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Arama */}
            <div className="relative flex-1 min-w-0">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

        {/* Filtreler */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2 sm:px-4 py-2 rounded-md transition-colors whitespace-nowrap text-sm ${activeFilter === 'all' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              >
{t.all}
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-2 sm:px-4 py-2 rounded-md transition-colors whitespace-nowrap text-sm ${activeFilter === 'active' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              >
{t.active}
              </button>
            <button
              onClick={() => setActiveFilter('served')}
                className={`px-2 sm:px-4 py-2 rounded-md transition-colors whitespace-nowrap text-sm ${activeFilter === 'served' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
{t.completed} ({completedOrdersCount})
            </button>
            </div>

            {/* Sıralama */}
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-400 text-sm" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              >
                <option value="time">{t.time}</option>
                <option value="priority">{t.priority}</option>
                <option value="table">{t.table}</option>
              </select>
            </div>
          </div>
        </div>


        {/* Siparişler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredOrders.map((order) => {
            const waitTime = getWaitTime(order.createdAt);
            const isOverdue = waitTime > 20; // 20 dakika gecikme kontrolü
            
            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-lg shadow-sm border-2 p-4 sm:p-6 transition-all hover:shadow-md ${
                  isOverdue ? 'border-orange-300 bg-orange-50' :
                  'border-gray-200'
                }`}
              >
                {/* Sipariş Başlığı */}
              <div className="flex justify-between items-start mb-3 sm:mb-4 relative">
                <div>
                    <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Masa {order.tableNumber}</h3>
                      {/* Sipariş değişiklik bildirimi - Yanıp sönen "değişiklik" yazısı */}
                      {hasChangeForTable(order.tableNumber) && !dismissedNotifs.has(order.tableNumber.toString()) && (
                        <div className="relative">
                          <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
                            <FaBell className="text-xs" />
                            <span>DEĞİŞİKLİK</span>
                            <button
                              onClick={() => dismissNotification(order.tableNumber)}
                              className="ml-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              title="Bildirimi kaldır"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  <p className="text-xs sm:text-sm text-gray-500">Sipariş: {order.orderTime}</p>
                </div>
                  <div className="flex flex-col gap-2">
                  {/* Durum yazısı kaldırıldı */}
                </div>
              </div>

                {/* Bekleme Süresi - 20 dakika gecikme kontrolü */}
                <div className={`mb-4 p-2 rounded-lg text-center ${
                  waitTime > 20 ? 'bg-red-100 text-red-800' : 
                  waitTime > 15 ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    <FaClock />
                    <span className="font-medium">
                      {waitTime} dk
                    </span>
                    {waitTime > 20 && <span className="text-red-600 font-bold">GECİKME!</span>}
                  </div>
                </div>

                {/* Ürünler - Sadece yemek ürünleri */}
              <div className="space-y-3 mb-4">
                {order.items.filter((item: any) => 
                  item.category === 'food'
                ).map((item: any, index: number) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      item.status === 'ready' ? 'bg-green-50 border-green-200' :
                      item.status === 'served' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{item.name}</p>
                            <span className="text-sm text-gray-600">x{item.quantity}</span>
                            {/* Durum etiketi kaldırıldı */}
                          </div>
                      {item.notes && (
                        <p className="text-xs text-orange-600 mt-1">Not: {item.notes}</p>
                      )}
                          <p className="text-xs text-gray-500 mt-1">Tahmini: {item.prepTime} dk</p>
                        </div>
                        <div className="flex gap-1">
                          {item.status === 'preparing' && !itemReadyConfirmations.has(`${order.id}-${index}`) && (
                            <button
                              onClick={() => handleItemReadyWithConfirmation(order.id, index)}
                              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                              title="Hazırla"
                            >
                              Hazırla
                            </button>
                          )}
                          {item.status === 'preparing' && itemReadyConfirmations.has(`${order.id}-${index}`) && (
                            <div className="px-2 py-1 bg-green-600 text-white rounded text-xs animate-pulse">
                              Hazırlandı!
                            </div>
                          )}
                          {item.status === 'ready' && !itemCompletedConfirmations.has(`${order.id}-${index}`) && (
                            <button
                              onClick={() => handleItemCompletedWithConfirmation(order.id, index)}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                              title="Hazır"
                            >
                              Hazır
                            </button>
                          )}
                          {item.status === 'ready' && itemCompletedConfirmations.has(`${order.id}-${index}`) && (
                            <div className="px-2 py-1 bg-purple-600 text-white rounded text-xs animate-pulse">
                              Sipariş Tamamlandı!
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                ))}
              </div>

                {/* Sipariş seviyesinde toplu butonlar */}
              <div className="flex justify-end gap-2 mt-4">
                  {/* Hazırlanan ürünler varsa "Tüm Siparişi Hazırla" butonu */}
                  {order.items.some((item: any) => item && item.status === 'preparing') && (
                    <button
                      onClick={() => handleOrderBulkPrepare(order.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        <FaCheckCircle className="text-sm" />
                        <span>Tüm Siparişi Hazırla</span>
                    </button>
                  )}
                  
                  {/* Hazır ürünler varsa "Tüm Siparişi Tamamla" butonu */}
                  {order.items.some((item: any) => item && item.status === 'ready') && (
                    <button
                      onClick={() => handleOrderBulkReady(order.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        <FaUtensils className="text-sm" />
                        <span>Tüm Siparişi Tamamla</span>
                    </button>
                  )}
                  
                  {/* Tüm ürünler tamamlandıysa göstergesi */}
                  {order.status === 'served' && (
                    <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium flex items-center gap-2">
                        <FaCheckCircle className="text-sm" />
                        <span>Tamamlandı</span>
                    </div>
                  )}
              </div>
            </div>
            );
          })}
        </div>


        {isClient && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Henüz sipariş yok</h3>
            <p className="text-gray-500">Yeni siparişler geldiğinde burada görünecek.</p>
          </div>
        )}
      </div>
    </div>
  );
}



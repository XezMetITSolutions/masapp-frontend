
 'use client';

import { useState, useEffect } from 'react';

import { useParams } from 'next/navigation';
import { 
  FaShoppingCart, 
  FaConciergeBell, 
  FaWater,
  FaHandPaper,
  FaReceipt,
  FaPlus,
  FaMinus,
  FaSearch,
  FaGlobe,
  FaCheckCircle,
  FaBroom,
  FaHistory,
  FaUtensils
} from 'react-icons/fa';
import PaymentModal from '@/components/PaymentModal';
import usePaymentHistoryStore from '@/store/usePaymentHistoryStore';
import useBillRequestStore from '@/store/useBillRequestStore';
import useNotificationStore from '@/store/useNotificationStore';
import useLanguageStore from '@/store/useLanguageStore';
import AITranslationWrapper, { useAITranslation } from '@/components/AITranslationWrapper';

export default function CustomerMenuPage() {
  const params = useParams();
  const { slug, table } = params;
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  
  // Language store kullanımı
  const { language, setLanguage, t } = useLanguageStore();
  // Masa değişikliği bildirimi kaldırıldı - gereksiz karmaşıklık
  
  const { getPaymentsByTable, getTotalPaidForTable } = usePaymentHistoryStore();
  const { createBillRequest } = useBillRequestStore();
  const { createBillRequestNotification } = useNotificationStore();
  
  // Ödeme geçmişi verilerini al
  const tableNumber = parseInt(table as string);
  const existingPayments = getPaymentsByTable(tableNumber);
  const totalPaid = getTotalPaidForTable(tableNumber);

  // Demo restoran bilgisi - İşletme ayarlarından gelecek
  const restaurant = {
    name: 'MasApp Cafe & Restaurant',
    logo: '',
    primaryColor: '#8B5CF6',
    secondaryColor: '#A78BFA',
    welcomeMessage: language === 'tr' ? 'Hoş Geldiniz!' : 'Welcome!',
    slogan: language === 'tr' ? 'Lezzetin Adresi' : 'Taste Destination',
    showLogoOnLoading: true,
    showSloganOnLoading: true,
    showLoadingMessage: true
  };

  // Demo kategoriler
  const categories = [
    { id: 'all', name: { tr: 'Tümü', en: 'All' } },
    { id: 'cat_1', name: { tr: 'Başlangıçlar', en: 'Starters' } },
    { id: 'cat_2', name: { tr: 'Ana Yemekler', en: 'Main Courses' } },
    { id: 'cat_3', name: { tr: 'Salatalar', en: 'Salads' } },
    { id: 'cat_4', name: { tr: 'İçecekler', en: 'Beverages' } },
    { id: 'cat_5', name: { tr: 'Tatlılar', en: 'Desserts' } }
  ];

  // Demo menü öğeleri - AI çeviri ile dinamik
  const menuItems = [
    {
      id: 1,
      categoryId: 'cat_1',
      name: { tr: 'Humus', en: 'Hummus' },
      description: { tr: 'Nohut püresi, tahin, zeytinyağı', en: 'Chickpea puree, tahini, olive oil' },
      price: 45,
      image: '',
      preparationTime: 10
    },
    {
      id: 2,
      categoryId: 'cat_1',
      name: { tr: 'Sigara Böreği', en: 'Cheese Rolls' },
      description: { tr: 'Peynirli, 6 adet', en: 'With cheese, 6 pieces' },
      price: 55,
      image: '',
      preparationTime: 15
    },
    {
      id: 3,
      categoryId: 'cat_2',
      name: { tr: 'Izgara Köfte', en: 'Grilled Meatballs' },
      description: { tr: 'Dana köfte, pilav, salata ile', en: 'Beef meatballs with rice and salad' },
      price: 120,
      image: '',
      preparationTime: 20
    },
    {
      id: 4,
      categoryId: 'cat_3',
      name: { tr: 'Çoban Salata', en: 'Shepherd\'s Salad' },
      description: { tr: 'Domates, salatalık, soğan', en: 'Tomato, cucumber, onion' },
      price: 35,
      image: '',
      preparationTime: 5
    },
    {
      id: 5,
      categoryId: 'cat_4',
      name: { tr: 'Ayran', en: 'Ayran' },
      description: { tr: 'Ev yapımı', en: 'Homemade' },
      price: 15,
      image: '',
      preparationTime: 2
    }
  ];

  const filteredItems = menuItems.filter(item => {
    if (activeCategory !== 'all' && item.categoryId !== activeCategory) return false;
    if (searchTerm) {
      const name = item.name[language as 'tr' | 'en'].toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const addToCart = (item: any) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    // Sepete eklendi bildirimi
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const updateQuantity = (itemId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as any[]);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Persist edilmiş verilerin yüklenmesini bekle
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800); // 0.8 saniye loading göster
    return () => clearTimeout(timer);
  }, []);

  // Ödeme tamamlandığında sepet sıfırlama bildirimini dinle
  useEffect(() => {
    const checkNotifications = () => {
      const notifications = JSON.parse(localStorage.getItem('customer_notifications') || '[]');
      const currentTable = parseInt(table as string);
      
      // Bu masa için ödeme tamamlandı bildirimi var mı?
      const paymentNotification = notifications.find((notification: any) => 
        notification.type === 'payment_complete' && 
        notification.tableNumber === currentTable
      );

      if (paymentNotification) {
        // Sepeti sıfırla
        setCart([]);
        setOrderComplete(true);
        setOrderPlaced(false);
        
        // Bildirimi kaldır (tekrar tetiklenmemesi için)
        const filteredNotifications = notifications.filter((notification: any) => 
          !(notification.type === 'payment_complete' && notification.tableNumber === currentTable)
        );
        localStorage.setItem('customer_notifications', JSON.stringify(filteredNotifications));
        
        // Toast bildirimi göster
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }

      // Masa değişikliği bildirimi kaldırıldı - müşteri hiçbir şey fark etmeyecek
    };

    // İlk kontrol
    checkNotifications();

    // Her 2 saniyede bir kontrol et
    const interval = setInterval(checkNotifications, 2000);

    return () => clearInterval(interval);
  }, [table]);

  const handleServiceCall = (type: string) => {
    if (type === 'bill') {
      // Hesap talebi için özel işlem
      if (cart.length === 0) {
        alert(language === 'tr' ? 'Sepetinizde ürün yok!' : 'Your cart is empty!');
        return;
      }
      
      // Sipariş oluştur
      const orderId = `order_${Date.now()}`;
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Hesap talebi oluştur
      const billRequestId = createBillRequest(
        orderId,
        tableNumber,
        totalAmount,
        'customer'
      );
      
      // Bildirim oluştur
      createBillRequestNotification(
        tableNumber,
        orderId,
        billRequestId
      );
      
      console.log('✅ Hesap talebi gönderildi:', billRequestId);
    }
    
    // Çağrı verisi oluştur
    const callData = {
      id: Date.now().toString(),
      type: type === 'waiter' ? 'waiter_call' : 
            type === 'water' ? 'water_request' : 
            type === 'bill' ? 'bill_request' : 'clean_request',
      tableNumber: parseInt(table as string),
      message: type === 'waiter' ? 
        (language === 'tr' ? 'Garson çağrısı' : 'Waiter call') :
        type === 'water' ? 
        (language === 'tr' ? 'Su isteniyor' : 'Water requested') :
        type === 'bill' ?
        (language === 'tr' ? 'Hesap isteniyor' : 'Bill requested') :
        (language === 'tr' ? 'Masa temizleme isteniyor' : 'Table cleaning requested'),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    // LocalStorage'a kaydet
    const existingCalls = JSON.parse(localStorage.getItem('waiter_calls') || '[]');
    existingCalls.push(callData);
    localStorage.setItem('waiter_calls', JSON.stringify(existingCalls));
    
    // Toast bildirimi
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handlePaymentComplete = (paymentData: any) => {
    console.log('Payment completed:', paymentData);
    setShowPayment(false);
    setShowCart(false);
    setOrderComplete(true);
    setCart([]);
    
    // Show success message for 3 seconds
    setTimeout(() => {
      setOrderComplete(false);
    }, 3000);
  };

  const prepareOrder = () => {
    if (cart.length === 0) return;
    
    const tableNumber = parseInt(table as string);
    
    // Mevcut siparişleri al
    const existingOrders = JSON.parse(localStorage.getItem('waiter_orders') || '[]');
    
    // Bu masa için mevcut sipariş var mı kontrol et
    let existingOrder = existingOrders.find((order: any) => order.tableNumber === tableNumber && order.status === 'preparing');
    
    if (existingOrder) {
      // Mevcut siparişe yeni ürünleri ekle
      const newItems = cart.map(item => ({
        name: typeof item.name === 'string' ? item.name : item.name[language as 'tr' | 'en'],
        quantity: item.quantity,
        price: item.price,
        notes: item.notes || '',
        status: 'preparing'
      }));
      
      existingOrder.items = [...existingOrder.items, ...newItems];
      existingOrder.totalAmount = existingOrder.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      existingOrder.orderTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      
      console.log('🔄 Mevcut siparişe ürünler eklendi:', newItems);
    } else {
      // Yeni sipariş oluştur
      const orderData = {
        id: Date.now(),
        tableNumber: tableNumber,
        guests: 2, // Varsayılan misafir sayısı
        items: cart.map(item => ({
          name: typeof item.name === 'string' ? item.name : item.name[language as 'tr' | 'en'],
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || '',
          status: 'preparing'
        })),
        status: 'preparing',
        orderTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        waitTime: 0,
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        calls: [],
        priority: 'normal',
        createdAt: new Date().toISOString()
      };
      
      existingOrders.push(orderData);
      console.log('🆕 Yeni sipariş oluşturuldu:', orderData);
    }
    
    // Garson paneline sipariş gönder
    localStorage.setItem('waiter_orders', JSON.stringify(existingOrders));
    
    // Siparişi hazırlanmaya başlat
    setOrderPlaced(true);
    setShowCart(false);
    
    // Başarı mesajı göster
    setTimeout(() => {
      setOrderPlaced(false);
    }, 3000);
  };

  // Yüklenme durumunda işletme tanıtımı göster
  if (!isLoaded) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(135deg, ${restaurant.primaryColor}15, white, ${restaurant.secondaryColor}15)`
        }}
      >
        <div className="text-center max-w-sm w-full">
          {/* Logo */}
          {restaurant.showLogoOnLoading && (
            <div className="mb-6">
              {restaurant.logo ? (
                <img 
                  src={restaurant.logo} 
                  alt={restaurant.name}
                  className="w-16 h-16 mx-auto mb-3 rounded-xl shadow-md object-cover"
                />
              ) : (
                <div 
                  className="w-16 h-16 mx-auto mb-3 rounded-xl shadow-md flex items-center justify-center text-white text-2xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${restaurant.primaryColor}, ${restaurant.secondaryColor})`
                  }}
                >
                  {restaurant.name.charAt(0)}
                </div>
              )}
            </div>
          )}

          {/* İşletme Adı */}
          <h1 
            className="text-2xl font-bold mb-1"
            style={{ color: restaurant.primaryColor }}
          >
            {restaurant.name}
          </h1>

          {/* Slogan */}
          {restaurant.showSloganOnLoading && restaurant.slogan && (
            <p className="text-sm text-gray-600 mb-4">
              {restaurant.slogan}
            </p>
          )}

          {/* Hoş Geldiniz Mesajı */}
          {restaurant.showLoadingMessage && (
            <p className="text-gray-500 mb-4 text-sm">
              {restaurant.welcomeMessage}
            </p>
          )}

          {/* Loading Animasyonu */}
          <div className="flex items-center justify-center space-x-1">
            <div 
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ backgroundColor: restaurant.primaryColor }}
            ></div>
            <div 
              className="w-1.5 h-1.5 rounded-full animate-bounce" 
              style={{ 
                backgroundColor: restaurant.primaryColor,
                animationDelay: '0.1s' 
              }}
            ></div>
            <div 
              className="w-1.5 h-1.5 rounded-full animate-bounce" 
              style={{ 
                backgroundColor: restaurant.primaryColor,
                animationDelay: '0.2s' 
              }}
            ></div>
          </div>

          {/* Alt Mesaj */}
          <p className="text-xs text-gray-400 mt-2">
            {language === 'tr' ? 'Menü hazırlanıyor...' : 'Preparing menu...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ '--primary-color': restaurant.primaryColor } as any}>
      {/* Header */}
      <header 
        className="sticky top-0 z-40 shadow-lg"
        style={{ backgroundColor: restaurant.primaryColor }}
      >
        <div className="text-white px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{restaurant.name}</h1>
              <p className="text-sm opacity-90">Masa {table}</p>
            </div>
            <button
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <FaGlobe />
            </button>
          </div>
        </div>

        {/* Hızlı Çağrılar */}
        <div className="bg-white bg-opacity-10 px-4 py-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => handleServiceCall('waiter')}
            className="flex items-center gap-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm whitespace-nowrap"
          >
            <FaConciergeBell />
            {language === 'tr' ? 'Garson' : 'Waiter'}
          </button>
          <button
            onClick={() => handleServiceCall('water')}
            className="flex items-center gap-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm whitespace-nowrap"
          >
            <FaWater />
            {language === 'tr' ? 'Su' : 'Water'}
          </button>
          <button
            onClick={() => handleServiceCall('bill')}
            className="flex items-center gap-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm whitespace-nowrap"
          >
            <FaReceipt />
            {language === 'tr' ? 'Hesap' : 'Bill'}
          </button>
          <button
            onClick={() => handleServiceCall('clean')}
            className="flex items-center gap-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm whitespace-nowrap"
          >
            <FaBroom />
            {language === 'tr' ? 'Temizle' : 'Clean'}
          </button>
          {existingPayments.length > 0 && (
            <button
              onClick={() => setShowPaymentHistory(true)}
              className="flex items-center gap-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm whitespace-nowrap"
            >
              <FaHistory />
              {language === 'tr' ? 'Ödeme Geçmişi' : 'Payment History'}
            </button>
          )}
        </div>
      </header>

      {/* Arama */}
      <div className="sticky top-24 z-30 bg-white shadow-sm px-4 py-3">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={language === 'tr' ? 'Ürün ara...' : 'Search products...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
            style={{ focusRingColor: restaurant.primaryColor } as any}
          />
        </div>
      </div>

      {/* Kategoriler */}
      <div className="sticky top-40 z-20 bg-white shadow-sm px-4 py-3 flex gap-2 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat.id 
                ? 'text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={activeCategory === cat.id ? { backgroundColor: restaurant.primaryColor } : {}}
          >
            {cat.name[language as 'tr' | 'en']}
          </button>
        ))}
      </div>

      {/* Menü Öğeleri */}
      <div className="p-4 pb-24">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <AITranslationWrapper 
                    text={item.name[language as 'tr' | 'en']} 
                    context="menu item name"
                  >
                    {(translatedName, isTranslating) => (
                      <h3 className="font-semibold text-gray-800">
                        {isTranslating ? '...' : translatedName}
                      </h3>
                    )}
                  </AITranslationWrapper>
                  
                  <AITranslationWrapper 
                    text={item.description[language as 'tr' | 'en']} 
                    context="menu item description"
                  >
                    {(translatedDesc, isTranslating) => (
                      <p className="text-sm text-gray-600 mt-1">
                        {isTranslating ? '...' : translatedDesc}
                      </p>
                    )}
                  </AITranslationWrapper>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-lg font-bold" style={{ color: restaurant.primaryColor }}>
                      ₺{item.price}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.preparationTime} {language === 'tr' ? 'dk' : 'min'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="p-3 rounded-lg text-white transition-transform hover:scale-105"
                  style={{ backgroundColor: restaurant.primaryColor }}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Bildirimi */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center">
            <FaCheckCircle className="mr-2" size={14} />
            <span className="text-sm font-medium">
              {language === 'tr' ? 'Sepete eklendi! Sepeti görüntüleyebilirsiniz.' : 'Added to cart! You can view your cart.'}
            </span>
          </div>
        </div>
      )}

      {/* Sepet Butonu */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-4 right-4 left-4 mx-auto max-w-sm py-3 px-6 rounded-full text-white shadow-lg flex items-center justify-between z-50"
          style={{ backgroundColor: restaurant.primaryColor }}
        >
          <div className="flex items-center gap-2">
            <FaShoppingCart />
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} {language === 'tr' ? 'ürün' : 'items'}</span>
          </div>
          <span className="font-bold">₺{getTotalPrice()}</span>
        </button>
      )}

      {/* Sepet Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{language === 'tr' ? 'Sepetim' : 'My Cart'}</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    <AITranslationWrapper 
                      text={item.name[language as 'tr' | 'en']} 
                      context="cart item name"
                    >
                      {(translatedName, isTranslating) => (
                        <p className="font-medium">
                          {isTranslating ? '...' : translatedName}
                        </p>
                      )}
                    </AITranslationWrapper>
                    <p className="text-sm text-gray-600">₺{item.price}</p>
                   </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded-lg hover:bg-gray-100"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded-lg hover:bg-gray-100"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <span className="ml-4 font-medium">₺{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">{language === 'tr' ? 'Toplam' : 'Total'}</span>
                <span className="text-xl font-bold" style={{ color: restaurant.primaryColor }}>
                  ₺{getTotalPrice()}
                </span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={prepareOrder}
                  className="w-full py-3 rounded-lg text-white font-medium"
                  style={{ backgroundColor: restaurant.secondaryColor }}
                >
                  {language === 'tr' ? 'Siparişini Hazırlat' : 'Prepare Order'}
                </button>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full py-3 rounded-lg text-white font-medium"
                  style={{ backgroundColor: restaurant.primaryColor }}
                >
                  {language === 'tr' ? 'Şimdi Öde' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        total={getTotalPrice()}
        language={language as 'tr' | 'en'}
        restaurantColor={restaurant.primaryColor}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Order Complete Success */}
      {orderComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
            <div className="text-6xl text-green-500 mb-4">
              <FaCheckCircle className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: restaurant.primaryColor }}>
              {language === 'tr' ? 'Teşekkürler!' : 'Thank You!'}
            </h2>
            <p className="text-gray-600">
              {language === 'tr' 
                ? 'Siparişiniz alındı ve mutfağa iletildi.' 
                : 'Your order has been received and sent to the kitchen.'}
            </p>
          </div>
        </div>
      )}

      {/* Order Prepared Success */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
            <div className="text-6xl text-orange-500 mb-4">
              <FaUtensils className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: restaurant.primaryColor }}>
              {language === 'tr' ? 'Siparişiniz Hazırlanıyor!' : 'Your Order is Being Prepared!'}
            </h2>
            <p className="text-gray-600">
              {language === 'tr' 
                ? 'Siparişiniz mutfağa iletildi ve hazırlanmaya başlandı.' 
                : 'Your order has been sent to the kitchen and preparation has started.'}
            </p>
          </div>
        </div>
      )}

      {/* Ödeme Geçmişi Modal */}
      {showPaymentHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {language === 'tr' ? 'Ödeme Geçmişi' : 'Payment History'} - Masa {table}
              </h3>
              <button
                onClick={() => setShowPaymentHistory(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {existingPayments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {language === 'tr' ? 'Henüz ödeme yapılmamış.' : 'No payments made yet.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {existingPayments.map((payment, index) => (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {payment.payerName || (language === 'tr' ? 'Anonim' : 'Anonymous')} - {payment.amount.toFixed(2)} ₺
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.timestamp).toLocaleString('tr-TR')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {language === 'tr' ? 'Ödeme Yöntemi: ' : 'Payment Method: '}
                            {payment.method === 'cash' ? (language === 'tr' ? 'Nakit' : 'Cash') : 
                             payment.method === 'card' ? (language === 'tr' ? 'Kart' : 'Card') : 
                             (language === 'tr' ? 'Mobil' : 'Mobile')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.isPartial ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {payment.isPartial ? (language === 'tr' ? 'Kısmi' : 'Partial') : (language === 'tr' ? 'Tam' : 'Full')}
                        </span>
                      </div>
                      
                      {payment.items.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {language === 'tr' ? 'Ödenen Ürünler:' : 'Paid Items:'}
                          </p>
                          <div className="space-y-1">
                            {payment.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex justify-between text-sm text-gray-600">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>{language === 'tr' ? 'Toplam Ödenen:' : 'Total Paid:'}</span>
                      <span className="text-green-600">{totalPaid.toFixed(2)} ₺</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Masa değişikliği modalı kaldırıldı - müşteri hiçbir şey fark etmeyecek */}
    </div>
  );
}

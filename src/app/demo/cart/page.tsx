'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaShoppingCart, 
  FaBell, 
  FaArrowLeft, 
  FaStar, 
  FaPlus, 
  FaMinus, 
  FaInfo, 
  FaTrash, 
  FaCreditCard, 
  FaTicketAlt, 
  FaUtensils, 
  FaCoffee, 
  FaCookie, 
  FaHamburger 
} from 'react-icons/fa';
import { RiEmotionHappyLine, RiHeartsFill } from 'react-icons/ri';
import { useCartStore, useLanguageStore, useOrderStore } from '@/store';
import CartItemNotes from '@/components/CartItemNotes';
import { v4 as uuidv4 } from 'uuid';
import useBusinessSettingsStore from '@/store/useBusinessSettingsStore';
import SetBrandColor from '@/components/SetBrandColor';

export default function CartPage() {
  const { settings } = useBusinessSettingsStore();
  const primary = settings.branding.primaryColor;
  const secondary = settings.branding.secondaryColor || settings.branding.primaryColor;
  const [hazirlatildi, setHazirlatildi] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  function prepareOrder() {
    if (cartItems.length === 0) return;
    
    // Mevcut siparişleri al
    const existingOrders = JSON.parse(localStorage.getItem('waiter_orders') || '[]');
    
    // Bu masa için mevcut sipariş var mı kontrol et
    let existingOrder = existingOrders.find((order: any) => order.tableNumber === tableNumber && order.status === 'preparing');
    
    if (existingOrder) {
      // Mevcut siparişe yeni ürünleri ekle
      const newItems = cartItems.map(item => ({
        name: typeof item.name === 'string' ? item.name : item.name[language as 'tr' | 'en'],
        quantity: item.quantity,
        price: item.price,
        notes: item.notes || '',
        status: 'preparing'
      }));
      
      existingOrder.items = [...existingOrder.items, ...newItems];
      existingOrder.totalAmount = existingOrder.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      existingOrder.orderTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      
      console.log('🔄 Demo - Mevcut siparişe ürünler eklendi:', newItems);
    } else {
      // Yeni sipariş oluştur
      const orderData = {
        id: Date.now(),
        tableNumber: tableNumber,
        guests: 2, // Varsayılan misafir sayısı
        items: cartItems.map(item => ({
          name: typeof item.name === 'string' ? item.name : item.name[language as 'tr' | 'en'],
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || '',
          status: 'preparing'
        })),
        status: 'preparing',
        orderTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        waitTime: 0,
        totalAmount: total,
        calls: [],
        priority: 'normal',
        createdAt: new Date().toISOString()
      };
      
      existingOrders.push(orderData);
      console.log('🆕 Demo - Yeni sipariş oluşturuldu:', orderData);
    }
    
    // Garson paneline sipariş gönder
    localStorage.setItem('waiter_orders', JSON.stringify(existingOrders));
    
    // Siparişi order store'a ekle
    const orderId = addOrder({
      items: cartItems,
      tableNumber: tableNumber,
      status: 'preparing', // Hazırlanmaya başla
      total: total,
      tipAmount: tipAmount,
      supportAmount: supportFinal,
      discount: discount,
      subtotal: subtotal,
      couponCode: couponCode
    });
    
    setOrderId(orderId);
    setHazirlatildi(true);
    setOrderPlaced(true);
    
    // Aktif ürünleri hazırlanan bölümüne taşı
    moveToPreparing();
  }
  
  // Use Zustand stores
  const { language, setLanguage } = useLanguageStore(state => ({
    language: state.language,
    setLanguage: state.setLanguage
  }));
  
  // Dil değişimini kontrol et ve varsayılan dil ayarla
  useEffect(() => {
    if (language && language !== 'en' && language !== 'tr') {
      setLanguage('tr'); // Varsayılan dil olarak Türkçe
    }
  }, [language, setLanguage]);
  
  // Get translations
  const translations = {
    en: {
      cart: 'Cart',
      menu: 'Menu',
      callWaiter: 'Call Waiter',
      emptyCart: 'Your cart is empty',
      browseMenu: 'Browse Menu',
      quantity: 'Quantity',
      subtotal: 'Subtotal',
      tip: 'Tip',
      tipAmount: 'Tip Amount',
      tipMessage: 'If you enjoyed the service, you can leave a tip. Tips go directly to the restaurant staff.',
      support: 'Support',
      supportMessage: 'Would you like to leave a small support for the system developers? 🙂',
      supportAmount: 'Support Amount',
      customAmount: 'Custom Amount',
      coupon: 'Coupon',
      couponNotice: 'Coupons are only valid for in-app payments.',
      applyCoupon: 'Apply',
      total: 'Total',
      placeOrder: 'Place Order',
      payNow: 'Pay Now',
      orderPlaced: 'Your order has been placed!',
      addMore: 'Add More Items',
      tableNumber: 'Table',
      remove: 'Remove',
      discount: 'Discount',
    },
    tr: {
      cart: 'Sepet',
      menu: 'Menü',
      callWaiter: 'Garson Çağır',
      emptyCart: 'Sepetiniz boş',
      browseMenu: 'Menüye Göz At',
      quantity: 'Adet',
      subtotal: 'Ara Toplam',
      tip: 'Bahşiş',
      tipAmount: 'Bahşiş Tutarı',
      tipMessage: 'Servisten memnun kaldıysanız bahşiş bırakabilirsiniz. Bahşişler doğrudan restoran personeline iletilir.',
      support: 'Destek Ol',
      supportMessage: 'Sistem geliştiricilerine küçük bir destek bırakmak ister misiniz? 🙂',
      supportAmount: 'Destek Tutarı',
      customAmount: 'Tutar Belirle',
      coupon: 'Kupon',
      couponNotice: 'Kuponlar yalnızca uygulama içi ödemelerde geçerlidir.',
      applyCoupon: 'Uygula',
      total: 'Toplam',
      placeOrder: 'Siparişi Ver',
      payNow: 'Şimdi Öde',
      orderPlaced: 'Siparişiniz alındı!',
      addMore: 'Başka Ürün Ekle',
      tableNumber: 'Masa',
      remove: 'Kaldır',
      discount: 'İndirim',
    }
  };
  
  const t = translations[language as 'en' | 'tr'];
  
  const { 
    items: cartItems, 
    preparingItems,
    couponCode,
    tipPercentage,
    tableNumber,
    orderStatus,
    addItem,
    removeItem,
    updateQuantity: updateItemQuantity,
    setCouponCode,
    setTipPercentage,
    setOrderStatus,
    moveToPreparing,
    getSubtotal,
    getDiscount,
    getTipAmount,
    getTotal
  } = useCartStore();
  
  const { addOrder } = useOrderStore();
  
  // Local state for order placement
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [supportAmount, setSupportAmount] = useState(0);
  const [showSupportCustom, setShowSupportCustom] = useState(false);
  const [supportCustomAmount, setSupportCustomAmount] = useState(0);
  const [customTipAmount, setCustomTipAmount] = useState(0);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [showTipSection, setShowTipSection] = useState(false);
  const [showSupportSection, setShowSupportSection] = useState(false);
  
  // Check if coupon is applied
  const couponApplied = couponCode !== null;

  const updateQuantity = (id: string, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateItemQuantity(id, Math.max(1, item.quantity + change));
    }
  };

  const applyCoupon = () => {
    // Simple coupon validation
    if (couponCode?.toLowerCase() === 'masapp10' || couponCode?.toLowerCase() === 'welcome10') {
      setCouponCode(couponCode);
    } else {
      setCouponCode(null);
    }
  };
  
  // Get calculated values from the store
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const tipAmount = getTipAmount();
  const supportFinal = showSupportCustom ? supportCustomAmount : supportAmount;
  const total = getTotal() + supportFinal;
  
  // Hazırlanan ürünlerin toplamı - sadece ürün fiyatları
  const preparingSubtotal = preparingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const placeOrder = () => {
    // Siparişi garson paneline gönder
    if (cartItems.length > 0) {
      // Siparişi order store'a ekle
      const orderData = {
        tableNumber: tableNumber,
        items: cartItems.map(item => ({
          id: item.id,
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          notes: ''
        })),
        status: 'preparing' as const,
        total: total,
        subtotal: total,
        tipAmount: 0,
        supportAmount: 0,
        discount: 0,
        couponCode: null
      };
      
      // Order store'a ekle
      addOrder(orderData);
      
      // Ödeme akışında sepeti ve masa bilgisini sıfırla
      const cart = useCartStore.getState();
      cart.markPaidAndClear?.();
      cart.resetTable?.();
      
      // Başarı mesajı
      alert(language === 'tr' ? 'Siparişiniz alındı! Garson paneline gönderildi.' : 'Your order has been received! Sent to waiter panel.');
    }
  };

  // Persist edilmiş verilerin yüklenmesini bekle
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Yüklenme durumunda loading göster
  if (!isLoaded) {
    return (
      <main className="min-h-screen pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </p>
        </div>
      </main>
    );
  }


  // Sepet boş kontrolü - hem aktif hem de hazırlanan ürünler yoksa boş
  if (cartItems.length === 0 && preparingItems.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen pb-20">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/menu" className="mr-2">
                <FaArrowLeft />
              </Link>
              <h1 className="text-dynamic-xl font-bold" style={{ color: primary }}>{t.cart}</h1>
              <div className="ml-2 px-2 py-1 rounded-lg text-sm" style={{ backgroundColor: 'var(--tone1-bg)', color: 'var(--tone1-text)', border: '1px solid var(--tone1-border)' }}>
                {t.tableNumber} #{tableNumber}
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setLanguage('en')}
                className={`mr-2 px-2 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('tr')}
                className={`px-2 py-1 rounded ${language === 'tr' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                TR
              </button>
            </div>
          </div>
        </header>

        <div className="pt-16 pb-4 flex flex-col items-center justify-center h-[70vh]">
          <div className="text-center px-4">
            <FaShoppingCart className="mx-auto text-gray-300 text-5xl mb-3" />
            <h2 className="text-dynamic-xl font-bold mb-3">{t.emptyCart}</h2>
            <Link href="/menu" className="btn bg-secondary hover:bg-secondary/90 text-white text-sm py-2">
              {t.browseMenu}
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg">
          <div className="container mx-auto flex justify-around">
            <Link href="/menu" className="flex flex-col items-center" style={{ color: primary }}>
              <FaUtensils className="mb-0.5" size={16} />
              <span className="text-[10px]">{t.menu}</span>
            </Link>
            <Link href="/demo/cart" className="flex flex-col items-center" style={{ color: primary }}>
              <FaShoppingCart className="mb-0.5" size={16} />
              <span className="text-[10px]">{t.cart}</span>
            </Link>
            <Link href="/demo/waiter" className="flex flex-col items-center" style={{ color: primary }}>
              <FaBell className="mb-0.5" size={16} />
              <span className="text-[10px]">{t.callWaiter}</span>
            </Link>
          </div>
        </nav>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen pb-20">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/menu" className="mr-2">
                <FaArrowLeft />
              </Link>
              <h1 className="text-dynamic-xl font-bold" style={{ color: primary }}>{t.cart}</h1>
              <div className="ml-2 px-2 py-1 rounded-lg text-sm" style={{ backgroundColor: 'var(--tone1-bg)', color: 'var(--tone1-text)', border: '1px solid var(--tone1-border)' }}>
                {t.tableNumber} #{tableNumber}
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setLanguage('en')}
                className={`mr-2 px-2 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('tr')}
                className={`px-2 py-1 rounded ${language === 'tr' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                TR
              </button>
            </div>
          </div>
        </header>

        <div className="pt-16 pb-4 flex flex-col items-center justify-center h-[70vh]">
          <div className="text-center px-4">
            <div className="h-16 w-16 bg-success rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-3">
              <FaUtensils />
            </div>
            <h2 className="text-dynamic-xl font-bold mb-3">{t.orderPlaced}</h2>
            <p className="text-gray-600 mb-4 text-sm">Order #{orderId.slice(0, 8)}</p>
            <Link href="/menu" className="btn bg-secondary hover:bg-secondary/90 text-white text-sm py-2">
              {t.addMore}
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg">
          <div className="container mx-auto flex justify-around">
            <Link href="/menu" className="flex flex-col items-center" style={{ color: primary }}>
              <FaUtensils className="mb-0.5" size={16} />
              <span className="text-[10px]">{t.menu}</span>
            </Link>
            <Link href="/demo/cart" className="flex flex-col items-center" style={{ color: primary }}>
              <FaShoppingCart className="mb-0.5" size={16} />
              <span className="text-[10px]">{t.cart}</span>
            </Link>
            <Link href="/demo/waiter" className="flex flex-col items-center" style={{ color: primary }}>
              <FaBell className="mb-0.5" size={16} />
              <span className="text-[10px]">{t.callWaiter}</span>
            </Link>
          </div>
        </nav>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <SetBrandColor />
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-3 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/menu" className="mr-2">
              <FaArrowLeft size={16} />
            </Link>
            <h1 className="text-dynamic-lg font-bold" style={{ color: primary }}>{t.cart}</h1>
            <div className="ml-2 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: 'var(--tone1-bg)', color: 'var(--tone1-text)', border: '1px solid var(--tone1-border)' }}>
              {t.tableNumber} #{tableNumber}
            </div>
          </div>
          <div className="flex items-center">
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

      <div className="pt-16 pb-4">
        <div className="container mx-auto px-3">
          {/* Hazırlanan Ürünler */}
          {preparingItems.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: primary }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primary }}></div>
                {language === 'tr' ? 'Hazırlanan Ürünler' : 'Preparing Items'}
              </h3>
              {preparingItems.map((item) => (
                <div key={item.id} className="card flex mb-3 p-3 shadow-sm" style={{ backgroundColor: `${primary}0D`, borderColor: `${primary}33`, borderWidth: 1 }}>
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image
                      src={item.image || ''}
                      alt={item.name[language as keyof typeof item.name] || ''}
                      fill
                      className="object-cover"
                    />
                    {/* Hazırlanıyor durumu için overlay */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${primary}33` }}>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: primary }}></div>
                    </div>
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-sm truncate pr-2">{item.name[language as keyof typeof item.name]}</h3>
                      <span className="font-semibold text-sm whitespace-nowrap" style={{ color: primary }}>{item.price} ₺</span>
                    </div>
                    
                    {/* Hazırlanıyor durumu için mesaj */}
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></div>
                      <span className="text-xs font-medium" style={{ color: primary }}>
                        {language === 'tr' ? 'Hazırlanıyor...' : 'Preparing...'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-sm font-medium text-gray-600">
                        {item.quantity} {language === 'tr' ? 'adet' : 'pcs'}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: primary }}>
                        ₺{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Hazırlanan ürünlerin toplamı */}
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${primary}1A` }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: primary }}>
                    {language === 'tr' ? 'Hazırlanan Sipariş Toplamı:' : 'Preparing Order Total:'}
                  </span>
                  <span className="text-lg font-bold" style={{ color: primary }}>
                    ₺{preparingSubtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Aktif Cart Items */}
          {cartItems.length > 0 && (
          <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {language === 'tr' ? 'Sepetim' : 'My Cart'}
              </h3>
            {cartItems.map((item) => (
              <div key={item.id} className="card flex flex-col sm:flex-row mb-3 p-3 shadow-sm">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={item.image || ''}
                    alt={item.name[language as keyof typeof item.name] || ''}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="sm:ml-3 mt-2 sm:mt-0 flex-grow">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-semibold text-sm truncate pr-2">{item.name[language as keyof typeof item.name]}</h3>
                    <span className="font-semibold text-sm whitespace-nowrap" style={{ color: primary }}>{item.price} ₺</span>
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <div className="flex items-center">
                      <button
                    className="btn text-white py-1 px-2 text-xs flex items-center"
                    style={{ backgroundColor: primary }}
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <FaMinus size={10} />
                  </button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <button
                    className="btn text-white py-1 px-2 text-xs flex items-center"
                    style={{ backgroundColor: primary }}
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <FaPlus size={10} />
                  </button>
                    </div>
                    <button className="text-error p-1 ml-2 sm:ml-4" onClick={() => removeItem(item.id)}>
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
                {/* Özel İstek Notu */}
                <div className="sm:ml-3 mt-2 sm:mt-0 w-full">
                  <CartItemNotes itemId={item.id} />
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Order Summary - sadece aktif ürünler varsa göster */}
          {cartItems.length > 0 && (
          <div className="card p-4 mb-4 shadow-sm">
            <h3 className="font-semibold text-sm mb-3">{t.subtotal}</h3>
            
            {/* Subtotal */}
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">{t.subtotal}</span>
              <span className="text-sm">{subtotal} ₺</span>
            </div>
            
            {/* Coupon Section */}
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <FaTicketAlt className="mr-1" size={14} style={{ color: primary }} />
                <h4 className="text-sm font-medium">{t.coupon}</h4>
              </div>
              <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="MASAPP10" 
                  className="flex-grow p-2 text-sm border rounded-l"
                  value={couponCode || ''}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button 
                  className="text-white px-3 py-2 text-sm rounded-r"
                  style={{ backgroundColor: primary }}
                  onClick={applyCoupon}
                >
                  {t.applyCoupon}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t.couponNotice}</p>
            </div>
            
            {/* Discount */}
            {discount > 0 && (
              <div className="flex justify-between mb-2 text-success">
                <span className="text-sm">{t.discount}</span>
                <span className="text-sm">-{discount} ₺</span>
              </div>
            )}
            
            {/* Tip Section */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <RiEmotionHappyLine className="mr-1" size={16} style={{ color: primary }} />
                  <h4 className="text-sm font-medium">{t.tip}</h4>
                </div>
                <button 
                  className="text-xs"
                  style={{ color: primary }}
                  onClick={() => setShowTipSection(!showTipSection)}
                >
                  {showTipSection ? (language === 'en' ? 'Hide' : 'Gizle') : (language === 'en' ? 'Show' : 'Göster')}
                </button>
              </div>
              
              {showTipSection && (
                <>
                  <p className="text-xs text-gray-600 mb-2">{t.tipMessage}</p>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[5, 10, 15].map((percent) => (
                      <button
                        key={percent}
                        className={`py-1 text-xs rounded ${tipPercentage === percent ? 'text-white' : 'bg-gray-100'}`}
                        style={tipPercentage === percent ? { backgroundColor: primary } : undefined}
                        onClick={() => {
                          setTipPercentage(percent);
                          setShowCustomTip(false);
                          setCustomTipAmount(0);
                        }}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="customTip"
                      checked={showCustomTip}
                      onChange={() => setShowCustomTip(!showCustomTip)}
                      className="mr-2"
                    />
                    <label htmlFor="customTip" className="text-xs">{t.customAmount}</label>
                  </div>
                  {showCustomTip && (
                    <div className="flex items-center">
                      <input
                        type="number"
                        className="w-full p-2 text-sm border rounded"
                        placeholder="0"
                        value={customTipAmount || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setCustomTipAmount(isNaN(value) ? 0 : value);
                          setTipPercentage(0);
                        }}
                      />
                      <span className="ml-2">₺</span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Support Section */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <RiHeartsFill className="mr-1" size={16} style={{ color: primary }} />
                  <h4 className="text-sm font-medium">{t.support}</h4>
                </div>
                <button 
                  className="text-xs"
                  style={{ color: primary }}
                  onClick={() => setShowSupportSection(!showSupportSection)}
                >
                  {showSupportSection ? (language === 'en' ? 'Hide' : 'Gizle') : (language === 'en' ? 'Show' : 'Göster')}
                </button>
              </div>
              
              {showSupportSection && (
                <>
                  <p className="text-xs text-gray-600 mb-2">{t.supportMessage}</p>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[5, 10, 20].map((amount) => (
                      <button
                        key={amount}
                        className={`py-1 text-xs rounded ${supportAmount === amount ? 'text-white' : 'bg-gray-100'}`}
                        style={supportAmount === amount ? { backgroundColor: primary } : undefined}
                        onClick={() => {
                          setSupportAmount(amount);
                          setShowSupportCustom(false);
                          setSupportCustomAmount(0);
                        }}
                      >
                        {amount} ₺
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="supportCustom"
                      checked={showSupportCustom}
                      onChange={() => setShowSupportCustom(!showSupportCustom)}
                      className="mr-2"
                    />
                    <label htmlFor="supportCustom" className="text-xs">{t.customAmount}</label>
                  </div>
                  {showSupportCustom && (
                    <div className="flex items-center mt-2">
                      <input
                        type="number"
                        className="w-full p-2 text-sm border rounded"
                        placeholder="0"
                        value={supportCustomAmount || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setSupportCustomAmount(isNaN(value) ? 0 : value);
                          setSupportAmount(0);
                        }}
                      />
                      <span className="ml-2">₺</span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Total */}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>{t.total}</span>
                <span>{total} ₺</span>
              </div>
            </div>
          </div>
          )}

          {/* Action Buttons */}
<div className="space-y-2">
            {cartItems.length > 0 ? (
              <>
  <button
    className="btn btn-secondary w-full flex items-center justify-center gap-1.5 py-2 text-sm"
    onClick={prepareOrder}
  >
    <FaUtensils size={14} />
    {language === 'tr' ? 'Siparişini Hazırlat' : 'Prepare Order'}
  </button>
  <button 
    className="btn btn-gradient w-full flex items-center justify-center gap-1.5 py-2 text-sm"
    onClick={placeOrder}
  >
    <FaCreditCard size={14} />
    {t.payNow}
  </button>
              </>
            ) : preparingItems.length > 0 ? (
              <div className="text-center text-gray-600 text-sm">
                {language === 'tr' ? 'Yeni ürün ekleyebilirsiniz' : 'You can add new items'}
              </div>
            ) : null}
</div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg">
        <div className="container mx-auto flex justify-around">
          <Link href="/menu" className="flex flex-col items-center" style={{ color: primary }}>
            <FaUtensils className="mb-0.5" size={16} />
            <span className="text-[10px]">{t.menu}</span>
          </Link>
          <Link href="/demo/cart" className="flex flex-col items-center" style={{ color: primary }}>
            <FaShoppingCart className="mb-0.5" size={16} />
            <span className="text-[10px]">{t.cart}</span>
          </Link>
          <Link href="/demo/waiter" className="flex flex-col items-center" style={{ color: primary }}>
            <FaBell className="mb-0.5" size={16} />
            <span className="text-[10px]">{t.callWaiter}</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}


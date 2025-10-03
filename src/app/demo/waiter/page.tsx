'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaShoppingCart, FaBell, FaUtensils, FaGlassWhiskey, FaReceipt, FaSprayCan, FaPlus } from 'react-icons/fa';
import { useWaiterStore, useLanguageStore, useCartStore } from '@/store';
import { publish } from '@/lib/realtime';
import useBusinessSettingsStore from '@/store/useBusinessSettingsStore';
import SetBrandColor from '@/components/SetBrandColor';
import type { WaiterRequest } from '@/store';

export default function WaiterPage() {
  const { settings } = useBusinessSettingsStore();
  const primary = settings.branding.primaryColor;
  // Use Zustand stores
  const { language, setLanguage } = useLanguageStore(state => ({
    language: state.language,
    setLanguage: state.setLanguage
  }));
  
  const { tableNumber } = useCartStore();
  const { 
    requests, 
    addRequest, 
    removeRequest, 
    getActiveRequests 
  } = useWaiterStore();
  
  const [customRequest, setCustomRequest] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  
  // Get active requests from the store
  const activeRequests = getActiveRequests();

  const translations = {
    en: {
      callWaiter: 'Call Waiter',
      menu: 'Menu',
      cart: 'Cart',
      quickRequests: 'Quick Requests',
      water: 'Bring Water',
      bill: 'Request Bill',
      clean: 'Clean Table',
      help: 'Need Assistance',
      customRequest: 'Custom Request',
      placeholder: 'Type your request here...',
      send: 'Send Request',
      activeRequests: 'Active Requests',
      requestSent: 'Request Sent!',
      waiterComing: 'A waiter will be with you shortly',
      back: 'Back to Menu',
      tableNumber: 'Table',
      noActiveRequests: 'No active requests',
    },
    tr: {
      callWaiter: 'Garson Çağır',
      menu: 'Menü',
      cart: 'Sepet',
      quickRequests: 'Hızlı İstekler',
      water: 'Su Getir',
      bill: 'Hesap İste',
      clean: 'Masayı Temizle',
      help: 'Yardım Gerekiyor',
      customRequest: 'Özel İstek',
      placeholder: 'İsteğinizi buraya yazın...',
      send: 'İstek Gönder',
      activeRequests: 'Aktif İstekler',
      requestSent: 'İstek Gönderildi!',
      waiterComing: 'Bir garson kısa süre içinde sizinle olacak',
      back: 'Menüye Dön',
      tableNumber: 'Masa',
      noActiveRequests: 'Aktif istek yok',
    }
  };

  const t = translations[language];

  const quickRequests = [
    { id: 'water', icon: <FaGlassWhiskey />, text: t.water },
    { id: 'bill', icon: <FaReceipt />, text: t.bill },
    { id: 'clean', icon: <FaSprayCan />, text: t.clean },
    { id: 'help', icon: <FaPlus />, text: t.help },
  ];

  const sendQuickRequest = (requestId: string) => {
    const requestType = requestId;
    const requestText = quickRequests.find(req => req.id === requestId)?.text || '';
    
    // Add request to the store
    addRequest(requestType as WaiterRequest['type'], requestText);
    // Realtime publish to waiter & cashier panels
    publish('waiter_request', { type: requestType, message: requestText, tableNumber });
    
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
  };

  const sendCustomRequest = () => {
    if (customRequest.trim() !== '') {
      // Add custom request to the store
      addRequest('custom', customRequest);
      publish('waiter_request', { type: 'custom', message: customRequest, tableNumber });
      
      setCustomRequest('');
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 3000);
    }
  };

  const handleRemoveRequest = (requestId: string) => {
    removeRequest(requestId);
  };

  if (requestSent) {
    return (
      <main className="min-h-screen pb-20">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-3 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/demo/menu" className="mr-2">
                <FaArrowLeft size={16} />
              </Link>
              <h1 className="text-dynamic-lg font-bold" style={{ color: primary }}>{t.callWaiter}</h1>
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

        <div className="pt-16 pb-4 flex flex-col items-center justify-center h-[70vh]">
          <div className="text-center px-4">
            <div className="h-16 w-16 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-3" style={{ backgroundColor: primary }}>
              <FaBell />
            </div>
            <h2 className="text-dynamic-xl font-bold mb-3">{t.requestSent}</h2>
            <p className="text-gray-600 mb-4 text-sm">{t.waiterComing}</p>
            <Link href="/demo/menu" className="btn text-white text-sm py-2" style={{ backgroundColor: primary }}>
              {t.back}
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg">
          <div className="container mx-auto flex justify-around">
            <Link href="/demo/menu" className="flex flex-col items-center" style={{ color: primary }}>
              <FaUtensils className="mb-0.5" size={16} />
              <span className="text-[10px]">{t.menu}</span>
            </Link>
            <Link href="/demo/cart" className="flex flex-col items-center relative" style={{ color: primary }}>
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
            <Link href="/demo/menu" className="mr-2">
              <FaArrowLeft size={16} />
            </Link>
            <h1 className="text-lg font-bold" style={{ color: primary }}>{t.callWaiter}</h1>
            <div className="ml-2 px-2 py-1 rounded-lg text-xs" style={{ color: primary, backgroundColor: `${primary}1A` }}>
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
          {/* Quick Requests */}
          <div className="card mb-4 p-3 shadow-sm">
            <h3 className="font-bold mb-3 text-base">{t.quickRequests}</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickRequests.map((request, idx) => (
                <button
                  key={request.id}
                  className={`btn flex items-center justify-center gap-1.5 py-2 text-xs w-full h-12 ${idx % 2 === 0 ? 'btn-gradient' : 'btn-secondary'}`}
                  onClick={() => sendQuickRequest(request.id)}
                >
                  <span className="text-sm">{request.icon}</span>
                  <span>{request.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Request */}
          <div className="card mb-4 p-3 shadow-sm">
            <h3 className="font-bold mb-3 text-base">{t.customRequest}</h3>
            <div className="flex flex-col gap-2">
              <textarea
                className="input min-h-[80px] text-sm p-2"
                placeholder={t.placeholder}
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
              />
              <button 
                className="btn btn-gradient py-2 text-sm"
                onClick={sendCustomRequest}
                disabled={customRequest.trim() === ''}
              >
                {t.send}
              </button>
            </div>
          </div>

          {/* Active Requests */}
          <div className="card bg-white shadow-sm p-3">
            <h3 className="font-bold mb-3 text-base" style={{ color: primary }}>{t.activeRequests}</h3>
            {activeRequests.length > 0 ? (
              <div className="space-y-2">
                {activeRequests.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900 text-sm">
                      {request.type === 'custom' ? request.message : quickRequests.find(req => req.id === request.type)?.text}
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        className="px-2 py-1 rounded-md text-xs font-medium"
                        style={{ color: primary, backgroundColor: `${primary}1A` }}
                        onClick={() => handleRemoveRequest(request.id)}
                      >
                        {language === 'tr' ? 'İptal Et' : 'Cancel'}
                      </button>
                      <button 
                        className="text-base font-bold hover:bg-gray-200 h-6 w-6 flex items-center justify-center rounded-full"
                        style={{ color: primary }}
                        onClick={() => handleRemoveRequest(request.id)}
                        aria-label="Sil"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg text-sm">{t.noActiveRequests}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg">
        <div className="container mx-auto flex justify-around">
          <Link href="/demo/menu" className="flex flex-col items-center" style={{ color: primary }}>
            <FaUtensils className="mb-0.5" size={16} />
            <span className="text-[10px]">{t.menu}</span>
          </Link>
          <Link href="/demo/cart" className="flex flex-col items-center relative" style={{ color: primary }}>
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

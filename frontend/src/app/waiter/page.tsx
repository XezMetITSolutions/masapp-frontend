'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaBell, 
  FaArrowLeft, 
  FaWater,
  FaBroom,
  FaReceipt,
  FaUtensils,
  FaShoppingCart,
  FaUser,
  FaCheckCircle,
  FaComment
} from 'react-icons/fa';
import { useCartStore } from '@/store';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import TranslatedText from '@/components/TranslatedText';
import useBusinessSettingsStore from '@/store/useBusinessSettingsStore';
import SetBrandColor from '@/components/SetBrandColor';

function WaiterPageContent() {
  const { currentLanguage, translate } = useLanguage();
  const { tableNumber } = useCartStore();
  const { settings } = useBusinessSettingsStore();
  const [isClient, setIsClient] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  
  const primary = settings.branding.primaryColor;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const quickRequests = [
    {
      id: 'water',
      icon: FaWater,
      title: 'Su Getir',
      description: 'Masa için su isteği',
      color: 'bg-blue-500'
    },
    {
      id: 'clean',
      icon: FaBroom,
      title: 'Masayı Temizle',
      description: 'Masa temizlik isteği',
      color: 'bg-green-500'
    },
    {
      id: 'bill',
      icon: FaReceipt,
      title: 'Hesap',
      description: 'Hesap isteği',
      color: 'bg-purple-500'
    },
    {
      id: 'cutlery',
      icon: FaUtensils,
      title: 'Yeni Çatal Bıçak',
      description: 'Çatal bıçak takımı isteği',
      color: 'bg-orange-500'
    },
    {
      id: 'custom',
      icon: FaComment,
      title: 'Kişisel Mesaj',
      description: 'Özel istek gönder',
      color: 'bg-gray-500'
    }
  ];

  const handleRequest = (requestId: string) => {
    if (requestId === 'custom') {
      setShowCustomModal(true);
      return;
    }

    // Send request logic here
    console.log('Sending request:', requestId, 'for table:', tableNumber);
    
    // Add to sent requests
    setSentRequests(prev => [...prev, requestId]);
    
    // Show success feedback
    setTimeout(() => {
      setSentRequests(prev => prev.filter(id => id !== requestId));
    }, 3000);
  };

  const handleCustomRequest = () => {
    if (customMessage.trim()) {
      console.log('Sending custom message:', customMessage, 'for table:', tableNumber);
      setCustomMessage('');
      setShowCustomModal(false);
      
      // Show success feedback
      setTimeout(() => {
        // Success feedback could be shown here
      }, 1000);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <SetBrandColor />
      <main className="min-h-screen pb-20">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-3 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/menu" className="mr-2">
                <FaArrowLeft size={16} />
              </Link>
              <h1 className="text-dynamic-lg font-bold text-primary">
                <TranslatedText>Garson Çağır</TranslatedText>
              </h1>
              <div className="ml-2 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: 'var(--tone1-bg)', color: 'var(--tone1-text)', border: '1px solid var(--tone1-border)' }}>
                <TranslatedText>Masa #{tableNumber}</TranslatedText>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="pt-16 px-3 py-4">
          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-surface)' }}>
                <FaBell size={20} style={{ color: primary }} />
              </div>
              <div>
                <h3 className="font-semibold text-dynamic-sm">
                  <TranslatedText>Hızlı İstekler</TranslatedText>
                </h3>
                <p className="text-xs text-gray-600">
                  <TranslatedText>Garsonunuzla iletişime geçmek için aşağıdaki seçenekleri kullanın</TranslatedText>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Requests */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {quickRequests.map((request) => {
              const IconComponent = request.icon;
              const isSent = sentRequests.includes(request.id);
              
              return (
                <button
                  key={request.id}
                  onClick={() => handleRequest(request.id)}
                  disabled={isSent}
                  className={`relative bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4 hover:shadow-md transition-all ${
                    isSent ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${request.color} text-white`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-grow text-left">
                    <h3 className="font-semibold text-dynamic-sm">
                      <TranslatedText>{request.title}</TranslatedText>
                    </h3>
                    <p className="text-xs text-gray-600">
                      <TranslatedText>{request.description}</TranslatedText>
                    </p>
                  </div>
                  {isSent && (
                    <div className="absolute inset-0 bg-green-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <FaCheckCircle className="text-green-500 mx-auto mb-1" size={20} />
                        <span className="text-xs text-green-600 font-medium">
                          <TranslatedText>Gönderildi</TranslatedText>
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold text-dynamic-sm mb-3">
              <TranslatedText>Diğer Seçenekler</TranslatedText>
            </h3>
            
            <div className="space-y-3">
              <Link
                href="/cart"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaShoppingCart className="text-blue-500" size={16} />
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-sm">
                    <TranslatedText>Siparişi Görüntüle</TranslatedText>
                  </p>
                  <p className="text-xs text-gray-600">
                    <TranslatedText>Sepetinizdeki ürünleri kontrol edin</TranslatedText>
                  </p>
                </div>
              </Link>

              <Link
                href="/menu"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FaUtensils className="text-green-500" size={16} />
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-sm">
                    <TranslatedText>Menüye Dön</TranslatedText>
                  </p>
                  <p className="text-xs text-gray-600">
                    <TranslatedText>Yeni ürünler ekleyin</TranslatedText>
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg">
          <div className="container mx-auto flex justify-around">
            <Link href="/menu" className="flex flex-col items-center" style={{ color: primary }}>
              <FaUtensils className="mb-0.5" size={16} />
              <span className="text-[10px]"><TranslatedText>Menü</TranslatedText></span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center" style={{ color: primary }}>
              <FaShoppingCart className="mb-0.5" size={16} />
              <span className="text-[10px]"><TranslatedText>Sepet</TranslatedText></span>
            </Link>
            <Link href="/waiter" className="flex flex-col items-center" style={{ color: primary }}>
              <FaBell className="mb-0.5" size={16} />
              <span className="text-[10px]"><TranslatedText>Garson Çağır</TranslatedText></span>
            </Link>
          </div>
        </nav>
      </main>

      {/* Custom Message Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              <TranslatedText>Kişisel Mesaj</TranslatedText>
            </h3>
            <div className="mb-4">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="Mesajınızı yazın..."
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                <TranslatedText>{customMessage.length}/200 karakter</TranslatedText>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setCustomMessage('');
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <TranslatedText>İptal</TranslatedText>
              </button>
              <button
                onClick={handleCustomRequest}
                disabled={!customMessage.trim()}
                className="flex-1 py-2 px-4 btn btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TranslatedText>Gönder</TranslatedText>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function WaiterPage() {
  return (
    <LanguageProvider>
      <WaiterPageContent />
    </LanguageProvider>
  );
}

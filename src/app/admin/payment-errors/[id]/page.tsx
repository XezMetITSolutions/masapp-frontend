'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft,
  FaExclamationTriangle,
  FaBuilding, 
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaRedo,
  FaPaperPlane,
  FaFileAlt,
  FaHistory,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaBan,
  FaChartLine,
  FaDownload,
  FaEdit
} from 'react-icons/fa';

interface PaymentErrorDetail {
  id: string;
  subscriptionId: string;
  restaurantId: string;
  restaurantName: string;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  plan: {
    name: string;
    amount: number;
    currency: string;
  };
  error: {
    code: string;
    message: string;
    type: string;
    details: string;
  };
  paymentMethod: {
    type: string;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  attempts: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    errorCode?: string;
    errorMessage?: string;
  }>;
  status: 'pending' | 'resolved' | 'failed' | 'cancelled';
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  nextRetry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PaymentErrorDetail() {
  const router = useRouter();
  const params = useParams();
  const errorId = params.id as string;
  
  const [error, setError] = useState<PaymentErrorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    // Demo: Ödeme hatası detay verilerini yükle
    const loadError = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo veri
      const demoError: PaymentErrorDetail = {
        id: errorId,
        subscriptionId: 'sub-2',
        restaurantId: 'rest-2',
        restaurantName: 'Burger King',
        owner: {
          name: 'Mehmet Demir',
          email: 'mehmet@burgerking.com',
          phone: '+90 533 987 6543'
        },
        plan: {
          name: 'Pro Plan',
          amount: 3490,
          currency: 'TRY'
        },
        error: {
          code: 'card_declined',
          message: 'Kart reddedildi - Yetersiz bakiye',
          type: 'insufficient_funds',
          details: 'Kart sahibinin hesabında yeterli bakiye bulunmuyor. Lütfen farklı bir kart deneyin veya hesabınıza para yatırın.'
        },
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025
        },
        attempts: [
          {
            id: 'att-1',
            date: '2024-03-01T10:30:00Z',
            amount: 3490,
            status: 'failed',
            errorCode: 'card_declined',
            errorMessage: 'Yetersiz bakiye'
          },
          {
            id: 'att-2',
            date: '2024-03-02T10:30:00Z',
            amount: 3490,
            status: 'failed',
            errorCode: 'card_declined',
            errorMessage: 'Yetersiz bakiye'
          },
          {
            id: 'att-3',
            date: '2024-03-03T14:20:00Z',
            amount: 3490,
            status: 'failed',
            errorCode: 'card_declined',
            errorMessage: 'Yetersiz bakiye'
          }
        ],
        status: 'pending',
        nextRetry: '2024-03-05T10:00:00Z',
        notes: 'Müşteri ile iletişime geçildi, yeni kart bilgileri bekleniyor. Müşteri yeni kartını güncelleyeceğini belirtti.',
        createdAt: '2024-03-01T10:30:00Z',
        updatedAt: '2024-03-03T14:20:00Z'
      };
      
      setError(demoError);
      setIsLoading(false);
    };

    if (errorId) {
      loadError();
    }
  }, [errorId]);

  const handleAction = async (actionType: string) => {
    if (!error) return;
    
    setIsProcessing(true);
    setAction(actionType);
    
    try {
      // Demo: Ödeme hatası işlemi simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let newStatus = error.status;
      let newResolution = resolution;
      
      switch (actionType) {
        case 'retry':
          // Yeniden deneme işlemi
          break;
        case 'resolve':
          newStatus = 'resolved';
          newResolution = resolution || 'Manuel olarak çözüldü';
          break;
        case 'cancel':
          newStatus = 'cancelled';
          newResolution = resolution || 'İptal edildi';
          break;
        case 'addNote':
          // Not ekleme işlemi
          break;
      }
      
      setError(prev => prev ? { 
        ...prev, 
        status: newStatus,
        resolution: newResolution,
        resolvedAt: actionType === 'resolve' || actionType === 'cancel' ? new Date().toISOString() : prev.resolvedAt,
        resolvedBy: actionType === 'resolve' || actionType === 'cancel' ? 'Admin User' : prev.resolvedBy,
        notes: actionType === 'addNote' ? (prev.notes + '\n' + newNote) : prev.notes,
        updatedAt: new Date().toISOString()
      } : null);
      
      if (actionType === 'addNote') {
        setNewNote('');
      } else {
        setResolution('');
      }
      
      alert(`${actionType} işlemi başarıyla tamamlandı`);
    } catch (error) {
      console.error('Action error:', error);
      alert('İşlem sırasında bir hata oluştu');
    } finally {
      setIsProcessing(false);
      setAction(null);
    }
  };

  const getErrorTypeClass = (errorType: string) => {
    switch(errorType) {
      case 'card_declined': return 'bg-red-100 text-red-800';
      case 'insufficient_funds': return 'bg-orange-100 text-orange-800';
      case 'expired_card': return 'bg-yellow-100 text-yellow-800';
      case 'network_error': return 'bg-blue-100 text-blue-800';
      case 'fraud_detected': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getErrorTypeText = (errorType: string) => {
    switch(errorType) {
      case 'card_declined': return 'Kart Reddedildi';
      case 'insufficient_funds': return 'Yetersiz Bakiye';
      case 'expired_card': return 'Kart Süresi Dolmuş';
      case 'network_error': return 'Ağ Hatası';
      case 'fraud_detected': return 'Dolandırıcılık';
      case 'other': return 'Diğer';
      default: return errorType;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Beklemede';
      case 'resolved': return 'Çözüldü';
      case 'failed': return 'Başarısız';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-600" />;
      case 'resolved': return <FaCheckCircle className="text-green-600" />;
      case 'failed': return <FaTimes className="text-red-600" />;
      case 'cancelled': return <FaBan className="text-gray-600" />;
      default: return <FaExclamationTriangle className="text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Hata detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hata Bulunamadı</h1>
          <p className="text-gray-600 mb-4">Aradığınız ödeme hatası bulunamadı.</p>
          <Link href="/admin/payment-errors" className="text-blue-600 hover:underline">
            Ödeme hataları listesine dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/admin/payment-errors"
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ödeme Hatası Detayları</h1>
                <p className="text-gray-600 mt-1">{error.restaurantName} - {error.error.message}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm rounded-full font-medium flex items-center ${getStatusClass(error.status)}`}>
                {getStatusIcon(error.status)}
                <span className="ml-1">{getStatusText(error.status)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon - Hata Bilgileri */}
          <div className="lg:col-span-2 space-y-6">
            {/* İşletme Bilgileri */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaBuilding className="mr-2" />
                İşletme Bilgileri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">İşletme Adı</label>
                  <p className="mt-1 text-sm text-gray-900">{error.restaurantName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">İşletme ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{error.restaurantId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sahip</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FaUser className="mr-2 text-gray-400" />
                    {error.owner.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    {error.owner.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FaPhone className="mr-2 text-gray-400" />
                    {error.owner.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Hata Detayları */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                Hata Detayları
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hata Türü</label>
                    <span className={`mt-1 inline-block px-3 py-1 text-sm rounded-full font-medium ${getErrorTypeClass(error.error.type)}`}>
                      {getErrorTypeText(error.error.type)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hata Kodu</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{error.error.code}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hata Mesajı</label>
                  <p className="mt-1 text-sm text-gray-900">{error.error.message}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Detaylı Açıklama</label>
                  <p className="mt-1 text-sm text-gray-700">{error.error.details}</p>
                </div>
              </div>
            </div>

            {/* Ödeme Yöntemi */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaCreditCard className="mr-2" />
                Ödeme Yöntemi
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FaCreditCard className="mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {error.paymentMethod.brand} •••• {error.paymentMethod.last4}
                      </div>
                      <div className="text-xs text-gray-500">
                        {error.paymentMethod.expiryMonth}/{error.paymentMethod.expiryYear}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {error.paymentMethod.type}
                  </div>
                </div>
              </div>
            </div>

            {/* Deneme Geçmişi */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaHistory className="mr-2" />
                Deneme Geçmişi
              </h2>
              <div className="space-y-3">
                {error.attempts.map((attempt, index) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {attempt.status === 'failed' ? (
                          <FaTimes className="text-red-500" />
                        ) : (
                          <FaCheckCircle className="text-green-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Deneme #{index + 1} - {new Date(attempt.date).toLocaleDateString('tr-TR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(attempt.date).toLocaleTimeString('tr-TR')}
                        </div>
                        {attempt.errorMessage && (
                          <div className="text-xs text-red-600 mt-1">
                            {attempt.errorMessage}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ₺{attempt.amount.toLocaleString()}
                      </div>
                      <div className={`text-xs ${
                        attempt.status === 'failed' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {attempt.status === 'failed' ? 'Başarısız' : 'Başarılı'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - İşlemler ve Bilgiler */}
          <div className="space-y-6">
            {/* Hızlı İşlemler */}
            {error.status === 'pending' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleAction('retry')}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                  >
                    {isProcessing && action === 'retry' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaRedo className="mr-2" />
                        Yeniden Dene
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleAction('resolve')}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                  >
                    {isProcessing && action === 'resolve' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Çözüldü İşaretle
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleAction('cancel')}
                    disabled={isProcessing}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                  >
                    {isProcessing && action === 'cancel' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaTimes className="mr-2" />
                        İptal Et
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Hata Durumu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hata Durumu</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Oluşturulma Tarihi</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(error.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Son Güncelleme</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(error.updatedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deneme Sayısı</span>
                  <span className="text-sm font-medium text-gray-900">{error.attempts.length}</span>
                </div>
                
                {error.nextRetry && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sonraki Deneme</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(error.nextRetry).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
                
                {error.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Çözülme Tarihi</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(error.resolvedAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
                
                {error.resolvedBy && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Çözen</span>
                    <span className="text-sm font-medium text-gray-900">{error.resolvedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Plan Bilgileri */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaMoneyBillWave className="mr-2" />
                Plan Bilgileri
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plan Adı</span>
                  <span className="text-sm font-medium text-gray-900">{error.plan.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tutar</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₺{error.plan.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Para Birimi</span>
                  <span className="text-sm font-medium text-gray-900">{error.plan.currency}</span>
                </div>
              </div>
            </div>

            {/* Not Ekleme */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Not Ekle</h2>
              
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Not ekleyin..."
                />
                <button
                  onClick={() => handleAction('addNote')}
                  disabled={isProcessing || !newNote.trim()}
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                >
                  {isProcessing && action === 'addNote' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaFileAlt className="mr-2" />
                      Not Ekle
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mevcut Notlar */}
            {error.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mevcut Notlar</h2>
                <div className="text-sm text-gray-700 whitespace-pre-line">{error.notes}</div>
              </div>
            )}

            {/* Hızlı Erişim */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h2>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                  <FaPaperPlane className="mr-2" />
                  Müşteriye Email Gönder
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                  <FaPhone className="mr-2" />
                  Müşteriyi Ara
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                  <FaDownload className="mr-2" />
                  Rapor Oluştur
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                  <FaEdit className="mr-2" />
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

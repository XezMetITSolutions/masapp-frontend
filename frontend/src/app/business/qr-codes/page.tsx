'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaQrcode, 
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaDownload,
  FaPrint,
  FaSync,
  FaClock,
  FaSignOutAlt
} from 'react-icons/fa';
import { 
  createTableQRCode, 
  createGeneralQRCode, 
  createBulkTableQRCodes, 
  getRestaurantSlug,
  generateToken,
  type QRCodeData 
} from '@/utils/qrCodeGenerator';
import { useAuthStore } from '@/store/useAuthStore';
import BusinessSidebar from '@/components/BusinessSidebar';
import { useFeature } from '@/hooks/useFeature';

export default function QRCodesPage() {
  const router = useRouter();
  const { authenticatedRestaurant, authenticatedStaff, isAuthenticated, logout } = useAuthStore();
  
  // Feature kontrolü
  const hasQrMenu = useFeature('qr_menu');
  
  // States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bulkCount, setBulkCount] = useState(5);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [toast, setToast] = useState({ message: '', visible: false });

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/business/login');
      return;
    }
  }, [isAuthenticated, router]);

  // Feature check
  if (!hasQrMenu) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaQrcode className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Menü Özelliği</h2>
          <p className="text-gray-600 mb-4">Bu özellik mevcut planınızda bulunmuyor.</p>
          <button 
            onClick={() => router.push('/business/settings')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Planınızı Yükseltin
          </button>
        </div>
      </div>
    );
  }

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  // Toplu QR kod oluşturma
  const handleCreateBulkQRCodes = () => {
    if (!authenticatedRestaurant) {
      showToast('Restoran bilgisi bulunamadı!');
      return;
    }

    const newQRCodes = createBulkTableQRCodes(
      1, // Masa 1'den başla
      bulkCount,
      authenticatedRestaurant.id,
      selectedTheme
    );

    setQrCodes(prev => [...prev, ...newQRCodes]);
    setShowCreateModal(false);
    showToast(`${bulkCount} adet QR kod oluşturuldu!`);
  };

  // Tek QR kod oluşturma
  const handleCreateSingleQRCode = (tableNumber: number) => {
    if (!authenticatedRestaurant) {
      showToast('Restoran bilgisi bulunamadı!');
      return;
    }

    const newQRCode = createTableQRCode(
      tableNumber,
      authenticatedRestaurant.id,
      selectedTheme
    );

    setQrCodes(prev => [...prev, newQRCode]);
    showToast(`Masa ${tableNumber} QR kodu oluşturuldu!`);
  };

  // QR kod silme
  const handleDeleteQRCode = (id: string) => {
    setQrCodes(prev => prev.filter(qr => qr.id !== id));
    showToast('QR kod silindi!');
  };

  // URL kopyalama
  const handleCopyURL = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('URL kopyalandı!');
  };

  // QR kod indirme
  const handleDownloadQR = (qrCode: QRCodeData) => {
    const link = document.createElement('a');
    link.href = qrCode.qrCode;
    link.download = `${qrCode.name}.png`;
    link.click();
  };

  const onLogout = () => {
    logout();
    router.push('/business/login');
  };

  if (!authenticatedRestaurant && !authenticatedStaff) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />
      
      <div className="lg:pl-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">QR Kod Yönetimi</h1>
                  <p className="text-sm text-gray-600">Masa QR kodlarınızı oluşturun ve yönetin</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FaPlus />
                QR Kod Oluştur
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <FaQrcode className="text-3xl text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam QR Kod</p>
                  <p className="text-2xl font-bold text-gray-900">{qrCodes.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <FaEye className="text-3xl text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktif Kodlar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {qrCodes.filter(qr => qr.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <FaClock className="text-3xl text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Tarama</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Codes Grid */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">QR Kodlarım</h2>
            </div>
            <div className="p-6">
              {qrCodes.length === 0 ? (
                <div className="text-center py-12">
                  <FaQrcode className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz QR kod yok</h3>
                  <p className="text-gray-600 mb-4">İlk QR kodunuzu oluşturmak için başlayın</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    QR Kod Oluştur
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {qrCodes.map((qrCode) => (
                    <div key={qrCode.id} className="border rounded-lg p-4">
                      <div className="text-center mb-4">
                        <img 
                          src={qrCode.qrCode} 
                          alt={qrCode.name}
                          className="w-32 h-32 mx-auto mb-2"
                        />
                        <h3 className="font-semibold text-gray-900">{qrCode.name}</h3>
                        <p className="text-sm text-gray-600">{qrCode.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => handleCopyURL(qrCode.url)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                          <FaCopy />
                          URL Kopyala
                        </button>
                        <button
                          onClick={() => handleDownloadQR(qrCode)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100"
                        >
                          <FaDownload />
                          İndir
                        </button>
                        <button
                          onClick={() => handleDeleteQRCode(qrCode.id)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          <FaTrash />
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">QR Kod Oluştur</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Masa Sayısı
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="default">Varsayılan</option>
                  <option value="modern">Modern</option>
                  <option value="classic">Klasik</option>
                  <option value="minimal">Minimal</option>
                  <option value="romantic">Romantik</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleCreateBulkQRCodes}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.visible && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast.message}
        </div>
      )}
    </div>
  );
}

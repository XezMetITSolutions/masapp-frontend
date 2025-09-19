'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaQrcode, 
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
  FaHeadset,
  FaUtensils,
  FaShoppingCart,
  FaUsers,
  FaBell,
  FaDownload,
  FaPrint,
  FaCopy,
  FaShare,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaBars,
  FaSort,
  FaCalendarAlt,
  FaClock,
  FaTable,
  FaDesktop,
  FaMobile,
  FaImage,
  FaPalette,
  FaCog as FaSettings,
  FaEyeSlash,
  FaEye as FaEyeIcon
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';

export default function QRCodesPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [filteredQrCodes, setFilteredQrCodes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [newQrCode, setNewQrCode] = useState({
    name: '',
    type: 'table',
    tableNumber: '',
    description: '',
    customUrl: '',
    theme: 'default',
    isActive: true,
    expiresAt: '',
    notes: ''
  });

  useEffect(() => {
    // Sayfa yüklendiğinde demo işletme kullanıcısı oluştur
    const timer = setTimeout(() => {
      if (!user) {
        const demoUser = {
          id: 'demo-restaurant-1',
          name: 'Demo İşletme',
          email: 'demo@restaurant.com',
          role: 'restaurant_owner' as const,
          restaurantId: 'demo-restaurant-1',
          status: 'active' as const,
          createdAt: new Date()
        };
        
        const { login } = useAuthStore.getState();
        login(demoUser, 'demo-token', 'demo-refresh-token');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user]);

  // Demo QR kod verileri
  useEffect(() => {
    const demoQrCodes = [
      {
        id: 1,
        name: 'Masa 1 - QR Menü',
        type: 'table',
        tableNumber: 1,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://demo.masapp.com/masa/1',
        url: 'https://demo.masapp.com/masa/1',
        description: 'Masa 1 için QR kod menü',
        theme: 'default',
        isActive: true,
        scanCount: 45,
        lastScanned: '2024-01-15 14:30',
        createdAt: '2024-01-01',
        expiresAt: null,
        notes: 'Ana giriş masası'
      },
      {
        id: 2,
        name: 'Masa 5 - QR Menü',
        type: 'table',
        tableNumber: 5,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://demo.masapp.com/masa/5',
        url: 'https://demo.masapp.com/masa/5',
        description: 'Masa 5 için QR kod menü',
        theme: 'modern',
        isActive: true,
        scanCount: 32,
        lastScanned: '2024-01-15 14:25',
        createdAt: '2024-01-01',
        expiresAt: null,
        notes: 'Pencere kenarı masa'
      },
      {
        id: 3,
        name: 'Masa 8 - QR Menü',
        type: 'table',
        tableNumber: 8,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://demo.masapp.com/masa/8',
        url: 'https://demo.masapp.com/masa/8',
        description: 'Masa 8 için QR kod menü',
        theme: 'classic',
        isActive: true,
        scanCount: 28,
        lastScanned: '2024-01-15 14:20',
        createdAt: '2024-01-01',
        expiresAt: null,
        notes: 'Köşe masa'
      },
      {
        id: 4,
        name: 'Genel Menü QR',
        type: 'general',
        tableNumber: null,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://demo.masapp.com/menu',
        url: 'https://demo.masapp.com/menu',
        description: 'Genel menü erişimi için QR kod',
        theme: 'minimal',
        isActive: true,
        scanCount: 156,
        lastScanned: '2024-01-15 14:35',
        createdAt: '2024-01-01',
        expiresAt: null,
        notes: 'Giriş kapısında asılı'
      },
      {
        id: 5,
        name: 'Masa 12 - QR Menü',
        type: 'table',
        tableNumber: 12,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://demo.masapp.com/masa/12',
        url: 'https://demo.masapp.com/masa/12',
        description: 'Masa 12 için QR kod menü',
        theme: 'default',
        isActive: false,
        scanCount: 15,
        lastScanned: '2024-01-10 16:45',
        createdAt: '2024-01-01',
        expiresAt: '2024-02-01',
        notes: 'Geçici olarak devre dışı'
      },
      {
        id: 6,
        name: 'Özel Etkinlik QR',
        type: 'event',
        tableNumber: null,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://demo.masapp.com/event/valentine',
        url: 'https://demo.masapp.com/event/valentine',
        description: 'Sevgililer Günü özel menüsü',
        theme: 'romantic',
        isActive: true,
        scanCount: 89,
        lastScanned: '2024-01-14 20:30',
        createdAt: '2024-01-10',
        expiresAt: '2024-02-15',
        notes: 'Sevgililer Günü etkinliği için'
      }
    ];

    setQrCodes(demoQrCodes);
    setFilteredQrCodes(demoQrCodes);
  }, []);

  // Filtreleme ve arama
  useEffect(() => {
    let filtered = [...qrCodes];

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(qr => qr.isActive === (statusFilter === 'active'));
    }

    // Tip filtresi
    if (typeFilter !== 'all') {
      filtered = filtered.filter(qr => qr.type === typeFilter);
    }

    // Arama
    if (searchTerm) {
      filtered = filtered.filter(qr => 
        qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (qr.tableNumber && qr.tableNumber.toString().includes(searchTerm))
      );
    }

    setFilteredQrCodes(filtered);
  }, [qrCodes, statusFilter, typeFilter, searchTerm]);

  const handleLogout = () => {
    logout();
    router.push('/business/login');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'table': return 'bg-blue-100 text-blue-800';
      case 'general': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'table': return 'Masa QR';
      case 'general': return 'Genel QR';
      case 'event': return 'Etkinlik QR';
      case 'custom': return 'Özel QR';
      default: return type;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Aktif' : 'Pasif';
  };

  const getThemeText = (theme: string) => {
    switch (theme) {
      case 'default': return 'Varsayılan';
      case 'modern': return 'Modern';
      case 'classic': return 'Klasik';
      case 'minimal': return 'Minimal';
      case 'romantic': return 'Romantik';
      default: return theme;
    }
  };

  // JSZip'i UMD olarak yükleyen yardımcı
  const loadJSZip = () => {
    return new Promise<any>((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).JSZip) {
        resolve((window as any).JSZip);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
      script.async = true;
      script.onload = () => resolve((window as any).JSZip);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2000);
  };

  const stats = {
    total: qrCodes.length,
    active: qrCodes.filter(qr => qr.isActive).length,
    inactive: qrCodes.filter(qr => !qr.isActive).length,
    tableQrs: qrCodes.filter(qr => qr.type === 'table').length,
    generalQrs: qrCodes.filter(qr => qr.type === 'general').length,
    totalScans: qrCodes.reduce((acc, qr) => acc + qr.scanCount, 0),
    avgScansPerQr: qrCodes.length > 0 ? Math.round(qrCodes.reduce((acc, qr) => acc + qr.scanCount, 0) / qrCodes.length) : 0
  };

  const handleAddQrCode = () => {
    // Form validasyonu
    if (!newQrCode.name.trim()) {
      alert('QR kod adı gereklidir!');
      return;
    }

    if (newQrCode.type === 'table' && !newQrCode.tableNumber) {
      alert('Masa numarası gereklidir!');
      return;
    }

    if (newQrCode.type === 'custom' && !newQrCode.customUrl) {
      alert('Özel URL gereklidir!');
      return;
    }

    // Tema parametrelerini oluştur
    const getThemeParams = (theme: string) => {
      switch (theme) {
        case 'modern':
          return '&bgcolor=FFFFFF&color=000000&format=png&margin=10';
        case 'classic':
          return '&bgcolor=F5F5F5&color=333333&format=png&margin=15';
        case 'minimal':
          return '&bgcolor=FFFFFF&color=000000&format=png&margin=5';
        case 'romantic':
          return '&bgcolor=FFF0F5&color=8B008B&format=png&margin=12';
        default: // default
          return '&bgcolor=FFFFFF&color=000000&format=png&margin=8';
      }
    };

    // Yeni QR kod oluştur
    const baseUrl = newQrCode.type === 'custom' 
      ? newQrCode.customUrl 
      : newQrCode.type === 'table' 
        ? `https://demo.masapp.com/masa/${newQrCode.tableNumber}`
        : 'https://demo.masapp.com/menu';

    const newQr = {
      id: Date.now(), // Basit ID oluşturma
      name: newQrCode.name,
      type: newQrCode.type,
      tableNumber: newQrCode.type === 'table' ? parseInt(newQrCode.tableNumber) : null,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(baseUrl)}${getThemeParams(newQrCode.theme)}`,
      url: baseUrl,
      description: newQrCode.description,
      theme: newQrCode.theme,
      isActive: newQrCode.isActive,
      scanCount: 0,
      lastScanned: null,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: newQrCode.expiresAt || null,
      notes: newQrCode.notes
    };

    // QR kodları listesine ekle
    setQrCodes(prev => [...prev, newQr]);
    
    console.log('Yeni QR kod eklendi:', newQr);
    setShowAddModal(false);
    
    // Formu sıfırla
    setNewQrCode({
      name: '',
      type: 'table',
      tableNumber: '',
      description: '',
      customUrl: '',
      theme: 'default',
      isActive: true,
      expiresAt: '',
      notes: ''
    });
  };

  const handleEditQrCode = (qrCode: any) => {
    setSelectedQrCode({...qrCode}); // Mevcut değerleri kopyala
    setShowEditModal(true);
  };

  const handleUpdateQrCode = () => {
    if (!selectedQrCode?.name?.trim()) {
      alert('QR kod adı gereklidir!');
      return;
    }

    // Tema parametrelerini oluştur
    const getThemeParams = (theme: string) => {
      switch (theme) {
        case 'modern':
          return '&bgcolor=FFFFFF&color=000000&format=png&margin=10';
        case 'classic':
          return '&bgcolor=F5F5F5&color=333333&format=png&margin=15';
        case 'minimal':
          return '&bgcolor=FFFFFF&color=000000&format=png&margin=5';
        case 'romantic':
          return '&bgcolor=FFF0F5&color=8B008B&format=png&margin=12';
        default: // default
          return '&bgcolor=FFFFFF&color=000000&format=png&margin=8';
      }
    };

    // Güncellenmiş QR kod oluştur
    const baseUrl = selectedQrCode.type === 'custom' 
      ? selectedQrCode.customUrl 
      : selectedQrCode.type === 'table' 
        ? `https://demo.masapp.com/masa/${selectedQrCode.tableNumber}`
        : 'https://demo.masapp.com/menu';

    const updatedQrCode = {
      ...selectedQrCode,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(baseUrl)}${getThemeParams(selectedQrCode.theme)}`,
      url: baseUrl
    };

    // QR kodları listesini güncelle
    setQrCodes(prev => prev.map(qr => 
      qr.id === selectedQrCode.id ? updatedQrCode : qr
    ));
    
    console.log('QR kod güncellendi:', updatedQrCode);
    setShowEditModal(false);
    setSelectedQrCode(null);
  };

  const handleDeleteQrCode = (qrId: number) => {
    if (confirm('Bu QR kodu silmek istediğinizden emin misiniz?')) {
      setQrCodes(qrCodes.filter(qr => qr.id !== qrId));
      console.log('QR kod silindi:', qrId);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    console.log('URL kopyalandı:', url);
  };

  const handleDownloadQr = async (qrCode: any) => {
    console.log('QR kod indiriliyor:', qrCode.name);
    try {
      const response = await fetch(qrCode.qrCode, { cache: 'no-store' });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${qrCode.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('QR indirildi');
    } catch (e) {
      console.error('İndirme hatası', e);
      showToast('İndirme başarısız');
    }
  };

  const handleBulkDownload = async () => {
    console.log('Toplu QR kod indiriliyor...');
    const activeQrCodes = qrCodes.filter(qr => qr.isActive);

    if (activeQrCodes.length === 0) {
      alert('İndirilecek aktif QR kod bulunamadı!');
      return;
    }

    // Önce ZIP ile tek dosya halinde indirmeyi dene
    try {
      const JSZip: any = await loadJSZip();
      const zip = new JSZip();

      const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9_-]/g, '_');

      await Promise.all(
        activeQrCodes.map(async (qr) => {
          const response = await fetch(qr.qrCode);
          const blob = await response.blob();
          zip.file(`${sanitize(qr.name)}.png`, blob);
        })
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-kodlari.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('ZIP indirildi');
      return;
    } catch (err) {
      console.warn('ZIP indirme başarısız, tek tek indirmeye geçiliyor...', err);
    }

    // ZIP başarısız olursa: tek tek indirme (mevcut davranış)
    activeQrCodes.forEach((qrCode, index) => {
      setTimeout(() => {
        fetch(qrCode.qrCode)
          .then(r => r.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${qrCode.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          })
          .catch(() => {});
      }, index * 400);
    });
    showToast('İndirme başlatıldı');
  };

  const handlePrintQr = (qrCode: any) => {
    console.log('QR kod yazdırılıyor:', qrCode.name);
    // QR kod yazdırma işlemi
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast.visible && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow z-[60]">
          {toast.message}
        </div>
      )}
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">MasApp</h1>
              <p className="text-purple-200 text-xs sm:text-sm mt-1">Restoran Yönetim Sistemi</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <nav className="mt-4 sm:mt-6">
          <Link href="/business/dashboard" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaChartLine className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Kontrol Paneli</span>
          </Link>
          <Link href="/business/menu" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaUtensils className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Menü Yönetimi</span>
          </Link>
          <Link href="/business/staff" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaUsers className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Personel</span>
          </Link>
          <Link href="/business/qr-codes" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 bg-purple-700 bg-opacity-50 border-l-4 border-white rounded-r-lg mx-2 sm:mx-0">
            <FaQrcode className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">QR Kodlar</span>
          </Link>
          <Link href="/business/reports" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaChartBar className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Raporlar</span>
          </Link>
          <Link href="/business/support" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaHeadset className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Destek</span>
          </Link>
          <Link href="/business/settings" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaCog className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Ayarlar</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button onClick={handleLogout} 
            className="flex items-center justify-between w-full p-2 hover:bg-purple-700 rounded-lg">
            <span className="text-sm">{user?.name}</span>
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-0 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBars className="text-lg text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">QR Kod Yönetimi</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">QR kodlarınızı oluşturun ve yönetin</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={handleBulkDownload}
                className="px-2 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-xs sm:text-sm"
              >
                <FaDownload />
                <span className="hidden sm:inline">Toplu İndir</span>
                <span className="sm:hidden">İndir</span>
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-2 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-xs sm:text-sm"
              >
                <FaPlus />
                <span className="hidden sm:inline">QR Kod Oluştur</span>
                <span className="sm:hidden">Yeni</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6 lg:p-8">
          {/* İstatistik Kartları (mobilde gizli) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaQrcode className="text-xl text-blue-600" />
                </div>
                <span className="text-sm text-blue-600 font-medium">Toplam</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
              <p className="text-sm text-gray-500 mt-1">QR Kod</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaCheckCircle className="text-xl text-green-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">Aktif</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.active}</h3>
              <p className="text-sm text-gray-500 mt-1">QR Kod</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaTable className="text-xl text-blue-600" />
                </div>
                <span className="text-sm text-blue-600 font-medium">Masa QR</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.tableQrs}</h3>
              <p className="text-sm text-gray-500 mt-1">Adet</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaDesktop className="text-xl text-purple-600" />
                </div>
                <span className="text-sm text-purple-600 font-medium">Genel QR</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.generalQrs}</h3>
              <p className="text-sm text-gray-500 mt-1">Adet</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FaEye className="text-xl text-orange-600" />
                </div>
                <span className="text-sm text-orange-600 font-medium">Toplam Tarama</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalScans}</h3>
              <p className="text-sm text-gray-500 mt-1">Kez</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FaChartLine className="text-xl text-yellow-600" />
                </div>
                <span className="text-sm text-yellow-600 font-medium">Ortalama</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.avgScansPerQr}</h3>
              <p className="text-sm text-gray-500 mt-1">Tarama/QR</p>
            </div>
          </div>


          {/* Filtreler ve Arama */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Arama */}
              <div className="lg:col-span-2 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="QR kod adı, açıklama veya masa no ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Durum Filtresi */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>

              {/* Tip Filtresi */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tüm Tipler</option>
                  <option value="table">Masa QR</option>
                  <option value="general">Genel QR</option>
                  <option value="event">Etkinlik QR</option>
                  <option value="custom">Özel QR</option>
                </select>
              </div>
            </div>
          </div>

          {/* QR Kod Listesi */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                QR Kodlar ({filteredQrCodes.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
              {filteredQrCodes.map(qrCode => (
                <div key={qrCode.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  {/* QR Kod Görseli */}
                  <div className="text-center mb-4">
                    <div className="inline-block p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <img 
                        src={qrCode.qrCode} 
                        alt={qrCode.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 mx-auto"
                      />
                    </div>
                  </div>

                  {/* QR Kod Bilgileri */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">{qrCode.name}</h4>
                      <p className="text-sm text-gray-600">{qrCode.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(qrCode.type)}`}>
                        {getTypeText(qrCode.type)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(qrCode.isActive)}`}>
                        {getStatusText(qrCode.isActive)}
                      </span>
                    </div>

                    {qrCode.tableNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaTable className="text-gray-400" />
                        <span>Masa {qrCode.tableNumber}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPalette className="text-gray-400" />
                      <span>Tema: {getThemeText(qrCode.theme)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEye className="text-gray-400" />
                      <span>{qrCode.scanCount} tarama</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaClock className="text-gray-400" />
                      <span>Son: {qrCode.lastScanned}</span>
                    </div>

                    {qrCode.expiresAt && (
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <FaCalendarAlt className="text-orange-400" />
                        <span>Bitiş: {qrCode.expiresAt}</span>
                      </div>
                    )}

                    {qrCode.notes && (
                      <div className="p-2 bg-gray-50 rounded text-sm text-gray-600 italic">
                        {qrCode.notes}
                      </div>
                    )}
                  </div>

                  {/* İşlem Butonları */}
                  <div className="mt-4 grid grid-cols-2 sm:flex gap-2">
                    <button
                      onClick={() => handleCopyUrl(qrCode.url)}
                      className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1 text-xs sm:text-sm"
                      title="URL'yi Kopyala"
                    >
                      <FaCopy />
                      Kopyala
                    </button>
                    <button
                      onClick={() => handleDownloadQr(qrCode)}
                      className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center justify-center gap-1 text-xs sm:text-sm"
                      title="İndir"
                    >
                      <FaDownload />
                      İndir
                    </button>
                    <button
                      onClick={() => handleEditQrCode(qrCode)}
                      className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex items-center justify-center gap-1 text-xs sm:text-sm"
                      title="Düzenle"
                    >
                      <FaEdit />
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteQrCode(qrCode.id)}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-1 text-xs sm:text-sm"
                      title="Sil"
                    >
                      <FaTrash />
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredQrCodes.length === 0 && (
              <div className="text-center py-12">
                <FaQrcode className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">QR kod bulunamadı</p>
                <p className="text-gray-400 text-sm mt-2">Filtreleri değiştirerek tekrar deneyin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Kod Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Yeni QR Kod Oluştur</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Kod Adı *
                  </label>
                  <input
                    type="text"
                    value={newQrCode.name}
                    onChange={(e) => setNewQrCode({...newQrCode, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Örn: Masa 1 - QR Menü"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Kod Tipi *
                  </label>
                  <select
                    value={newQrCode.type}
                    onChange={(e) => setNewQrCode({...newQrCode, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="table">Masa QR</option>
                    <option value="general">Genel QR</option>
                    <option value="event">Etkinlik QR</option>
                    <option value="custom">Özel QR</option>
                  </select>
                </div>

                {newQrCode.type === 'table' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Masa Numarası *
                    </label>
                    <input
                      type="number"
                      value={newQrCode.tableNumber}
                      onChange={(e) => setNewQrCode({...newQrCode, tableNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="1"
                    />
                  </div>
                )}

                {newQrCode.type === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Özel URL *
                    </label>
                    <input
                      type="url"
                      value={newQrCode.customUrl}
                      onChange={(e) => setNewQrCode({...newQrCode, customUrl: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={newQrCode.description}
                    onChange={(e) => setNewQrCode({...newQrCode, description: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="QR kod hakkında açıklama..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tema
                    </label>
                    <select
                      value={newQrCode.theme}
                      onChange={(e) => setNewQrCode({...newQrCode, theme: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="default">Varsayılan (Beyaz arka plan, siyah QR)</option>
                      <option value="modern">Modern (Temiz görünüm, 10px kenar boşluğu)</option>
                      <option value="classic">Klasik (Gri arka plan, 15px kenar boşluğu)</option>
                      <option value="minimal">Minimal (Sade görünüm, 5px kenar boşluğu)</option>
                      <option value="romantic">Romantik (Pembe arka plan, mor QR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={newQrCode.expiresAt}
                      onChange={(e) => setNewQrCode({...newQrCode, expiresAt: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newQrCode.isActive}
                    onChange={(e) => setNewQrCode({...newQrCode, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Aktif
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notlar
                  </label>
                  <textarea
                    value={newQrCode.notes}
                    onChange={(e) => setNewQrCode({...newQrCode, notes: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="QR kod hakkında notlar..."
                  />
                </div>

                <button
                  onClick={handleAddQrCode}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <FaQrcode />
                  QR Kod Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Kod Düzenleme Modal */}
      {showEditModal && selectedQrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">QR Kod Düzenle</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Kod Adı *
                  </label>
                  <input
                    type="text"
                    value={selectedQrCode.name}
                    onChange={(e) => setSelectedQrCode({...selectedQrCode, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={selectedQrCode.description}
                    onChange={(e) => setSelectedQrCode({...selectedQrCode, description: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tema
                    </label>
                    <select
                      value={selectedQrCode.theme}
                      onChange={(e) => setSelectedQrCode({...selectedQrCode, theme: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="default">Varsayılan (Beyaz arka plan, siyah QR)</option>
                      <option value="modern">Modern (Temiz görünüm, 10px kenar boşluğu)</option>
                      <option value="classic">Klasik (Gri arka plan, 15px kenar boşluğu)</option>
                      <option value="minimal">Minimal (Sade görünüm, 5px kenar boşluğu)</option>
                      <option value="romantic">Romantik (Pembe arka plan, mor QR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={selectedQrCode.expiresAt || ''}
                      onChange={(e) => setSelectedQrCode({...selectedQrCode, expiresAt: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActiveEdit"
                    checked={selectedQrCode.isActive}
                    onChange={(e) => setSelectedQrCode({...selectedQrCode, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isActiveEdit" className="ml-2 text-sm text-gray-700">
                    Aktif
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notlar
                  </label>
                  <textarea
                    value={selectedQrCode.notes}
                    onChange={(e) => setSelectedQrCode({...selectedQrCode, notes: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleUpdateQrCode}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    Güncelle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

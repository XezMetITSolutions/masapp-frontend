'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaStore, 
  FaUtensils, 
  FaUsers, 
  FaShoppingCart,
  FaChartLine,
  FaChartBar,
  FaQrcode,
  FaHeadset,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';

export default function ReportsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'revenue' | 'hours'>('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const handleLogout = () => {
    logout();
    router.push('/business/login');
  };

  // SheetJS yükleyici (UMD)
  const loadXLSX = () => {
    return new Promise<any>((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).XLSX) {
        resolve((window as any).XLSX);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      script.async = true;
      script.onload = () => resolve((window as any).XLSX);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  // Excel indirme (gerçek .xlsx)
  const handleExcelExport = async () => {
    const XLSX: any = await loadXLSX();
    const wb = XLSX.utils.book_new();
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (activeTab === 'overview') {
      const rows = [
        ['Metrik', 'Değer'],
        ['Bugünkü Ciro (TRY)', currentDailyReport.totalSales],
        ['Toplam Sipariş', currentDailyReport.totalOrders],
        ['Ortalama Sipariş (TRY)', currentDailyReport.averageOrderValue],
        ['Aktif Masa', currentDailyReport.totalTables],
        ['Ortalama Masa Süresi (dk)', currentDailyReport.averageTableTime]
      ];
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Genel Bakış');
    }

    if (activeTab === 'products') {
      const rows = [
        ['Ürün', 'Adet', 'Toplam (TRY)', 'Sipariş', 'Birim Fiyat (TRY)'],
        ...topProducts.map(p => [
          p.productName,
          p.totalQuantity,
          p.totalRevenue,
          p.orderCount,
          (p.totalRevenue / p.totalQuantity).toFixed(2)
        ])
      ];
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Ürünler');
    }

    if (activeTab === 'revenue') {
      const dailyWs = XLSX.utils.aoa_to_sheet([
        ['Tarih', 'Ciro (TRY)', 'Sipariş'],
        ...dailyTrend.map(d => [d.date, d.revenue, d.orders])
      ]);
      XLSX.utils.book_append_sheet(wb, dailyWs, 'Günlük Trend');

      const weeklyWs = XLSX.utils.aoa_to_sheet([
        ['Hafta', 'Ciro (TRY)', 'Sipariş'],
        ...weeklyTrend.map(w => [w.week, w.revenue, w.orders])
      ]);
      XLSX.utils.book_append_sheet(wb, weeklyWs, 'Haftalık');

      const monthlyWs = XLSX.utils.aoa_to_sheet([
        ['Ay', 'Ciro (TRY)', 'Sipariş'],
        ...monthlyTrend.map(m => [m.month, m.revenue, m.orders])
      ]);
      XLSX.utils.book_append_sheet(wb, monthlyWs, 'Aylık');
    }

    if (activeTab === 'hours') {
      const ws = XLSX.utils.aoa_to_sheet([
        ['Saat Aralığı', 'Sipariş'],
        ['12:00-13:00', 45],
        ['19:00-20:00', 38],
        ['20:00-21:00', 32]
      ]);
      XLSX.utils.book_append_sheet(wb, ws, 'Yoğun Saatler');
    }

    const arr = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `masapp-rapor-${activeTab}-${currentDate}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Yazdırma fonksiyonu
  const handlePrint = () => {
    const printContent = document.getElementById('report-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>MasApp Rapor - ${activeTab}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
                .metric-title { font-weight: bold; color: #333; }
                .metric-value { font-size: 18px; color: #2563eb; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .print-date { text-align: right; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>MasApp İşletme Raporu</h1>
                <p>Rapor Türü: ${activeTab === 'overview' ? 'Genel Bakış' : 
                  activeTab === 'products' ? 'Ürün Performansı' : 
                  activeTab === 'revenue' ? 'Ciro Analizi' : 'Saat Analizi'}</p>
                <div class="print-date">Yazdırma Tarihi: ${new Date().toLocaleString('tr-TR')}</div>
              </div>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };
  
  // Demo veriler - Gerçekçi restoran verileri
  const currentDailyReport = {
    totalSales: 2450.50,
    totalOrders: 28,
    averageOrderValue: 87.50,
    totalTables: 12,
    averageTableTime: 45
  };

  // Günlük/Haftalık/Aylık Ciro Verileri
  const revenueData = {
    daily: {
      today: 2450.50,
      yesterday: 2180.30,
      change: 12.4
    },
    weekly: {
      thisWeek: 16850.75,
      lastWeek: 15230.40,
      change: 10.6
    },
    monthly: {
      thisMonth: 67850.25,
      lastMonth: 61200.80,
      change: 10.8
    }
  };

  // Günlük ciro trendi (son 7 gün)
  const dailyTrend = [
    { date: '2024-01-15', revenue: 2180.30, orders: 24 },
    { date: '2024-01-16', revenue: 2450.50, orders: 28 },
    { date: '2024-01-17', revenue: 1920.75, orders: 22 },
    { date: '2024-01-18', revenue: 2680.40, orders: 31 },
    { date: '2024-01-19', revenue: 3120.60, orders: 35 },
    { date: '2024-01-20', revenue: 2890.25, orders: 33 },
    { date: '2024-01-21', revenue: 2450.50, orders: 28 }
  ];

  // Mobilde bar genişliklerini orantılamak için maksimum ciro
  const maxDailyRevenue = Math.max(...dailyTrend.map(d => d.revenue));

  // Haftalık ciro trendi (son 4 hafta)
  const weeklyTrend = [
    { week: '1. Hafta', revenue: 15230.40, orders: 168 },
    { week: '2. Hafta', revenue: 16850.75, orders: 185 },
    { week: '3. Hafta', revenue: 14200.60, orders: 156 },
    { week: '4. Hafta', revenue: 16850.75, orders: 185 }
  ];

  // Aylık ciro trendi (son 6 ay)
  const monthlyTrend = [
    { month: 'Ağustos', revenue: 58200.80, orders: 642 },
    { month: 'Eylül', revenue: 61200.80, orders: 675 },
    { month: 'Ekim', revenue: 67850.25, orders: 748 },
    { month: 'Kasım', revenue: 64500.60, orders: 712 },
    { month: 'Aralık', revenue: 67850.25, orders: 748 },
    { month: 'Ocak', revenue: 67850.25, orders: 748 }
  ];

  const topProducts = [
    { productId: '1', productName: 'Izgara Köfte', totalQuantity: 15, totalRevenue: 1800, orderCount: 12 },
    { productId: '2', productName: 'Çoban Salata', totalQuantity: 22, totalRevenue: 770, orderCount: 18 },
    { productId: '3', productName: 'Humus', totalQuantity: 18, totalRevenue: 810, orderCount: 15 }
  ];

  // Saatlik satışları, sayfadaki günlük örnek verilerle tutarlı olacak şekilde dağıt
  // En yoğun saatler: 12-13 ve 19-21 arası olacak şekilde ağırlıklar
  const baseHourRatios = [0.03, 0.04, 0.06, 0.07, 0.09, 0.10, 0.12, 0.16, 0.12, 0.09, 0.07, 0.05];
  const selectedDaily = dailyTrend[dailyTrend.length - 1];
  const targetOrders = selectedDaily?.orders || 0;
  let hourlySales = baseHourRatios.map(r => Math.round(r * targetOrders));
  // Toplamı hedefe eşitle (yuvarlama farkını dağıt)
  const diff = targetOrders - hourlySales.reduce((a, b) => a + b, 0);
  if (diff !== 0) {
    const step = diff > 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(diff); i++) {
      const idx = (7 + i) % hourlySales.length; // yoğun saatlere öncelik ver
      hourlySales[idx] = Math.max(0, hourlySales[idx] + step);
    }
  }
  const maxHourly = Math.max(0, ...hourlySales);
  const hourLabels = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);
  const profitableHours = new Set([12, 19, 20]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}s ${mins}dk` : `${mins}dk`;
  };


  return (
    <div className="min-h-screen bg-gray-50">
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
          <Link href="/business/qr-codes" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaQrcode className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">QR Kodlar</span>
          </Link>
          <Link href="/business/reports" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 bg-purple-700 bg-opacity-50 border-l-4 border-white rounded-r-lg mx-2 sm:mx-0">
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
          <div className="border-t border-purple-700 pt-4">
          <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">MasApp</p>
                <p className="text-xs text-purple-300">info@masapp.com</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
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
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">Raporlar</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">İşletme performans analizi ve raporları</p>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button 
                onClick={handleExcelExport}
                className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
              >
                📥 <span className="hidden sm:inline">Excel İndir</span>
                <span className="sm:hidden">Excel</span>
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm"
              >
                🖨️ <span className="hidden sm:inline">Yazdır</span>
                <span className="sm:hidden">Yazdır</span>
              </button>
            </div>
          </div>
        </header>

        <div id="report-content" className="p-3 sm:p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-flex whitespace-nowrap space-x-1 bg-gray-100 p-1 rounded-lg min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📊 Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === 'products' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🍽️ Ürün Performansı
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === 'revenue' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💰 Ciro Analizi
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === 'hours' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ⏰ Saat Analizi
            </button>
            </div>
          </div>
        </div>

        {/* Date Selectors */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTab === 'overview' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bugün ({new Date().toLocaleDateString('tr-TR')})
              </label>
              <div className="text-sm text-gray-500">
                Günlük performans özeti
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Genel Bakış */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Ana Metrikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bugünkü Ciro</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(currentDailyReport?.totalSales || 0)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600">📈 +12% dün</span>
                    </div>
                  </div>
                  <span className="text-green-600 text-2xl">💰</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentDailyReport?.totalOrders || 0}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600">📈 +8% dün</span>
                    </div>
                  </div>
                  <span className="text-blue-600 text-2xl">🛒</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(currentDailyReport?.averageOrderValue || 0)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600">📈 +5% dün</span>
                    </div>
                  </div>
                  <span className="text-purple-600 text-2xl">📊</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktif Masa</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {currentDailyReport?.totalTables || 0}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-600">👁️ Şu anda</span>
                    </div>
                  </div>
                  <span className="text-orange-600 text-2xl">🪑</span>
                </div>
              </div>
            </div>

            {/* Hızlı İstatistikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* En Çok Satan Ürünler */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🏆 En Çok Satan Ürünler
                </h3>
                <div className="space-y-3">
                  {topProducts.slice(0, 3).map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{product.productName}</p>
                          <p className="text-xs text-gray-600">{product.totalQuantity} adet</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(product.totalRevenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Masa Performansı */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  ⏰ Masa Performansı
                </h3>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatTime(currentDailyReport?.averageTableTime || 0)}
                  </div>
                  <p className="text-gray-600 text-sm">Ortalama Masa Süresi</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-600 font-bold">En Hızlı</p>
                      <p className="text-xs text-gray-600">25 dk</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-red-600 font-bold">En Yavaş</p>
                      <p className="text-xs text-gray-600">1s 15dk</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ürün Analizi */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  🏆 En Çok Satan Ürünler
                </h3>
              </div>
              
              <div className="p-6">
                {topProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Bu tarih aralığında veri bulunamadı.</p>
                ) : (
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.productId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        <div>
                            <h4 className="font-medium text-gray-800">{product.productName}</h4>
                            <p className="text-sm text-gray-600">
                              {product.totalQuantity} adet • {product.orderCount} sipariş
                            </p>
                          </div>
                        </div>
                                <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(product.totalRevenue)}</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(product.totalRevenue / product.totalQuantity)} / adet
                          </p>
                                </div>
                              </div>
                            ))}
                          </div>
                )}
                          </div>
                        </div>
                      </div>
                    )}

        {/* Ciro Analizi */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* Ana Ciro Metrikleri */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Günlük Ciro</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(revenueData.daily.today)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600">📈 +{revenueData.daily.change}% dün</span>
                    </div>
                  </div>
                  <span className="text-green-600 text-2xl">💰</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Haftalık Ciro</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(revenueData.weekly.thisWeek)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600">📈 +{revenueData.weekly.change}% geçen hafta</span>
                    </div>
                  </div>
                  <span className="text-blue-600 text-2xl">📊</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aylık Ciro</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(revenueData.monthly.thisMonth)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600">📈 +{revenueData.monthly.change}% geçen ay</span>
                    </div>
                  </div>
                  <span className="text-purple-600 text-2xl">📈</span>
                </div>
              </div>
            </div>

            {/* Günlük Ciro Trendi */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  📈 Günlük Ciro Trendi (Son 7 Gün)
                </h3>
                </div>
              <div className="p-6">
                {/* Mobil: dikey şema (satır bazlı barlar) */}
                <div className="sm:hidden space-y-3">
                  {dailyTrend.map((day, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 shrink-0 text-xs font-medium text-gray-600 text-right">
                        {new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                      </div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500/80"
                            style={{ width: `${Math.max(8, Math.round((day.revenue / maxDailyRevenue) * 100))}%` }}
                          />
                        </div>
                        <div className="mt-1 flex justify-between text-[11px] text-gray-600">
                          <span className="font-semibold text-green-600">{formatCurrency(day.revenue)}</span>
                          <span>{day.orders} sipariş</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tablet/Masaüstü: responsive ızgara */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4">
                  {dailyTrend.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-600 mb-2">
                          {new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold text-green-600 mb-1">
                          {formatCurrency(day.revenue)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {day.orders} sipariş
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                </div>

            {/* Haftalık ve Aylık Karşılaştırma */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Haftalık Trend */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    📊 Haftalık Ciro Karşılaştırması
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {weeklyTrend.map((week, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{week.week}</p>
                          <p className="text-sm text-gray-600">{week.orders} sipariş</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(week.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aylık Trend */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    📈 Aylık Ciro Karşılaştırması
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {monthlyTrend.map((month, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{month.month}</p>
                          <p className="text-sm text-gray-600">{month.orders} sipariş</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(month.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

        {/* Saat Analizi */}
        {activeTab === 'hours' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  ⏰ Saatlik Performans Analizi
                </h3>
              </div>
              <div className="p-6">
                {/* Özet analiz kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">En Yoğun Saatler</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><span className="text-sm">12:00 - 13:00</span><span className="text-sm font-bold text-blue-600">45 sipariş</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm">19:00 - 20:00</span><span className="text-sm font-bold text-blue-600">38 sipariş</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm">20:00 - 21:00</span><span className="text-sm font-bold text-blue-600">32 sipariş</span></div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">En Karlı Saatler</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><span className="text-sm">19:00 - 20:00</span><span className="text-sm font-bold text-green-600">₺2,450</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm">20:00 - 21:00</span><span className="text-sm font-bold text-green-600">₺2,180</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm">12:00 - 13:00</span><span className="text-sm font-bold text-green-600">₺1,890</span></div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-3">Masa Süreleri</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><span className="text-sm">Öğle (12-15)</span><span className="text-sm font-bold text-purple-600">35 dk</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm">Akşam (18-22)</span><span className="text-sm font-bold text-purple-600">65 dk</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm">Gece (22-24)</span><span className="text-sm font-bold text-purple-600">45 dk</span></div>
                    </div>
                  </div>
                </div>

                {/* Tek bir grafik: saatlik yoğunluk + kârlı saat vurgusu */}
                <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <div className="flex items-end gap-2 h-56 min-w-[640px] sm:min-w-0">
                    {hourlySales.map((val, idx) => {
                      const pct = maxHourly === 0 ? 0 : Math.round((val / maxHourly) * 100);
                      const height = val === 0 ? 2 : Math.max(12, pct);
                      const hour = idx + 8;
                      const isProfit = profitableHours.has(hour);
                      return (
                        <div key={idx} className="flex flex-col items-center w-10 sm:w-12 h-full">
                          <div
                            className={`w-full rounded-t ${isProfit ? 'bg-green-500' : 'bg-blue-500'} hover:opacity-90 transition-opacity`}
                            style={{ height: `${height}%` }}
                            title={`${hourLabels[idx]} - ${val} sipariş`}
                          />
                          <span className="mt-2 text-[10px] sm:text-xs text-gray-700 select-none">{hourLabels[idx]}</span>
                          {isProfit && <span className="text-[10px] sm:text-xs text-green-600 font-semibold">kârlı</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-blue-500 rounded-sm"></span> Sipariş yoğunluğu</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-green-500 rounded-sm"></span> En kârlı saatler</div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

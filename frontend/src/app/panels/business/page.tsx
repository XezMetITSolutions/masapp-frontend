'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaBuilding,
  FaChartLine,
  FaUsers,
  FaUtensils,
  FaDollarSign,
  FaShoppingCart,
  FaQrcode,
  FaArrowLeft,
  FaHome,
  FaExclamationCircle,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaEdit,
  FaPlus,
  FaBell,
  FaCalendar,
  FaArrowUp,
  FaArrowDown,
  FaPercent,
  FaStore,
  FaClipboardList,
  FaCog,
  FaHeadset,
  FaBullhorn,
  FaBars
} from 'react-icons/fa';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import TranslatedText from '@/components/TranslatedText';

export default function DemoBusinessPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Demo işletme verileri - gerçekçi veriler
  const demoStats = {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    activeTables: 0,
    totalCustomers: 0,
    menuItems: 0,
    categories: 0,
    activeOrders: [],
    popularItems: [],
    monthlyRevenue: 0,
    monthlyOrders: 0,
    averageRating: '-',
    customerSatisfaction: '-'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'preparing': return 'Hazırlanıyor';
      case 'ready': return 'Hazır';
      default: return status;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/panels" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaArrowLeft />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                  <FaUtensils size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">MasApp</h1>
                  <p className="text-gray-600 text-sm">Demo Restoran - Yönetim Paneli</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaHome />
              </Link>
              <div className="text-right">
                <p className="text-sm text-gray-600">info@masapp.com</p>
                <p className="text-xs text-gray-500">Demo Versiyonu</p>
              </div>
            </div>
          </div>
        </header>

        {/* Demo Uyarısı */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                🎭 Bu demo versiyondur. Tüm veriler örnek verilerdir ve gerçek işlemler yapılmaz.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar ve Ana İçerik */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Menü</h2>
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaStore className="text-blue-600" />
                  Kontrol Paneli
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaUsers className="text-green-600" />
                  Personel
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaCog className="text-purple-600" />
                  Ayarlar
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaHeadset className="text-orange-600" />
                  Destek
                </button>
              </nav>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="flex-1 p-6">
            {/* Hoş Geldin Bölümü */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Hoş geldiniz, Kullanıcı 👋</h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Premium Plan
                </span>
                <span className="text-2xl">P</span>
              </div>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bugünkü Siparişler</p>
                    <p className="text-2xl font-bold text-gray-800">{demoStats.totalOrders}</p>
                  </div>
                  <FaShoppingCart className="text-3xl text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bugünkü Ciro</p>
                    <p className="text-2xl font-bold text-gray-800">₺{demoStats.totalRevenue}</p>
                  </div>
                  <FaDollarSign className="text-3xl text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Menü Ürünleri</p>
                    <p className="text-2xl font-bold text-gray-800">{demoStats.menuItems}</p>
                    <p className="text-xs text-gray-500">{demoStats.categories} kategori</p>
                  </div>
                  <FaUtensils className="text-3xl text-orange-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Toplam Masa</p>
                    <p className="text-2xl font-bold text-gray-800">{demoStats.activeTables}</p>
                    <p className="text-xs text-gray-500">0 aktif</p>
                  </div>
                  <FaBuilding className="text-3xl text-purple-600" />
                </div>
              </div>
            </div>

            {/* Alt Bölümler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Aktif Siparişler */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Aktif Siparişler</h3>
                    <button className="text-blue-600 text-sm hover:text-blue-800">
                      Tümünü Gör →
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-center py-8 text-gray-500">
                    <FaShoppingCart className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p>Henüz aktif sipariş bulunmuyor</p>
                  </div>
                </div>
              </div>

              {/* Hızlı İşlemler */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">Hızlı İşlemler</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaPlus className="text-blue-600" />
                      <span className="text-sm font-medium">Yeni Ürün</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaEye className="text-green-600" />
                      <span className="text-sm font-medium">Siparişleri Gör</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaEdit className="text-orange-600" />
                      <span className="text-sm font-medium">Menüyü Düzenle</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaBullhorn className="text-purple-600" />
                      <span className="text-sm font-medium">Duyurular</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Aylık Performans */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Aylık Performans</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <FaChartLine className="text-4xl mx-auto mb-3 text-gray-300" />
                  <p className="mb-4">Henüz veri bulunmuyor</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">₺{demoStats.monthlyRevenue}</p>
                    <p className="text-sm text-gray-600">Aylık Ciro</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{demoStats.monthlyOrders}</p>
                    <p className="text-sm text-gray-600">Toplam Sipariş</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{demoStats.averageRating}</p>
                    <p className="text-sm text-gray-600">Ortalama Puan</p>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">{demoStats.customerSatisfaction}</p>
                  <p className="text-sm text-gray-600">Müşteri Memnuniyeti</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Language Selector - Fixed Position */}
        <div className="fixed top-6 right-6 z-50">
          <LanguageSelector />
        </div>
      </div>
    </LanguageProvider>
  );
}

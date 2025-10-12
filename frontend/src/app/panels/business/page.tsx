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
  FaTrendingUp,
  FaTrendingDown,
  FaPercent
} from 'react-icons/fa';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import TranslatedText from '@/components/TranslatedText';

export default function DemoBusinessPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  // Demo işletme verileri
  const demoStats = {
    totalRevenue: 12450,
    totalOrders: 156,
    averageOrderValue: 80,
    activeTables: 12,
    totalCustomers: 89,
    menuItems: 24,
    popularItems: [
      { name: 'Adana Kebap', sales: 45, revenue: 2025 },
      { name: 'Lahmacun', sales: 38, revenue: 950 },
      { name: 'Döner', sales: 32, revenue: 1120 },
      { name: 'Mantı', sales: 28, revenue: 1120 },
      { name: 'Pide', sales: 25, revenue: 750 }
    ],
    recentOrders: [
      { id: 'demo_order_1', table: 5, amount: 95, time: '14:30', status: 'completed' },
      { id: 'demo_order_2', table: 12, amount: 47, time: '14:25', status: 'preparing' },
      { id: 'demo_order_3', table: 3, amount: 120, time: '14:20', status: 'ready' },
      { id: 'demo_order_4', table: 7, amount: 132, time: '14:15', status: 'completed' },
      { id: 'demo_order_5', table: 9, amount: 55, time: '14:10', status: 'preparing' }
    ],
    hourlyStats: [
      { hour: '10:00', orders: 8, revenue: 640 },
      { hour: '11:00', orders: 12, revenue: 960 },
      { hour: '12:00', orders: 18, revenue: 1440 },
      { hour: '13:00', orders: 22, revenue: 1760 },
      { hour: '14:00', orders: 16, revenue: 1280 },
      { hour: '15:00', orders: 10, revenue: 800 }
    ],
    customerFeedback: [
      { rating: 5, count: 45, percentage: 65 },
      { rating: 4, count: 18, percentage: 26 },
      { rating: 3, count: 4, percentage: 6 },
      { rating: 2, count: 2, percentage: 3 },
      { rating: 1, count: 0, percentage: 0 }
    ]
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
        <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/panels" className="p-2 hover:bg-purple-700 rounded-lg transition-colors">
                <FaArrowLeft />
              </Link>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <FaBuilding />
                  Demo Restoran - İşletme Paneli
                </h1>
                <p className="text-purple-200 text-sm">MasApp Demo Versiyonu</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-purple-700 rounded-lg transition-colors">
                <FaHome />
              </Link>
              <div className="flex items-center gap-2 bg-purple-700 px-3 py-1 rounded-lg">
                <FaCalendar className="text-yellow-300" />
                <select 
                  value={selectedTimeRange} 
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="bg-transparent text-white text-sm border-none outline-none"
                >
                  <option value="today">Bugün</option>
                  <option value="week">Bu Hafta</option>
                  <option value="month">Bu Ay</option>
                </select>
              </div>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="px-4 py-2 bg-black bg-opacity-20 grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold">₺{demoStats.totalRevenue}</p>
              <p className="text-xs text-purple-200">Toplam Ciro</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{demoStats.totalOrders}</p>
              <p className="text-xs text-purple-200">Toplam Sipariş</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{demoStats.activeTables}</p>
              <p className="text-xs text-purple-200">Aktif Masa</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{demoStats.totalCustomers}</p>
              <p className="text-xs text-purple-200">Müşteri</p>
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

        {/* Tab Navigation */}
        <div className="bg-white shadow-sm">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Analitik
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'menu'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Menü Yönetimi
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Müşteri Analizi
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Özet Kartlar */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <FaDollarSign className="text-green-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Günlük Ciro</p>
                      <p className="text-2xl font-bold text-gray-900">₺{demoStats.totalRevenue}</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <FaTrendingUp className="mr-1" />
                        +12.5%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaShoppingCart className="text-blue-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Sipariş Sayısı</p>
                      <p className="text-2xl font-bold text-gray-900">{demoStats.totalOrders}</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <FaTrendingUp className="mr-1" />
                        +8.2%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <FaUsers className="text-purple-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ortalama Sepet</p>
                      <p className="text-2xl font-bold text-gray-900">₺{demoStats.averageOrderValue}</p>
                      <p className="text-sm text-red-600 flex items-center">
                        <FaTrendingDown className="mr-1" />
                        -2.1%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <FaUtensils className="text-orange-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aktif Masa</p>
                      <p className="text-2xl font-bold text-gray-900">{demoStats.activeTables}</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <FaTrendingUp className="mr-1" />
                        +3.0%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Son Siparişler ve Popüler Ürünler */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Son Siparişler */}
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FaClock />
                      Son Siparişler
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {demoStats.recentOrders.map(order => (
                        <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-bold">{order.table}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Masa {order.table}</p>
                              <p className="text-sm text-gray-600">{order.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₺{order.amount}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popüler Ürünler */}
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FaTrendingUp />
                      Popüler Ürünler
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {demoStats.popularItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-bold text-sm">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.sales} satış</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₺{item.revenue}</p>
                            <p className="text-sm text-green-600">+{Math.floor(Math.random() * 20) + 5}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Saatlik Satış Grafiği */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Saatlik Satış Analizi</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {demoStats.hourlyStats.map((stat, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-gray-600">{stat.hour}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{stat.orders} sipariş</span>
                            <span>₺{stat.revenue}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{width: `${(stat.revenue / Math.max(...demoStats.hourlyStats.map(s => s.revenue))) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performans Metrikleri */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Dönüşüm Oranı</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
                    <p className="text-sm text-gray-600">Müşteri Dönüşümü</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Ortalama Bekleme</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">12dk</div>
                    <p className="text-sm text-gray-600">Sipariş Hazırlama</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Memnuniyeti</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">4.7/5</div>
                    <p className="text-sm text-gray-600">Ortalama Puan</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Menü Yönetimi</h3>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <FaPlus />
                    Yeni Ürün Ekle
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demoStats.popularItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-sm text-gray-500">#{index + 1}</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Satış:</span>
                            <span className="font-medium">{item.sales}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ciro:</span>
                            <span className="font-medium">₺{item.revenue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Durum:</span>
                            <span className="text-green-600 font-medium">Aktif</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded text-sm hover:bg-blue-100 flex items-center justify-center gap-1">
                            <FaEye />
                            Görüntüle
                          </button>
                          <button className="flex-1 bg-green-50 text-green-600 py-2 rounded text-sm hover:bg-green-100 flex items-center justify-center gap-1">
                            <FaEdit />
                            Düzenle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* Müşteri Memnuniyeti */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Müşteri Değerlendirmeleri</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {demoStats.customerFeedback.map((feedback, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-medium text-gray-600">
                          {feedback.rating} ⭐
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{feedback.count} değerlendirme</span>
                            <span>{feedback.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{width: `${feedback.percentage}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Müşteri Segmentasyonu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Türleri</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Yeni Müşteri</span>
                      <span className="font-bold text-blue-600">32%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Düzenli Müşteri</span>
                      <span className="font-bold text-green-600">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">VIP Müşteri</span>
                      <span className="font-bold text-purple-600">23%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Davranışları</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ortalama Ziyaret</span>
                      <span className="font-bold text-gray-900">2.3 kez/ay</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">En Çok Gelen Gün</span>
                      <span className="font-bold text-gray-900">Cumartesi</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">En Çok Gelen Saat</span>
                      <span className="font-bold text-gray-900">13:00-14:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language Selector - Fixed Position */}
        <div className="fixed top-6 right-6 z-50">
          <LanguageSelector />
        </div>
      </div>
    </LanguageProvider>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaUsers, 
  FaStore, 
  FaMoneyBillWave, 
  FaClock, 
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaSync
} from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(false);

  const analyticsData = {
    overview: {
      totalRevenue: 2450000,
      totalOrders: 15432,
      totalUsers: 12890,
      totalRestaurants: 1247,
      revenueGrowth: 15.3,
      ordersGrowth: 8.2,
      usersGrowth: 12.5,
      restaurantsGrowth: 12.0
    },
    revenue: {
      daily: [
        { date: '2024-01-01', amount: 45000 },
        { date: '2024-01-02', amount: 52000 },
        { date: '2024-01-03', amount: 48000 },
        { date: '2024-01-04', amount: 61000 },
        { date: '2024-01-05', amount: 55000 },
        { date: '2024-01-06', amount: 67000 },
        { date: '2024-01-07', amount: 72000 }
      ],
      monthly: [
        { month: 'Ocak', amount: 1450000 },
        { month: 'Şubat', amount: 1580000 },
        { month: 'Mart', amount: 1620000 },
        { month: 'Nisan', amount: 1750000 },
        { month: 'Mayıs', amount: 1890000 },
        { month: 'Haziran', amount: 2100000 },
        { month: 'Temmuz', amount: 2450000 }
      ]
    },
    topRestaurants: [
      { name: 'Lezzet Durağı', orders: 1250, revenue: 45000, growth: 12.5 },
      { name: 'Pizza Palace', orders: 980, revenue: 32000, growth: 8.3 },
      { name: 'Cafe Central', orders: 750, revenue: 28000, growth: 15.2 },
      { name: 'Burger House', orders: 650, revenue: 25000, growth: 5.7 },
      { name: 'Sushi Bar', orders: 580, revenue: 22000, growth: 18.9 }
    ],
    userMetrics: {
      newUsers: 1250,
      activeUsers: 12890,
      retentionRate: 78.5,
      avgSessionTime: 12.5,
      conversionRate: 15.8
    },
    orderMetrics: {
      avgOrderValue: 158.75,
      peakHours: ['12:00-13:00', '19:00-20:00'],
      popularItems: [
        { name: 'Adana Kebap', orders: 1250, revenue: 56250 },
        { name: 'Pizza Margherita', orders: 980, revenue: 39200 },
        { name: 'Döner', orders: 850, revenue: 29750 },
        { name: 'Lahmacun', orders: 750, revenue: 18750 }
      ]
    }
  };

  const timeRanges = [
    { value: '7d', label: 'Son 7 Gün' },
    { value: '30d', label: 'Son 30 Gün' },
    { value: '90d', label: 'Son 90 Gün' },
    { value: '1y', label: 'Son 1 Yıl' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Gelir', icon: FaMoneyBillWave, color: 'text-green-600' },
    { value: 'orders', label: 'Siparişler', icon: FaChartBar, color: 'text-blue-600' },
    { value: 'users', label: 'Kullanıcılar', icon: FaUsers, color: 'text-purple-600' },
    { value: 'restaurants', label: 'Restoranlar', icon: FaStore, color: 'text-orange-600' }
  ];

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? FaArrowUp : FaArrowDown;
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <AdminLayout 
      title="Gelişmiş Analitik" 
      description="Detaylı sistem analizi ve performans metrikleri"
    >
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Zaman Aralığı:</span>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaDownload className="text-sm" />
              Rapor İndir
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <FaSync className="text-sm" />
              Yenile
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const data = analyticsData.overview[`total${metric.label.charAt(0).toUpperCase() + metric.label.slice(1)}` as keyof typeof analyticsData.overview];
          const growth = analyticsData.overview[`${metric.value}Growth` as keyof typeof analyticsData.overview] as number;
          const GrowthIcon = getGrowthIcon(growth);
          
          return (
            <div key={metric.value} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-100 ${metric.color}`}>
                  <Icon className="text-2xl" />
                </div>
                <div className={`flex items-center gap-1 ${getGrowthColor(growth)}`}>
                  <GrowthIcon className="text-sm" />
                  <span className="text-sm font-medium">{Math.abs(growth)}%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {typeof data === 'number' ? data.toLocaleString() : data}
                </p>
                <p className="text-sm text-gray-600 mt-1">Toplam {metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Gelir Trendi</h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <FaChartLine className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Grafik burada görüntülenecek</p>
                <p className="text-sm text-gray-400 mt-2">Chart.js veya Recharts entegrasyonu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sipariş Dağılımı</h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <FaChartPie className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Pasta grafiği burada görüntülenecek</p>
                <p className="text-sm text-gray-400 mt-2">Chart.js veya Recharts entegrasyonu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Restaurants */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">En Başarılı Restoranlar</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.topRestaurants.map((restaurant, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{restaurant.name}</h4>
                    <p className="text-sm text-gray-500">{restaurant.orders} sipariş</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₺{restaurant.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    <FaArrowUp className="text-green-600 text-sm" />
                    <span className="text-sm text-green-600">+{restaurant.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUsers className="text-blue-600 text-2xl" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.userMetrics.newUsers}</p>
          <p className="text-sm text-gray-600">Yeni Kullanıcılar</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartLine className="text-green-600 text-2xl" />
          </div>
          <p className="text-2xl font-bold text-gray-900">%{analyticsData.userMetrics.retentionRate}</p>
          <p className="text-sm text-gray-600">Geri Dönüş Oranı</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaClock className="text-purple-600 text-2xl" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.userMetrics.avgSessionTime}dk</p>
          <p className="text-sm text-gray-600">Ortalama Oturum</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartBar className="text-orange-600 text-2xl" />
          </div>
          <p className="text-2xl font-bold text-gray-900">%{analyticsData.userMetrics.conversionRate}</p>
          <p className="text-sm text-gray-600">Dönüşüm Oranı</p>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Popüler Ürünler</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.orderMetrics.popularItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.orders} sipariş</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₺{item.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">toplam gelir</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}



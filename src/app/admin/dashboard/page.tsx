'use client';

import { useState, useEffect } from 'react';
import ModernAdminLayout from '@/components/ModernAdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  FaChartLine, 
  FaUsers, 
  FaStore, 
  FaQrcode, 
  FaBell, 
  FaCog, 
  FaShieldAlt,
  FaDatabase,
  FaRocket,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user } = useAdminAuth();

  const [stats, setStats] = useState([
    {
      title: 'Toplam Restoran',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: FaStore,
      color: 'blue'
    },
    {
      title: 'Aktif Kullanıcılar',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: FaUsers,
      color: 'green'
    },
    {
      title: 'Aylık Gelir',
      value: '₺0',
      change: '0%',
      changeType: 'neutral',
      icon: FaChartLine,
      color: 'purple'
    },
    {
      title: 'Sistem Uptime',
      value: '100%',
      change: '0%',
      changeType: 'neutral',
      icon: FaCheckCircle,
      color: 'emerald'
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // localStorage'dan gerçek verileri yükle
  useEffect(() => {
    const loadRealData = () => {
      // Restoran sayısını hesapla
      const restaurants = JSON.parse(localStorage.getItem('masapp-restaurants') || '[]');
      
      // Kullanıcı sayısını hesapla
      const users = JSON.parse(localStorage.getItem('masapp-users') || '[]');
      const activeUsers = users.filter((user: any) => user.status === 'active');
      
      // Ödeme verilerini hesapla
      const payments = JSON.parse(localStorage.getItem('masapp-payments') || '[]');
      const completedPayments = payments.filter((payment: any) => payment.status === 'completed');
      const monthlyRevenue = completedPayments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0);
      
      // Bildirimleri yükle
      const notifications = JSON.parse(localStorage.getItem('admin-notifications') || '[]');
      const recentNotifs = notifications.slice(0, 3).map((notif: any) => ({
        id: notif.id,
        type: notif.type,
        title: notif.title,
        description: notif.message,
        time: new Date(notif.createdAt).toLocaleString('tr-TR'),
        status: notif.priority === 'urgent' ? 'warning' : 'success'
      }));

      setStats([
        {
          title: 'Toplam Restoran',
          value: restaurants.length.toString(),
          change: '0%',
          changeType: 'neutral',
          icon: FaStore,
          color: 'blue'
        },
        {
          title: 'Aktif Kullanıcılar',
          value: activeUsers.length.toString(),
          change: '0%',
          changeType: 'neutral',
          icon: FaUsers,
          color: 'green'
        },
        {
          title: 'Aylık Gelir',
          value: `₺${monthlyRevenue.toLocaleString()}`,
          change: '0%',
          changeType: 'neutral',
          icon: FaChartLine,
          color: 'purple'
        },
        {
          title: 'Sistem Uptime',
          value: '100%',
          change: '0%',
          changeType: 'neutral',
          icon: FaCheckCircle,
          color: 'emerald'
        }
      ]);

      setRecentActivities(recentNotifs);
    };

    loadRealData();
  }, []);

  const quickActions = [
    { title: 'Restoran Ekle', icon: FaStore, color: 'blue', href: '/admin/restaurants' },
    { title: 'Kullanıcı Yönet', icon: FaUsers, color: 'green', href: '/admin/users' },
    { title: 'QR Oluştur', icon: FaQrcode, color: 'purple', href: '/admin/qr-codes' },
    { title: 'Raporlar', icon: FaChartLine, color: 'orange', href: '/admin/reports' },
    { title: 'Bildirimler', icon: FaBell, color: 'red', href: '/admin/notifications' },
    { title: 'Ayarlar', icon: FaCog, color: 'gray', href: '/admin/settings' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
      red: 'bg-red-500 text-white',
      gray: 'bg-gray-500 text-white',
      emerald: 'bg-emerald-500 text-white'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  // Loading durumu
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Authentication yoksa hiçbir şey gösterme
  if (!isAuthenticated) {
    return null;
  }

  return (
    <ModernAdminLayout title="Dashboard" description="Sistem genel durumu ve yönetim paneli">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : stat.changeType === 'negative' ? (
                      <FaArrowDown className="w-4 h-4 text-red-500 mr-1" />
                    ) : (
                      <span className="w-4 h-4 mr-1"></span>
                    )}
                    <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">bu ay</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.href}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className={`p-3 rounded-lg ${getColorClasses(action.color)} mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">{action.title}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
        </div>
        <div className="p-6">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {activity.status === 'success' ? (
                      <FaCheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <FaExclamationTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaBell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Henüz aktivite yok</p>
              <p className="text-sm">Sistem aktiviteleri burada görünecek</p>
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Sistem Durumu</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">Sistem: Online</span>
            <span className="text-sm text-gray-500">Son güncelleme: 2 dakika önce</span>
          </div>
        </div>
      </div>
    </ModernAdminLayout>
  );
}

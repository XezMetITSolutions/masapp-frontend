'use client';

import ModernAdminLayout from '@/components/ModernAdminLayout';
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

  const stats = [
    {
      title: 'Toplam Restoran',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: FaStore,
      color: 'blue'
    },
    {
      title: 'Aktif Kullanıcılar',
      value: '15,432',
      change: '+8.2%',
      changeType: 'positive',
      icon: FaUsers,
      color: 'green'
    },
    {
      title: 'Aylık Gelir',
      value: '₺2.4M',
      change: '+15.3%',
      changeType: 'positive',
      icon: FaChartLine,
      color: 'purple'
    },
    {
      title: 'Sistem Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive',
      icon: FaCheckCircle,
      color: 'emerald'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'restaurant',
      title: 'Yeni Restoran Eklendi',
      description: 'Pizza Palace başarıyla kaydedildi',
      time: '2 saat önce',
      status: 'success'
    },
    {
      id: 2,
      type: 'user',
      title: 'Kullanıcı Onayı',
      description: 'John Doe hesabı onaylandı',
      time: '4 saat önce',
      status: 'success'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Ödeme Hatası',
      description: 'Cafe Central ödeme sorunu',
      time: '6 saat önce',
      status: 'warning'
    }
  ];

  const quickActions = [
    { title: 'Restoran Ekle', icon: FaStore, color: 'blue' },
    { title: 'Kullanıcı Yönet', icon: FaUsers, color: 'green' },
    { title: 'QR Oluştur', icon: FaQrcode, color: 'purple' },
    { title: 'Raporlar', icon: FaChartLine, color: 'orange' },
    { title: 'Bildirimler', icon: FaBell, color: 'red' },
    { title: 'Ayarlar', icon: FaCog, color: 'gray' }
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
                          ) : (
                            <FaArrowDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${
                            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
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

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
              </div>
              <div className="p-6">
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

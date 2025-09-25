'use client';

import { useState, useEffect } from 'react';
import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaBell, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEnvelope,
  FaUsers,
  FaStore,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  // localStorage'dan bildirimleri yükle
  useEffect(() => {
    const savedNotifications = localStorage.getItem('masapp-notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Bildirimleri localStorage'a kaydet
  const saveNotificationsToStorage = (newNotifications: any[]) => {
    localStorage.setItem('masapp-notifications', JSON.stringify(newNotifications));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return FaStore;
      case 'payment':
        return FaExclamationTriangle;
      case 'user':
        return FaUsers;
      case 'system':
        return FaInfoCircle;
      default:
        return FaBell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'text-blue-600';
      case 'payment':
        return 'text-red-600';
      case 'user':
        return 'text-green-600';
      case 'system':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModernAdminLayout title="Bildirimler" description="Sistem bildirimlerini yönetin">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Bildirim Merkezi</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {notifications.length} Bildirim
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaFilter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus className="w-4 h-4" />
            <span>Yeni Bildirim</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Bildirim</p>
              <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <FaBell className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Okunmamış</p>
              <p className="text-3xl font-bold text-red-600">
                {notifications.filter(n => n.status === 'unread').length}
              </p>
            </div>
            <FaExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yüksek Öncelik</p>
              <p className="text-3xl font-bold text-orange-600">
                {notifications.filter(n => n.priority === 'high').length}
              </p>
            </div>
            <FaTimesCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bugün</p>
              <p className="text-3xl font-bold text-green-600">3</p>
            </div>
            <FaClock className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const TypeIcon = getTypeIcon(notification.type);
          return (
            <div key={notification.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
              notification.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)} bg-opacity-10`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'high' ? 'Yüksek' : notification.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                      {notification.status === 'unread' && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FaClock className="w-4 h-4 mr-1" />
                        {notification.createdAt}
                      </span>
                      <span className="capitalize">{notification.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 p-2">
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900 p-2">
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-2">
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ModernAdminLayout>
  );
}

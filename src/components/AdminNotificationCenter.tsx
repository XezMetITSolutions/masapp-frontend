'use client';

import { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaCheckCircle,
  FaClock,
  FaUser,
  FaStore,
  FaCreditCard,
  FaShieldAlt,
  FaCog
} from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: 'system' | 'user' | 'restaurant' | 'payment' | 'security';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AdminNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminNotificationCenter({ isOpen, onClose }: AdminNotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'user' | 'restaurant' | 'payment' | 'security'>('all');

  useEffect(() => {
    // Demo notifications
    const demoNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Yeni Restoran Onaylandı',
        message: 'Pizza Palace restoranı başarıyla onaylandı ve sisteme eklendi.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        category: 'restaurant',
        action: {
          label: 'Detayları Gör',
          onClick: () => console.log('Restaurant details')
        }
      },
      {
        id: '2',
        type: 'warning',
        title: 'Ödeme Hatası',
        message: 'Cafe Central restoranının aylık ödemesi başarısız oldu.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        category: 'payment',
        action: {
          label: 'Ödemeyi Kontrol Et',
          onClick: () => console.log('Check payment')
        }
      },
      {
        id: '3',
        type: 'info',
        title: 'Sistem Güncellemesi',
        message: 'Yeni güvenlik güncellemesi mevcut. Sistem yeniden başlatılacak.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        category: 'system',
        action: {
          label: 'Güncelle',
          onClick: () => console.log('Update system')
        }
      },
      {
        id: '4',
        type: 'error',
        title: 'Güvenlik Uyarısı',
        message: 'Şüpheli giriş denemesi tespit edildi. IP adresi engellendi.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: false,
        category: 'security',
        action: {
          label: 'Güvenlik Raporu',
          onClick: () => console.log('Security report')
        }
      },
      {
        id: '5',
        type: 'success',
        title: 'Kullanıcı Eklendi',
        message: 'Yeni garson kullanıcısı başarıyla eklendi.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
        category: 'user'
      }
    ];

    setNotifications(demoNotifications);
  }, []);

  const getNotificationIcon = (type: string, category: string) => {
    if (category === 'system') return FaCog;
    if (category === 'user') return FaUser;
    if (category === 'restaurant') return FaStore;
    if (category === 'payment') return FaCreditCard;
    if (category === 'security') return FaShieldAlt;
    
    switch (type) {
      case 'success': return FaCheckCircle;
      case 'warning': return FaExclamationTriangle;
      case 'error': return FaExclamationTriangle;
      default: return FaInfoCircle;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system': return 'text-purple-600 bg-purple-100';
      case 'user': return 'text-blue-600 bg-blue-100';
      case 'restaurant': return 'text-green-600 bg-green-100';
      case 'payment': return 'text-orange-600 bg-orange-100';
      case 'security': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
    return `${Math.floor(diffInMinutes / 1440)} gün önce`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaBell className="text-2xl text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bildirim Merkezi</h2>
                <p className="text-sm text-gray-500">{notifications.length} bildirim</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tümünü Okundu İşaretle
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-lg text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Tümü' },
              { value: 'unread', label: 'Okunmamış' },
              { value: 'system', label: 'Sistem' },
              { value: 'user', label: 'Kullanıcı' },
              { value: 'restaurant', label: 'Restoran' },
              { value: 'payment', label: 'Ödeme' },
              { value: 'security', label: 'Güvenlik' }
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <FaBell className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Bildirim bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type, notification.category);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        <Icon className="text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notification.category)}`}>
                              {notification.category}
                            </span>
                            <span className="text-xs text-gray-500">{formatTimeAgo(notification.timestamp)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Okundu İşaretle
                            </button>
                          )}
                          {notification.action && (
                            <button
                              onClick={notification.action.onClick}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {notification.action.label}
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium ml-auto"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



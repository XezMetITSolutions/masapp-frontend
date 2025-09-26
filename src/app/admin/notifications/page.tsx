'use client';

import { useState, useEffect } from 'react';
import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaBell, 
  FaTicketAlt, 
  FaUser, 
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaReply,
  FaTimes,
  FaFilter,
  FaSearch,
  FaPlus,
  FaEdit
} from 'react-icons/fa';

interface AdminNotification {
  id: string;
  type: 'new_ticket' | 'ticket_message' | 'system_alert' | 'user_activity';
  title: string;
  message: string;
  ticketId?: string;
  userId?: string;
  userName?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  createdAt: string;
  isRead: boolean;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<AdminNotification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);
  const [showNewNotificationModal, setShowNewNotificationModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'system_alert' as 'new_ticket' | 'ticket_message' | 'system_alert' | 'user_activity',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: ''
  });

  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem('admin-notifications');
    if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
          setFilteredNotifications(parsed);
        } catch (error) {
          console.error('Bildirimler yüklenemedi:', error);
        }
      }
    };

    loadNotifications();
    
    // Her 5 saniyede bir kontrol et
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = notifications;

    if (searchTerm) {
      filtered = filtered.filter(notif => 
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notif.userName && notif.userName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(notif => notif.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'unread') {
        filtered = filtered.filter(notif => !notif.isRead);
      } else if (statusFilter === 'read') {
        filtered = filtered.filter(notif => notif.isRead);
      }
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, typeFilter, statusFilter]);

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId 
        ? { ...notif, isRead: true }
        : notif
    );
    
    setNotifications(updatedNotifications);
    setFilteredNotifications(updatedNotifications);
    localStorage.setItem('admin-notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
    setNotifications(updatedNotifications);
    setFilteredNotifications(updatedNotifications);
    localStorage.setItem('admin-notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId: string) => {
    if (confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
      const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
      setNotifications(updatedNotifications);
      setFilteredNotifications(updatedNotifications);
      localStorage.setItem('admin-notifications', JSON.stringify(updatedNotifications));
      alert('Bildirim başarıyla silindi!');
    }
  };

  const editNotification = (notificationId: string) => {
    const notificationToEdit = notifications.find(notif => notif.id === notificationId);
    if (notificationToEdit) {
      setNewNotification({
        title: notificationToEdit.title,
        message: notificationToEdit.message,
        type: notificationToEdit.type,
        priority: notificationToEdit.priority || 'medium',
        category: notificationToEdit.category || ''
      });
      setShowNewNotificationModal(true);
    }
  };

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      alert('Lütfen başlık ve mesaj alanlarını doldurun.');
      return;
    }

    const notification: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      priority: newNotification.priority,
      category: newNotification.category,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    setFilteredNotifications(updatedNotifications);
    localStorage.setItem('admin-notifications', JSON.stringify(updatedNotifications));
    
    setNewNotification({
      title: '',
      message: '',
      type: 'system_alert',
      priority: 'medium',
      category: ''
    });
    setShowNewNotificationModal(false);
    
    alert('Bildirim başarıyla oluşturuldu!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_ticket': return <FaTicketAlt className="text-blue-600" />;
      case 'ticket_message': return <FaReply className="text-green-600" />;
      case 'system_alert': return <FaExclamationCircle className="text-red-600" />;
      case 'user_activity': return <FaUser className="text-purple-600" />;
      default: return <FaBell className="text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_ticket': return 'bg-blue-100 text-blue-800';
      case 'ticket_message': return 'bg-green-100 text-green-800';
      case 'system_alert': return 'bg-red-100 text-red-800';
      case 'user_activity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <ModernAdminLayout title="Bildirimler" description="Sistem bildirimlerini yönetin">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Bildirim Merkezi</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {notifications.length} Bildirim
          </span>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
              {unreadCount} Okunmamış
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaFilter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaCheckCircle className="w-4 h-4" />
              <span>Tümünü Okundu İşaretle</span>
            </button>
          )}
          <button 
            onClick={() => setShowNewNotificationModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            <span>Yeni Bildirim</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Bildirim ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            </div>
          
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tüm Türler</option>
              <option value="new_ticket">Yeni Ticket</option>
              <option value="ticket_message">Ticket Mesajı</option>
              <option value="system_alert">Sistem Uyarısı</option>
              <option value="user_activity">Kullanıcı Aktivitesi</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="unread">Okunmamış</option>
              <option value="read">Okunmuş</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinize uygun bildirim bulunmuyor.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                  }`}
                  onClick={() => {
                    setSelectedNotification(notification);
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(notification.type)}
                        <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type === 'new_ticket' && 'Yeni Ticket'}
                          {notification.type === 'ticket_message' && 'Ticket Mesajı'}
                          {notification.type === 'system_alert' && 'Sistem Uyarısı'}
                          {notification.type === 'user_activity' && 'Kullanıcı Aktivitesi'}
                        </span>
                        {notification.priority && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority === 'urgent' && 'Acil'}
                            {notification.priority === 'high' && 'Yüksek'}
                            {notification.priority === 'medium' && 'Orta'}
                            {notification.priority === 'low' && 'Düşük'}
                          </span>
                        )}
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {new Date(notification.createdAt).toLocaleString('tr-TR')}
                        </span>
                        {notification.userName && (
                          <span className="flex items-center gap-1">
                            <FaUser />
                            {notification.userName}
                          </span>
                        )}
                        {notification.category && (
                          <span className="flex items-center gap-1">
                            <FaTicketAlt />
                            {notification.category}
                          </span>
                        )}
          </div>
        </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Okundu işaretle"
                      >
                        <FaCheckCircle className="text-green-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editNotification(notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Düzenle"
                      >
                        <FaEdit className="text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Sil"
                      >
                        <FaTimes className="text-red-600" />
                      </button>
            </div>
          </div>
        </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedNotification.title}</h3>
                <p className="text-gray-600">
                  {new Date(selectedNotification.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tür</p>
                    <p className="font-medium flex items-center gap-2">
                      {getTypeIcon(selectedNotification.type)}
                      {selectedNotification.type === 'new_ticket' && 'Yeni Ticket'}
                      {selectedNotification.type === 'ticket_message' && 'Ticket Mesajı'}
                      {selectedNotification.type === 'system_alert' && 'Sistem Uyarısı'}
                      {selectedNotification.type === 'user_activity' && 'Kullanıcı Aktivitesi'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Öncelik</p>
                    <p className={`font-medium ${getPriorityColor(selectedNotification.priority)}`}>
                      {selectedNotification.priority === 'urgent' && 'Acil'}
                      {selectedNotification.priority === 'high' && 'Yüksek'}
                      {selectedNotification.priority === 'medium' && 'Orta'}
                      {selectedNotification.priority === 'low' && 'Düşük'}
                      {!selectedNotification.priority && 'Belirtilmemiş'}
                    </p>
                  </div>
                  {selectedNotification.userName && (
                    <div>
                      <p className="text-sm text-gray-600">Kullanıcı</p>
                      <p className="font-medium">{selectedNotification.userName}</p>
                    </div>
                  )}
                  {selectedNotification.category && (
                    <div>
                      <p className="text-sm text-gray-600">Kategori</p>
                      <p className="font-medium">{selectedNotification.category}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Mesaj</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedNotification.message}
                </p>
                  </div>

              {selectedNotification.ticketId && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">İlgili Ticket</h4>
                  <p className="text-sm text-gray-600">Ticket ID: {selectedNotification.ticketId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Notification Modal */}
      {showNewNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Yeni Bildirim Oluştur</h3>
              <button
                onClick={() => setShowNewNotificationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
                  </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Bildirim başlığını girin..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj *
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Bildirim mesajını girin..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tür
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="system_alert">Sistem Uyarısı</option>
                    <option value="new_ticket">Yeni Ticket</option>
                    <option value="ticket_message">Ticket Mesajı</option>
                    <option value="user_activity">Kullanıcı Aktivitesi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öncelik
                  </label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="urgent">Acil</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <input
                  type="text"
                  value={newNotification.category}
                  onChange={(e) => setNewNotification({ ...newNotification, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Bildirim kategorisi (opsiyonel)"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowNewNotificationModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleCreateNotification}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FaPlus />
                Bildirim Oluştur
              </button>
            </div>
          </div>
      </div>
      )}
    </ModernAdminLayout>
  );
}
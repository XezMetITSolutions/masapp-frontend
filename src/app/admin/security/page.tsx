'use client';

import { useState, useEffect } from 'react';
import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaShieldAlt, 
  FaEye, 
  FaLock, 
  FaUserShield,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaKey,
  FaFingerprint,
  FaHistory,
  FaBan,
  FaUnlock
} from 'react-icons/fa';

export default function SecurityPage() {
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);

  // localStorage'dan güvenlik olaylarını yükle
  useEffect(() => {
    const savedSecurityEvents = localStorage.getItem('masapp-security-events');
    if (savedSecurityEvents) {
      setSecurityEvents(JSON.parse(savedSecurityEvents));
    }
  }, []);

  // Güvenlik olaylarını localStorage'a kaydet
  const saveSecurityEventsToStorage = (newEvents: any[]) => {
    localStorage.setItem('masapp-security-events', JSON.stringify(newEvents));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return FaCheckCircle;
      case 'failed_login':
        return FaTimesCircle;
      case 'password_change':
        return FaKey;
      case 'suspicious_activity':
        return FaExclamationTriangle;
      default:
        return FaShieldAlt;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'text-green-600';
      case 'failed_login':
        return 'text-red-600';
      case 'password_change':
        return 'text-blue-600';
      case 'suspicious_activity':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModernAdminLayout title="Güvenlik" description="Güvenlik ayarları ve olayları yönetin">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Güvenlik Merkezi</h2>
          <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
            Güvenlik
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Oturumlar</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <FaUserShield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Güvenlik Olayları</p>
              <p className="text-3xl font-bold text-orange-600">{securityEvents.length}</p>
            </div>
            <FaExclamationTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">2FA Aktif</p>
              <p className="text-3xl font-bold text-green-600">8</p>
            </div>
            <FaFingerprint className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engellenen IP</p>
              <p className="text-3xl font-bold text-red-600">3</p>
            </div>
            <FaBan className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik Ayarları</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaLock className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</span>
              </div>
              <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Aktif
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaShieldAlt className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Otomatik Güvenlik Taraması</span>
              </div>
              <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Aktif
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaBan className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">IP Engelleme</span>
              </div>
              <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Manuel
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaHistory className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Oturum Geçmişi</span>
              </div>
              <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Aktif
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Güvenlik Olayları</h3>
          <div className="space-y-3">
            {securityEvents.slice(0, 4).map((event) => {
              const EventIcon = getEventIcon(event.type);
              return (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <EventIcon className={`w-5 h-5 ${getEventColor(event.type)}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.description}</p>
                    <p className="text-xs text-gray-500">{event.timestamp}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                    {event.status === 'success' ? 'Başarılı' : event.status === 'failed' ? 'Başarısız' : 'Uyarı'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Güvenlik Olayları Geçmişi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Olay
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Adresi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zaman
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {securityEvents.map((event) => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <EventIcon className={`w-5 h-5 mr-3 ${getEventColor(event.type)}`} />
                        <span className="text-sm font-medium text-gray-900">{event.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status === 'success' ? 'Başarılı' : event.status === 'failed' ? 'Başarısız' : 'Uyarı'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ModernAdminLayout>
  );
}

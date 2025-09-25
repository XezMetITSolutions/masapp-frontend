'use client';

import { useState, useEffect } from 'react';
import { 
  FaShieldAlt, 
  FaLock, 
  FaUserShield, 
  FaEye, 
  FaEyeSlash, 
  FaKey, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaGlobe, 
  FaMobile, 
  FaDesktop, 
  FaMapMarkerAlt, 
  FaDownload,
  FaFilter,
  FaSearch,
  FaBan,
  FaUnlock,
  FaUserCheck,
  FaUserTimes
} from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';

export default function SecurityManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      maxAge: 90
    },
    sessionTimeout: 30,
    ipWhitelist: false,
    loginAttempts: 5,
    lockoutDuration: 15
  });

  const [securityEvents, setSecurityEvents] = useState([
    {
      id: 1,
      type: 'login',
      user: 'admin@masapp.com',
      ip: '192.168.1.100',
      location: 'İstanbul, Türkiye',
      device: 'Chrome on Windows',
      status: 'success',
      timestamp: '2024-01-15 14:30:25'
    },
    {
      id: 2,
      type: 'failed_login',
      user: 'admin@masapp.com',
      ip: '192.168.1.101',
      location: 'Ankara, Türkiye',
      device: 'Firefox on Linux',
      status: 'failed',
      timestamp: '2024-01-15 14:25:10'
    },
    {
      id: 3,
      type: 'password_change',
      user: 'manager@restaurant.com',
      ip: '192.168.1.102',
      location: 'İzmir, Türkiye',
      device: 'Safari on macOS',
      status: 'success',
      timestamp: '2024-01-15 13:45:30'
    },
    {
      id: 4,
      type: 'suspicious_activity',
      user: 'unknown@example.com',
      ip: '10.0.0.1',
      location: 'Unknown',
      device: 'Unknown',
      status: 'blocked',
      timestamp: '2024-01-15 12:15:45'
    }
  ]);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      user: 'admin@masapp.com',
      ip: '192.168.1.100',
      location: 'İstanbul, Türkiye',
      device: 'Chrome on Windows',
      lastActivity: '2 dakika önce',
      isCurrent: true
    },
    {
      id: 2,
      user: 'manager@restaurant.com',
      ip: '192.168.1.102',
      location: 'İzmir, Türkiye',
      device: 'Safari on macOS',
      lastActivity: '15 dakika önce',
      isCurrent: false
    }
  ]);

  const [threats, setThreats] = useState([
    {
      id: 1,
      type: 'brute_force',
      severity: 'high',
      description: 'Çoklu başarısız giriş denemesi',
      source: '192.168.1.101',
      count: 15,
      timestamp: '2024-01-15 14:25:00',
      status: 'blocked'
    },
    {
      id: 2,
      type: 'suspicious_ip',
      severity: 'medium',
      description: 'Şüpheli IP adresinden giriş denemesi',
      source: '10.0.0.1',
      count: 3,
      timestamp: '2024-01-15 12:15:00',
      status: 'monitoring'
    }
  ]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return FaUserCheck;
      case 'failed_login': return FaUserTimes;
      case 'password_change': return FaKey;
      case 'suspicious_activity': return FaExclamationTriangle;
      default: return FaShieldAlt;
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'blocked': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: FaShieldAlt },
    { id: 'events', label: 'Güvenlik Olayları', icon: FaEye },
    { id: 'sessions', label: 'Aktif Oturumlar', icon: FaClock },
    { id: 'threats', label: 'Tehditler', icon: FaExclamationTriangle },
    { id: 'settings', label: 'Güvenlik Ayarları', icon: FaLock }
  ];

  return (
    <AdminLayout 
      title="Güvenlik Yönetimi" 
      description="Sistem güvenliği ve tehdit yönetimi"
    >
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="text-lg" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Security Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Güvenlik Skoru</h3>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">85</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Mükemmel güvenlik durumu</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Aktif Tehditler</h3>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-lg">2</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Yüksek öncelikli</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Aktif Oturumlar</h3>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">{activeSessions.length}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Şu anda aktif</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Son 24 Saat</h3>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-lg">12</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Güvenlik olayı</p>
            </div>
          </div>

          {/* Recent Security Events */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Son Güvenlik Olayları</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {securityEvents.slice(0, 5).map((event) => {
                  const EventIcon = getEventIcon(event.type);
                  return (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-4 ${getEventColor(event.status)}`}>
                          <EventIcon className="text-lg" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{event.user}</p>
                          <p className="text-sm text-gray-500">{event.location} • {event.device}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{event.timestamp}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Güvenlik Olayları</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaSearch className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Kullanıcı ara..."
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FaDownload className="text-sm" />
                  Dışa Aktar
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {securityEvents.map((event) => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-4 ${getEventColor(event.status)}`}>
                        <EventIcon className="text-lg" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{event.user}</p>
                        <p className="text-sm text-gray-500">{event.location} • {event.device}</p>
                        <p className="text-xs text-gray-400">IP: {event.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{event.timestamp}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Aktif Oturumlar</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <FaDesktop className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{session.user}</p>
                      <p className="text-sm text-gray-500">{session.location} • {session.device}</p>
                      <p className="text-xs text-gray-400">IP: {session.ip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{session.lastActivity}</p>
                      {session.isCurrent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-800 bg-green-100">
                          Mevcut Oturum
                        </span>
                      )}
                    </div>
                    {!session.isCurrent && (
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                        <FaBan className="text-lg" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Threats Tab */}
      {activeTab === 'threats' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Güvenlik Tehditleri</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {threats.map((threat) => (
                <div key={threat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <FaExclamationTriangle className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{threat.description}</p>
                      <p className="text-sm text-gray-500">Kaynak: {threat.source} • {threat.count} deneme</p>
                      <p className="text-xs text-gray-400">{threat.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                      {threat.severity.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      threat.status === 'blocked' ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'
                    }`}>
                      {threat.status}
                    </span>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                      <FaBan className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Güvenlik Ayarları</h3>
            
            <div className="space-y-6">
              {/* Two Factor Authentication */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</h4>
                  <p className="text-sm text-gray-500">Hesap güvenliği için ek doğrulama</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Password Policy */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Şifre Politikası</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Uzunluk</label>
                    <input
                      type="number"
                      value={securitySettings.passwordPolicy.minLength}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...prev.passwordPolicy, minLength: parseInt(e.target.value) }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Yaş (gün)</label>
                    <input
                      type="number"
                      value={securitySettings.passwordPolicy.maxAge}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...prev.passwordPolicy, maxAge: parseInt(e.target.value) }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Session Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Oturum Ayarları</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Oturum Zaman Aşımı (dakika)</label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Giriş Denemesi</label>
                    <input
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Ayarları Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}



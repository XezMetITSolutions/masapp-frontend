'use client';

import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaCog, 
  FaSave, 
  FaUndo, 
  FaGlobe,
  FaBell,
  FaShieldAlt,
  FaDatabase,
  FaServer,
  FaPalette,
  FaLanguage,
  FaClock,
  FaKey,
  FaUserCog
} from 'react-icons/fa';

export default function SettingsPage() {
  const settings = {
    general: {
      siteName: 'MasApp',
      siteDescription: 'Restoran yönetim sistemi',
      timezone: 'Europe/Istanbul',
      language: 'tr',
      currency: 'TRY'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      adminAlerts: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      loginAttempts: 5
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      logLevel: 'info',
      backupFrequency: 'daily'
    }
  };

  return (
    <ModernAdminLayout title="Ayarlar" description="Sistem ayarlarını yönetin">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Yapılandırma
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaUndo className="w-4 h-4" />
            <span>Sıfırla</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaSave className="w-4 h-4" />
            <span>Kaydet</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FaCog className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Genel Ayarlar</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Adı</label>
              <input
                type="text"
                defaultValue={settings.general.siteName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
              <textarea
                defaultValue={settings.general.siteDescription}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zaman Dilimi</label>
              <select
                defaultValue={settings.general.timezone}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                <option value="Europe/London">Londra (UTC+0)</option>
                <option value="America/New_York">New York (UTC-5)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
              <select
                defaultValue={settings.general.language}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
              <select
                defaultValue={settings.general.currency}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="TRY">₺ Türk Lirası</option>
                <option value="USD">$ Amerikan Doları</option>
                <option value="EUR">€ Euro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FaBell className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bildirim Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">E-posta Bildirimleri</p>
                <p className="text-sm text-gray-500">Sistem bildirimlerini e-posta ile al</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={settings.notifications.emailNotifications} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Push Bildirimleri</p>
                <p className="text-sm text-gray-500">Tarayıcı push bildirimlerini al</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={settings.notifications.pushNotifications} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">SMS Bildirimleri</p>
                <p className="text-sm text-gray-500">Kritik bildirimler için SMS gönder</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={settings.notifications.smsNotifications} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Yönetici Uyarıları</p>
                <p className="text-sm text-gray-500">Sistem uyarılarını yöneticilere bildir</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={settings.notifications.adminAlerts} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FaShieldAlt className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Güvenlik Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</p>
                <p className="text-sm text-gray-500">Hesap güvenliği için 2FA zorunlu</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={settings.security.twoFactorAuth} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Oturum Zaman Aşımı (dakika)</label>
              <input
                type="number"
                defaultValue={settings.security.sessionTimeout}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Şifre Uzunluğu</label>
              <input
                type="number"
                defaultValue={settings.security.passwordMinLength}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Giriş Denemesi</label>
              <input
                type="number"
                defaultValue={settings.security.loginAttempts}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FaServer className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sistem Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Bakım Modu</p>
                <p className="text-sm text-gray-500">Sistemi bakım moduna al</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={settings.system.maintenanceMode} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Debug Modu</p>
                <p className="text-sm text-gray-500">Geliştirici modunu etkinleştir</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={settings.system.debugMode} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Log Seviyesi</label>
              <select
                defaultValue={settings.system.logLevel}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="error">Hata</option>
                <option value="warn">Uyarı</option>
                <option value="info">Bilgi</option>
                <option value="debug">Debug</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yedekleme Sıklığı</label>
              <select
                defaultValue={settings.system.backupFrequency}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hourly">Saatlik</option>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </ModernAdminLayout>
  );
}

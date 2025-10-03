'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaChartBar, 
  FaUsers, 
  FaBuilding, 
  FaBell,
  FaCreditCard,
  FaExclamationTriangle,
  FaUserCheck,
  FaSignOutAlt,
  FaShieldAlt,
  FaChartLine,
  FaCog,
  FaQrcode,
  FaFileAlt,
  FaCogs,
  FaDatabase,
  FaLock,
  FaChartPie
} from 'react-icons/fa';

export default function SuperAdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    // Çıkış yapıldığında ana sayfaya yönlendir
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FaShieldAlt className="text-xl" />
            </div>
          <div>
              <h1 className="text-xl font-bold">MASAPP</h1>
              <p className="text-sm text-gray-300">Süper Yönetici</p>
            </div>
          </div>
        </div>
        
        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-6">
          <nav className="space-y-2">
            {/* Ana Menü */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ana Menü</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin" className="flex items-center p-3 rounded-lg bg-blue-600 text-white">
                    <FaChartBar className="mr-3" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/restaurants" className="flex items-center p-3 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white">
                    <FaBuilding className="mr-3" />
                    Restoran Yönetimi
                  </Link>
                </li>
                <li>
                  <Link href="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white">
                    <FaUsers className="mr-3" />
                    Kullanıcı Yönetimi
                  </Link>
                </li>
                <li>
                  <Link href="/admin/notifications" className="flex items-center p-3 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white">
                    <FaBell className="mr-3" />
                    Bildirimler
                  </Link>
                </li>
              </ul>
            </div>

            {/* Raporlar ve Analitik */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Raporlar & Analitik</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin/subscriptions" className="flex items-center p-3 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white">
                    <FaCreditCard className="mr-3" />
                    Abonelik Yönetimi
                  </Link>
                </li>
                <li>
                  <Link href="/admin/payment-errors" className="flex items-center p-3 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white">
                    <FaExclamationTriangle className="mr-3" />
                    Ödeme Hataları
                  </Link>
                </li>
                <li>
                  <Link href="/admin/user-approvals" className="flex items-center p-3 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white">
                    <FaUserCheck className="mr-3" />
                    Kullanıcı Onayları
                  </Link>
                </li>
              </ul>
            </div>

            {/* Çıkış */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <button 
                onClick={handleLogout}
                className="flex items-center p-3 rounded-lg hover:bg-red-600 text-gray-300 hover:text-white w-full"
              >
                <FaSignOutAlt className="mr-3" />
                Çıkış Yap
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-80">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Süper Yönetici Paneli</h1>
                <p className="text-gray-600 mt-2">Sistem genel durumu ve yönetim paneli</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-green-50 rounded-lg px-4 py-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700">Sistem: Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Toplam Restoran</p>
                  <h3 className="text-3xl font-bold text-gray-900">1,247</h3>
                  <p className="text-sm text-green-600 mt-1">+12 bu ay</p>
                </div>
                <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaBuilding className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Aktif Restoran</p>
                  <h3 className="text-3xl font-bold text-gray-900">1,189</h3>
                  <p className="text-sm text-green-600 mt-1">%95.3 aktif</p>
                </div>
                <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaChartBar className="text-2xl text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Toplam Kullanıcı</p>
                  <h3 className="text-3xl font-bold text-gray-900">15,432</h3>
                  <p className="text-sm text-green-600 mt-1">+8.2% bu ay</p>
                </div>
                <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaUsers className="text-2xl text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Aylık Gelir</p>
                  <h3 className="text-3xl font-bold text-gray-900">₺2.4M</h3>
                  <p className="text-sm text-green-600 mt-1">+15.3% bu ay</p>
                </div>
                <div className="h-16 w-16 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FaChartLine className="text-2xl text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı Eylemler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı Eylemler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/restaurants/add" className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 text-left transition-colors group">
                <FaBuilding className="text-2xl text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">Restoran Ekle</h3>
                <p className="text-sm text-gray-500">Yeni restoran kaydı</p>
              </Link>
              <Link href="/admin/users" className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 text-left transition-colors group">
                <FaUsers className="text-2xl text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">Kullanıcı Yönet</h3>
                <p className="text-sm text-gray-500">Kullanıcı hesapları</p>
              </Link>
              <Link href="/admin/notifications" className="p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 text-left transition-colors group">
                <FaBell className="text-2xl text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">Bildirim Gönder</h3>
                <p className="text-sm text-gray-500">Toplu bildirim</p>
              </Link>
              <Link href="/admin/settings" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors group">
                <FaCog className="text-2xl text-gray-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">Sistem Ayarları</h3>
                <p className="text-sm text-gray-500">Genel ayarlar</p>
              </Link>
            </div>
            
            {/* İkinci Satır - Ek Hızlı İşlemler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <Link href="/admin/qr-management/generate" className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 text-left transition-colors group">
                <FaQrcode className="text-2xl text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">QR Oluştur</h3>
                <p className="text-sm text-gray-500">QR kod üretimi</p>
              </Link>
              <Link href="/admin/reports" className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 text-left transition-colors group">
                <FaChartPie className="text-2xl text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">Raporlar</h3>
                <p className="text-sm text-gray-500">Sistem raporları</p>
              </Link>
              <Link href="/admin/payment-errors" className="p-4 border border-gray-200 rounded-lg hover:bg-red-50 text-left transition-colors group">
                <FaExclamationTriangle className="text-2xl text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">Ödeme Hataları</h3>
                <p className="text-sm text-gray-500">Hata takibi</p>
              </Link>
              <Link href="/admin/security" className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 text-left transition-colors group">
                <FaLock className="text-2xl text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">Güvenlik</h3>
                <p className="text-sm text-gray-500">Güvenlik ayarları</p>
              </Link>
            </div>
          </div>

          {/* Son Aktiviteler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FaBuilding className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Yeni Restoran Kaydı</p>
                    <p className="text-sm text-gray-500">Pizza Palace - 2 saat önce</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Onaylandı</span>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <FaExclamationTriangle className="text-yellow-600" />
                </div>
                  <div>
                    <p className="font-medium text-gray-900">Ödeme Hatası</p>
                    <p className="text-sm text-gray-500">Cafe Central - 4 saat önce</p>
              </div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Beklemede</span>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <FaUserCheck className="text-green-600" />
                          </div>
                          <div>
                    <p className="font-medium text-gray-900">Kullanıcı Onayı</p>
                    <p className="text-sm text-gray-500">John Doe - 6 saat önce</p>
                          </div>
                        </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Tamamlandı</span>
              </div>
            </div>
          </div>
      </main>
      </div>
    </div>
  );
}

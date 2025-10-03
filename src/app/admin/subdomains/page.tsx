'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export default function SubdomainsManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateSubdomain = () => {
    router.push('/admin/restaurants/create');
  };

  const handleUpdateDNS = async () => {
    try {
      const response = await fetch('/api/dns/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subdomain: 'all',
          action: 'update'
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('DNS güncelleme işlemi başlatıldı!');
      } else {
        alert('DNS güncelleme başarısız: ' + result.message);
      }
    } catch (error) {
      console.error('DNS update error:', error);
      alert('DNS güncelleme işlemi başarısız');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const headerActions = (
    <div className="flex space-x-3">
      <button 
        onClick={handleCreateSubdomain}
        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg"
      >
        Yeni Subdomain
      </button>
      <button 
        onClick={handleUpdateDNS}
        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg"
      >
        DNS Güncelle
      </button>
      <button 
        onClick={handleRefresh}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
      >
        Yenile
      </button>
    </div>
  );

  return (
    <AdminLayout 
      title="Subdomain Yönetimi" 
      description="Tüm subdomain'leri ve DNS kayıtlarını yönet"
      headerActions={headerActions}
    >
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Subdomain Yönetimi</h1>
        <p className="text-gray-600">Bu sayfa geliştiriliyor...</p>
        
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filtreler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
                <input
                  type="text"
                  placeholder="Subdomain adı veya restoran adı..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="pending">Beklemede</option>
                  <option value="error">Hata</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DNS Durumu</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">Tüm DNS Durumları</option>
                  <option value="propagated">Yayınlandı</option>
                  <option value="pending">Beklemede</option>
                  <option value="failed">Başarısız</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Subdomain'ler</h2>
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz subdomain bulunmuyor</p>
            </div>
          </div>
        </div>

        {/* DNS Yapılandırması Bilgisi */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">DNS Yapılandırması</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Wildcard DNS Kaydı</h4>
                <p className="text-blue-700 text-sm mb-2">
                  Tüm subdomain'lerin çalışması için aşağıdaki DNS kaydını ekleyin:
                </p>
                <div className="bg-white p-3 rounded border font-mono text-sm">
                  <div className="text-gray-600">Type: CNAME</div>
                  <div className="text-gray-600">Name: *.masapp.com</div>
                  <div className="text-gray-600">Value: masapp.com</div>
                  <div className="text-gray-600">TTL: 300</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-800 mb-2">A Kaydı (Opsiyonel)</h4>
                <p className="text-blue-700 text-sm mb-2">
                  Ana domain için A kaydı:
                </p>
                <div className="bg-white p-3 rounded border font-mono text-sm">
                  <div className="text-gray-600">Type: A</div>
                  <div className="text-gray-600">Name: masapp.com</div>
                  <div className="text-gray-600">Value: [SERVER_IP]</div>
                  <div className="text-gray-600">TTL: 300</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

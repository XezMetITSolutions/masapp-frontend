'use client';

import { useState } from 'react';
import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaChartBar, 
  FaDownload, 
  FaCalendarAlt, 
  FaFilter, 
  FaEye, 
  FaArrowUp,
  FaArrowDown,
  FaStore,
  FaUsers,
  FaQrcode,
  FaMoneyBillWave,
  FaClock
} from 'react-icons/fa';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'generating':
        return 'Oluşturuluyor...';
      case 'failed':
        return 'Hata';
      default:
        return 'Bilinmiyor';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return FaMoneyBillWave;
      case 'performance':
        return FaStore;
      case 'users':
        return FaUsers;
      case 'qr':
        return FaQrcode;
      default:
        return FaChartBar;
    }
  };

  return (
    <ModernAdminLayout title="Raporlar" description="Sistem raporlarını görüntüleyin ve indirin">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Rapor Merkezi</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {reports.length} Rapor
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaFilter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaChartBar className="w-4 h-4" />
            <span>Yeni Rapor</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Rapor</p>
              <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <FaChartBar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
              <p className="text-3xl font-bold text-green-600">
                {reports.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <FaArrowUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam İndirme</p>
              <p className="text-3xl font-bold text-purple-600">
                {reports.reduce((sum, r) => sum + r.downloads, 0)}
              </p>
            </div>
            <FaDownload className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Oluşturuluyor</p>
              <p className="text-3xl font-bold text-yellow-600">
                {reports.filter(r => r.status === 'generating').length}
              </p>
            </div>
            <FaClock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <FaMoneyBillWave className="w-8 h-8 text-green-600" />
            <span className="text-sm text-gray-500">Gelir</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gelir Raporları</h3>
          <p className="text-sm text-gray-600">Aylık ve günlük gelir analizleri</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <FaStore className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">Performans</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Restoran Raporları</h3>
          <p className="text-sm text-gray-600">Restoran performans analizleri</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <FaUsers className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-gray-500">Kullanıcı</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Kullanıcı Raporları</h3>
          <p className="text-sm text-gray-600">Kullanıcı aktivite analizleri</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <FaQrcode className="w-8 h-8 text-orange-600" />
            <span className="text-sm text-gray-500">QR Kod</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Kod Raporları</h3>
          <p className="text-sm text-gray-600">QR kod kullanım analizleri</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Son Raporlar</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rapor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dönem
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Boyut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İndirme
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oluşturulma
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => {
                const TypeIcon = getTypeIcon(report.type);
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                          <TypeIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{report.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                        {report.period}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.size || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.downloads} kez
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.generatedAt || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {report.status === 'completed' && (
                          <>
                            <button className="text-blue-600 hover:text-blue-900 p-1" title="Görüntüle">
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1" title="İndir">
                              <FaDownload className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {report.status === 'generating' && (
                          <div className="flex items-center text-yellow-600">
                            <FaClock className="w-4 h-4 mr-2 animate-spin" />
                            <span className="text-sm">Oluşturuluyor...</span>
                          </div>
                        )}
                      </div>
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

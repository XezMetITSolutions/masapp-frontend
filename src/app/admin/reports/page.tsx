'use client';

import { useState, useEffect } from 'react';
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
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'revenue',
    period: 'monthly',
    description: ''
  });

  // localStorage'dan raporları yükle
  useEffect(() => {
    const savedReports = localStorage.getItem('masapp-reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      // Demo raporlar oluştur
      const demoReports = [
        {
          id: 'report-1',
          name: 'Aylık Gelir Raporu',
          type: 'revenue',
          period: 'Ocak 2024',
          status: 'completed',
          size: '2.3 MB',
          downloads: 15,
          generatedAt: '2024-01-15 14:30'
        },
        {
          id: 'report-2',
          name: 'Restoran Performans Raporu',
          type: 'performance',
          period: 'Haftalık',
          status: 'generating',
          size: '-',
          downloads: 0,
          generatedAt: '2024-01-15 16:45'
        },
        {
          id: 'report-3',
          name: 'Kullanıcı Aktivite Raporu',
          type: 'users',
          period: 'Günlük',
          status: 'completed',
          size: '1.8 MB',
          downloads: 8,
          generatedAt: '2024-01-14 09:15'
        }
      ];
      setReports(demoReports);
      localStorage.setItem('masapp-reports', JSON.stringify(demoReports));
    }
  }, []);

  // Raporları localStorage'a kaydet
  const saveReportsToStorage = (newReports: any[]) => {
    localStorage.setItem('masapp-reports', JSON.stringify(newReports));
  };

  // Yeni rapor oluştur
  const handleCreateReport = () => {
    if (!newReport.name) {
      alert('Lütfen rapor adını girin.');
      return;
    }

    const report = {
      id: `report-${Date.now()}`,
      name: newReport.name,
      type: newReport.type,
      period: newReport.period === 'monthly' ? 'Aylık' : 
              newReport.period === 'weekly' ? 'Haftalık' : 'Günlük',
      status: 'generating',
      size: '-',
      downloads: 0,
      generatedAt: new Date().toLocaleString('tr-TR'),
      description: newReport.description
    };

    const updatedReports = [report, ...reports];
    setReports(updatedReports);
    saveReportsToStorage(updatedReports);
    
    setNewReport({
      name: '',
      type: 'revenue',
      period: 'monthly',
      description: ''
    });
    setShowNewReportModal(false);
    
    alert('Rapor oluşturma işlemi başlatıldı!');
    
    // Simüle edilmiş rapor oluşturma süreci
    setTimeout(() => {
      const completedReport = {
        ...report,
        status: 'completed',
        size: '1.5 MB'
      };
      const finalReports = updatedReports.map(r => 
        r.id === report.id ? completedReport : r
      );
      setReports(finalReports);
      saveReportsToStorage(finalReports);
    }, 5000);
  };

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
          <button 
            onClick={() => setShowNewReportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
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

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Yeni Rapor Oluştur</h3>
              <button
                onClick={() => setShowNewReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rapor Adı *
                </label>
                <input
                  type="text"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Rapor adını girin..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rapor Türü
                  </label>
                  <select
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="revenue">Gelir Raporu</option>
                    <option value="performance">Performans Raporu</option>
                    <option value="users">Kullanıcı Raporu</option>
                    <option value="qr">QR Kod Raporu</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dönem
                  </label>
                  <select
                    value={newReport.period}
                    onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="monthly">Aylık</option>
                    <option value="yearly">Yıllık</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Rapor açıklaması girin..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowNewReportModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FaChartBar />
                Rapor Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </ModernAdminLayout>
  );
}

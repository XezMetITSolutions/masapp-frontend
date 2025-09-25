'use client';

import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaQrcode, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaDownload,
  FaPrint,
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaStore,
  FaCalendarAlt,
  FaEyeSlash,
  FaCopy,
  FaShare
} from 'react-icons/fa';

export default function QRCodesPage() {
  const qrCodes = [
    {
      id: 1,
      name: 'Masa 1 - Pizza Palace',
      restaurant: 'Pizza Palace',
      tableNumber: '1',
      qrCode: 'QR001',
      status: 'active',
      scans: 245,
      createdAt: '2024-01-15',
      lastScan: '2 saat önce',
      url: 'https://pizzapalace.masapp.com/masa/1'
    },
    {
      id: 2,
      name: 'Masa 2 - Pizza Palace',
      restaurant: 'Pizza Palace',
      tableNumber: '2',
      qrCode: 'QR002',
      status: 'active',
      scans: 189,
      createdAt: '2024-01-15',
      lastScan: '1 saat önce',
      url: 'https://pizzapalace.masapp.com/masa/2'
    },
    {
      id: 3,
      name: 'Masa 1 - Cafe Central',
      restaurant: 'Cafe Central',
      tableNumber: '1',
      qrCode: 'QR003',
      status: 'inactive',
      scans: 67,
      createdAt: '2024-01-20',
      lastScan: '3 gün önce',
      url: 'https://cafecentral.masapp.com/masa/1'
    },
    {
      id: 4,
      name: 'Masa 3 - Pizza Palace',
      restaurant: 'Pizza Palace',
      tableNumber: '3',
      qrCode: 'QR004',
      status: 'active',
      scans: 312,
      createdAt: '2024-01-15',
      lastScan: '30 dakika önce',
      url: 'https://pizzapalace.masapp.com/masa/3'
    },
    {
      id: 5,
      name: 'Masa 2 - Cafe Central',
      restaurant: 'Cafe Central',
      tableNumber: '2',
      qrCode: 'QR005',
      status: 'pending',
      scans: 0,
      createdAt: '2024-01-25',
      lastScan: 'Hiç taranmadı',
      url: 'https://cafecentral.masapp.com/masa/2'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Pasif';
      case 'pending':
        return 'Beklemede';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return FaCheckCircle;
      case 'inactive':
        return FaTimesCircle;
      case 'pending':
        return FaClock;
      default:
        return FaClock;
    }
  };

  return (
    <ModernAdminLayout title="QR Kodlar" description="Tüm QR kodları yönetin">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">QR Kod Yönetimi</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {qrCodes.length} QR Kod
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaFilter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FaDownload className="w-4 h-4" />
            <span>Toplu İndir</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus className="w-4 h-4" />
            <span>Yeni QR Kod</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="QR kod ara..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam QR Kod</p>
              <p className="text-3xl font-bold text-gray-900">{qrCodes.length}</p>
            </div>
            <FaQrcode className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif QR Kod</p>
              <p className="text-3xl font-bold text-green-600">
                {qrCodes.filter(qr => qr.status === 'active').length}
              </p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Tarama</p>
              <p className="text-3xl font-bold text-purple-600">
                {qrCodes.reduce((sum, qr) => sum + qr.scans, 0)}
              </p>
            </div>
            <FaEye className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ortalama Tarama</p>
              <p className="text-3xl font-bold text-orange-600">
                {Math.round(qrCodes.reduce((sum, qr) => sum + qr.scans, 0) / qrCodes.length)}
              </p>
            </div>
            <FaEye className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* QR Codes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QR Kod
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restoran
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Masa
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarama Sayısı
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Tarama
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qrCodes.map((qr) => {
                const StatusIcon = getStatusIcon(qr.status);
                return (
                  <tr key={qr.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                          <FaQrcode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{qr.name}</div>
                          <div className="text-sm text-gray-500">{qr.qrCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaStore className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{qr.restaurant}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Masa {qr.tableNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(qr.status)}`}>
                          {getStatusText(qr.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaEye className="w-4 h-4 mr-2 text-gray-400" />
                        {qr.scans} tarama
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {qr.lastScan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1" title="Görüntüle">
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1" title="İndir">
                          <FaDownload className="w-4 h-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900 p-1" title="Yazdır">
                          <FaPrint className="w-4 h-4" />
                        </button>
                        <button className="text-orange-600 hover:text-orange-900 p-1" title="Kopyala">
                          <FaCopy className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1" title="Sil">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Preview Modal Placeholder */}
      <div className="mt-8 bg-gray-50 rounded-xl p-8 text-center">
        <FaQrcode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">QR Kod Önizleme</h3>
        <p className="text-gray-500 mb-4">QR kod detaylarını görüntülemek için yukarıdaki tablodan bir QR kod seçin</p>
        <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
          <span className="text-gray-400">QR Kod Önizleme</span>
        </div>
      </div>
    </ModernAdminLayout>
  );
}

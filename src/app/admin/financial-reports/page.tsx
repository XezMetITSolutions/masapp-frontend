'use client';

import { useMemo, useState } from 'react';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaDownload, 
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaUsers,
  FaBuilding,
  FaCreditCard,
  FaPercentage,
  FaTrendingUp,
  FaTrendingDown,
  FaFileAlt,
  FaPrint,
  FaShare,
  FaEye,
  FaEdit,
  FaTrash,
  FaCog,
  FaArrowUp,
  FaArrowDown,
  FaMinus
} from 'react-icons/fa';

export default function FinancialReports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCommissionIndex, setSelectedCommissionIndex] = useState<number | null>(null);
  const [editableCommission, setEditableCommission] = useState<{ restaurant: string; commission: number; percentage: number; status: string } | null>(null);

  const financialData = {
    totalRevenue: 2450000,
    monthlyRevenue: 180000,
    dailyRevenue: 6000,
    totalCommissions: 122500,
    monthlyCommissions: 9000,
    activeRestaurants: 1189,
    totalOrders: 45678,
    averageOrderValue: 53.6,
    growthRate: 8.2,
    commissionRate: 5.0
  };

  const revenueData = [
    { month: 'Ocak', revenue: 150000, orders: 2800, commission: 7500 },
    { month: 'Şubat', revenue: 165000, orders: 3100, commission: 8250 },
    { month: 'Mart', revenue: 180000, orders: 3400, commission: 9000 },
    { month: 'Nisan', revenue: 195000, orders: 3700, commission: 9750 },
    { month: 'Mayıs', revenue: 210000, orders: 4000, commission: 10500 },
    { month: 'Haziran', revenue: 225000, orders: 4300, commission: 11250 }
  ];

  const topRestaurants = [
    { id: 1, name: 'Pizza Palace', revenue: 125000, orders: 1250, commission: 6250, growth: 12.5 },
    { id: 2, name: 'Burger King', revenue: 98000, orders: 980, commission: 4900, growth: 8.3 },
    { id: 3, name: 'Sushi Master', revenue: 89500, orders: 890, commission: 4475, growth: 15.2 },
    { id: 4, name: 'Coffee Corner', revenue: 45200, orders: 450, commission: 2260, growth: 5.7 },
    { id: 5, name: 'Steak House', revenue: 38200, orders: 380, commission: 1910, growth: -2.1 }
  ];

  const commissionData = [
    { restaurant: 'Pizza Palace', commission: 6250, percentage: 5.0, status: 'paid' },
    { restaurant: 'Burger King', commission: 4900, percentage: 5.0, status: 'paid' },
    { restaurant: 'Sushi Master', commission: 4475, percentage: 5.0, status: 'pending' },
    { restaurant: 'Coffee Corner', commission: 2260, percentage: 5.0, status: 'paid' },
    { restaurant: 'Steak House', commission: 1910, percentage: 5.0, status: 'overdue' }
  ];

  const commissions = useMemo(() => commissionData, []);

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'paid': return 'Ödendi';
      case 'pending': return 'Bekliyor';
      case 'overdue': return 'Gecikmiş';
      default: return status;
    }
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <FaTrendingUp className="text-green-600" />;
    if (growth < 0) return <FaTrendingDown className="text-red-600" />;
    return <FaMinus className="text-gray-600" />;
  };

  const getGrowthClass = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const downloadCSV = (filename: string, rows: Array<Record<string, unknown>>) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    if (activeTab === 'commissions') {
      downloadCSV('komisyonlar.csv', commissions.map(c => ({
        Isletme: c.restaurant,
        Komisyon: c.commission,
        Oran: c.percentage,
        Durum: getStatusText(c.status)
      })));
      return;
    }
    if (activeTab === 'overview') {
      const metrics = [{
        ToplamGelir: financialData.totalRevenue,
        AylikGelir: financialData.monthlyRevenue,
        ToplamKomisyon: financialData.totalCommissions,
        AktifIsletme: financialData.activeRestaurants,
        ToplamSiparis: financialData.totalOrders,
        OrtalamaSepet: financialData.averageOrderValue,
        BuyumeOrani: financialData.growthRate,
        KomisyonOrani: financialData.commissionRate
      }];
      downloadCSV('genel-bakis-metrikleri.csv', metrics as any);
      return;
    }
    // For other tabs, just export a placeholder for now
    downloadCSV(`${activeTab}-raporu.csv`, [{ Not: 'Bu sekme icin veri yakinda eklenecek' }]);
  };

  const handleGenerateReport = () => {
    window.print();
  };

  const openViewModal = (index: number) => {
    setSelectedCommissionIndex(index);
    setIsViewModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setSelectedCommissionIndex(index);
    const item = commissions[index];
    setEditableCommission({ ...item });
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedCommissionIndex(null);
    setEditableCommission(null);
  };

  const handleSaveEdit = () => {
    // Normally we'd persist to API; for now, just close the modal
    closeModals();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mali Raporlar</h1>
              <p className="text-gray-600 mt-1">Finansal analizler ve gelir raporları</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={handleDownload} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
                <FaDownload className="mr-2" />
                Excel İndir
              </button>
              <button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                <FaFileAlt className="mr-2" />
                Rapor Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-8 py-4">
        <div className="border-b border-gray-200">
          <div className="overflow-x-auto">
          <nav className="-mb-px inline-flex whitespace-nowrap space-x-6 sm:space-x-8 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaChartLine className="inline mr-2" />
              Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaMoneyBillWave className="inline mr-2" />
              Gelir Analizi
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'commissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaPercentage className="inline mr-2" />
              Komisyonlar
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'restaurants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaBuilding className="inline mr-2" />
              İşletme Analizi
            </button>
          </nav>
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="px-8 py-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Toplam Gelir</p>
                  <p className="text-3xl font-bold text-gray-900">{financialData.totalRevenue.toLocaleString()} ₺</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <FaArrowUp className="mr-1" />
                    +{financialData.growthRate}% bu ay
                  </p>
                </div>
                <div className="h-16 w-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaMoneyBillWave className="text-2xl text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Aylık Gelir</p>
                  <p className="text-3xl font-bold text-gray-900">{financialData.monthlyRevenue.toLocaleString()} ₺</p>
                  <p className="text-sm text-gray-500 mt-1">Mart 2024</p>
                </div>
                <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaChartLine className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Toplam Komisyon</p>
                  <p className="text-3xl font-bold text-gray-900">{financialData.totalCommissions.toLocaleString()} ₺</p>
                  <p className="text-sm text-gray-500 mt-1">%{financialData.commissionRate} oran</p>
                </div>
                <div className="h-16 w-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaPercentage className="text-2xl text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Aktif İşletme</p>
                  <p className="text-3xl font-bold text-gray-900">{financialData.activeRestaurants.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Toplam sipariş: {financialData.totalOrders.toLocaleString()}</p>
                </div>
                <div className="h-16 w-16 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaBuilding className="text-2xl text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Gelir Trendi</h3>
            <div className="h-64 flex items-end space-x-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-full mb-2"
                    style={{ height: `${(data.revenue / 250000) * 200}px` }}
                  ></div>
                  <div className="text-xs text-gray-500">{data.month}</div>
                  <div className="text-xs font-medium text-gray-900">{data.revenue.toLocaleString()} ₺</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Restaurants */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">En Yüksek Gelirli İşletmeler</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşletme</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gelir</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komisyon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Büyüme</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topRestaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <FaBuilding className="text-gray-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {restaurant.revenue.toLocaleString()} ₺
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {restaurant.orders.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {restaurant.commission.toLocaleString()} ₺
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm ${getGrowthClass(restaurant.growth)}`}>
                          {getGrowthIcon(restaurant.growth)}
                          <span className="ml-1">{restaurant.growth > 0 ? '+' : ''}{restaurant.growth}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Detaylı Gelir Analizi</h2>
            <p className="text-gray-600">Gelir analizi özelliği yakında eklenecek.</p>
          </div>
        </div>
      )}

      {/* Commissions Tab */}
      {activeTab === 'commissions' && (
        <div className="px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Komisyon Ödemeleri</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşletme</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komisyon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oran</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commissionData.map((commission, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <FaBuilding className="text-gray-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{commission.restaurant}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {commission.commission.toLocaleString()} ₺
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        %{commission.percentage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusClass(commission.status)}`}>
                          {getStatusText(commission.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button onClick={() => openViewModal(index)} className="text-blue-600 hover:text-blue-800">
                            <FaEye className="text-sm" />
                          </button>
                          <button onClick={() => openEditModal(index)} className="text-green-600 hover:text-green-800">
                            <FaEdit className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <div className="px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">İşletme Performans Analizi</h2>
            <p className="text-gray-600">İşletme analizi özelliği yakında eklenecek.</p>
          </div>
        </div>
      )}
      {/* View Modal */}
      {isViewModalOpen && selectedCommissionIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={closeModals}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Komisyon Detayı</h3>
            <div className="space-y-2 text-sm text-gray-800">
              <div className="flex justify-between"><span className="text-gray-500">İşletme</span><span>{commissions[selectedCommissionIndex].restaurant}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Komisyon</span><span>{commissions[selectedCommissionIndex].commission.toLocaleString()} ₺</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Oran</span><span>%{commissions[selectedCommissionIndex].percentage}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Durum</span><span>{getStatusText(commissions[selectedCommissionIndex].status)}</span></div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={closeModals} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800">Kapat</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {isEditModalOpen && editableCommission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={closeModals}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Komisyonu Düzenle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">İşletme</label>
                <input value={editableCommission.restaurant} onChange={e => setEditableCommission({ ...editableCommission, restaurant: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Komisyon (₺)</label>
                  <input type="number" value={editableCommission.commission} onChange={e => setEditableCommission({ ...editableCommission, commission: Number(e.target.value) })} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Oran (%)</label>
                  <input type="number" step="0.1" value={editableCommission.percentage} onChange={e => setEditableCommission({ ...editableCommission, percentage: Number(e.target.value) })} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Durum</label>
                <select value={editableCommission.status} onChange={e => setEditableCommission({ ...editableCommission, status: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="paid">Ödendi</option>
                  <option value="pending">Bekliyor</option>
                  <option value="overdue">Gecikmiş</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={closeModals} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800">İptal</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

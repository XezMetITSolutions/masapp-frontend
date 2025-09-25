'use client';

import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaStore, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaQrcode
} from 'react-icons/fa';

export default function RestaurantsPage() {
  const restaurants = [
    {
      id: 1,
      name: 'Pizza Palace',
      owner: 'Ahmet Yılmaz',
      email: 'ahmet@pizzapalace.com',
      phone: '+90 212 555 0123',
      address: 'Kadıköy, İstanbul',
      status: 'active',
      subdomain: 'pizzapalace',
      qrCount: 15,
      createdAt: '2024-01-15',
      lastOrder: '2 saat önce'
    },
    {
      id: 2,
      name: 'Cafe Central',
      owner: 'Ayşe Demir',
      email: 'ayse@cafecentral.com',
      phone: '+90 216 555 0456',
      address: 'Beşiktaş, İstanbul',
      status: 'pending',
      subdomain: 'cafecentral',
      qrCount: 8,
      createdAt: '2024-01-20',
      lastOrder: '1 gün önce'
    },
    {
      id: 3,
      name: 'Burger King',
      owner: 'Mehmet Kaya',
      email: 'mehmet@burgerking.com',
      phone: '+90 312 555 0789',
      address: 'Çankaya, Ankara',
      status: 'active',
      subdomain: 'burgerking',
      qrCount: 25,
      createdAt: '2024-01-10',
      lastOrder: '30 dakika önce'
    },
    {
      id: 4,
      name: 'Sushi Master',
      owner: 'Zeynep Özkan',
      email: 'zeynep@sushimaster.com',
      phone: '+90 232 555 0321',
      address: 'Konak, İzmir',
      status: 'suspended',
      subdomain: 'sushimaster',
      qrCount: 12,
      createdAt: '2024-01-25',
      lastOrder: '3 gün önce'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'pending':
        return 'Beklemede';
      case 'suspended':
        return 'Askıya Alındı';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <ModernAdminLayout title="Restoranlar" description="Tüm restoranları yönetin">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Restoran Yönetimi</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {restaurants.length} Restoran
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaFilter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus className="w-4 h-4" />
            <span>Yeni Restoran</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Restoran ara..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Restoran</p>
              <p className="text-3xl font-bold text-gray-900">{restaurants.length}</p>
            </div>
            <FaStore className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Restoran</p>
              <p className="text-3xl font-bold text-green-600">
                {restaurants.filter(r => r.status === 'active').length}
              </p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Beklemede</p>
              <p className="text-3xl font-bold text-yellow-600">
                {restaurants.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <FaClock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Askıya Alınan</p>
              <p className="text-3xl font-bold text-red-600">
                {restaurants.filter(r => r.status === 'suspended').length}
              </p>
            </div>
            <FaTimesCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restoran
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sahip
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QR Kodlar
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Sipariş
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                        <FaStore className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        <div className="text-sm text-gray-500">{restaurant.subdomain}.masapp.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{restaurant.owner}</div>
                    <div className="text-sm text-gray-500">{restaurant.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 mb-1">
                      <FaPhone className="w-3 h-3 mr-2 text-gray-400" />
                      {restaurant.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="w-3 h-3 mr-2 text-gray-400" />
                      {restaurant.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(restaurant.status)}`}>
                      {getStatusText(restaurant.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FaQrcode className="w-4 h-4 mr-2 text-gray-400" />
                      {restaurant.qrCount} QR Kod
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {restaurant.lastOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModernAdminLayout>
  );
}

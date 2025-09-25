'use client';

import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaUsers, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 212 555 0123',
      role: 'restaurant_owner',
      status: 'active',
      restaurant: 'Pizza Palace',
      lastLogin: '2 saat önce',
      createdAt: '2024-01-15',
      location: 'İstanbul, Türkiye'
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '+90 216 555 0456',
      role: 'restaurant_owner',
      status: 'pending',
      restaurant: 'Cafe Central',
      lastLogin: '1 gün önce',
      createdAt: '2024-01-20',
      location: 'İstanbul, Türkiye'
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      phone: '+90 312 555 0789',
      role: 'admin',
      status: 'active',
      restaurant: null,
      lastLogin: '30 dakika önce',
      createdAt: '2024-01-10',
      location: 'Ankara, Türkiye'
    },
    {
      id: 4,
      name: 'Zeynep Özkan',
      email: 'zeynep@example.com',
      phone: '+90 232 555 0321',
      role: 'restaurant_owner',
      status: 'suspended',
      restaurant: 'Sushi Master',
      lastLogin: '3 gün önce',
      createdAt: '2024-01-25',
      location: 'İzmir, Türkiye'
    },
    {
      id: 5,
      name: 'Ali Veli',
      email: 'ali@example.com',
      phone: '+90 532 555 0654',
      role: 'customer',
      status: 'active',
      restaurant: null,
      lastLogin: '1 saat önce',
      createdAt: '2024-02-01',
      location: 'Bursa, Türkiye'
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'restaurant_owner':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Yönetici';
      case 'restaurant_owner':
        return 'Restoran Sahibi';
      case 'customer':
        return 'Müşteri';
      default:
        return 'Bilinmiyor';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return FaUserShield;
      case 'restaurant_owner':
        return FaUserCheck;
      case 'customer':
        return FaUsers;
      default:
        return FaUsers;
    }
  };

  return (
    <ModernAdminLayout title="Kullanıcılar" description="Tüm kullanıcıları yönetin">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {users.length} Kullanıcı
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaFilter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus className="w-4 h-4" />
            <span>Yeni Kullanıcı</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
            <FaUsers className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
              <p className="text-3xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
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
                {users.filter(u => u.status === 'pending').length}
              </p>
            </div>
            <FaClock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Restoran Sahibi</p>
              <p className="text-3xl font-bold text-purple-600">
                {users.filter(u => u.role === 'restaurant_owner').length}
              </p>
            </div>
            <FaUserCheck className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restoran
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-sm">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RoleIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <FaPhone className="w-3 h-3 mr-2 text-gray-400" />
                        {user.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="w-3 h-3 mr-2 text-gray-400" />
                        {user.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.restaurant || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ModernAdminLayout>
  );
}

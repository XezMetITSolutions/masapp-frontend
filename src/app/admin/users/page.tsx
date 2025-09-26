'use client';

import { useState, useEffect } from 'react';
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
  const [users, setUsers] = useState<any[]>([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    location: '',
    restaurant: ''
  });

  // localStorage'dan kullanıcıları yükle
  useEffect(() => {
    const savedUsers = localStorage.getItem('masapp-users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Demo kullanıcılar oluştur
      const demoUsers = [
        {
          id: 'user-1',
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '+90 555 123 4567',
          role: 'restaurant_owner',
          status: 'active',
          location: 'İstanbul, Türkiye',
          restaurant: 'Kardesler Restoran',
          lastLogin: '2024-01-15 14:30'
        },
        {
          id: 'user-2',
          name: 'Fatma Demir',
          email: 'fatma@example.com',
          phone: '+90 555 234 5678',
          role: 'customer',
          status: 'active',
          location: 'Ankara, Türkiye',
          restaurant: '',
          lastLogin: '2024-01-14 09:15'
        },
        {
          id: 'user-3',
          name: 'Mehmet Kaya',
          email: 'mehmet@example.com',
          phone: '+90 555 345 6789',
          role: 'admin',
          status: 'active',
          location: 'İzmir, Türkiye',
          restaurant: '',
          lastLogin: '2024-01-15 16:45'
        }
      ];
      setUsers(demoUsers);
      localStorage.setItem('masapp-users', JSON.stringify(demoUsers));
    }
  }, []);

  // Kullanıcıları localStorage'a kaydet
  const saveUsersToStorage = (newUsers: any[]) => {
    localStorage.setItem('masapp-users', JSON.stringify(newUsers));
  };

  // Yeni kullanıcı ekle
  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      alert('Lütfen ad ve email alanlarını doldurun.');
      return;
    }

    const user = {
      id: `user-${Date.now()}`,
      ...newUser,
      lastLogin: 'Henüz giriş yapmadı'
    };

    const updatedUsers = [user, ...users];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
      location: '',
      restaurant: ''
    });
    setShowNewUserModal(false);
    
    alert('Kullanıcı başarıyla oluşturuldu!');
  };

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
          <button 
            onClick={() => setShowNewUserModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
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

      {/* New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Yeni Kullanıcı Ekle</h3>
              <button
                onClick={() => setShowNewUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Kullanıcı adı girin..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+90 555 123 4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="customer">Müşteri</option>
                    <option value="restaurant_owner">Restoran Sahibi</option>
                    <option value="admin">Yönetici</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="pending">Beklemede</option>
                    <option value="suspended">Askıya Alındı</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konum
                  </label>
                  <input
                    type="text"
                    value={newUser.location}
                    onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="İstanbul, Türkiye"
                  />
                </div>
              </div>
              
              {newUser.role === 'restaurant_owner' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restoran
                  </label>
                  <input
                    type="text"
                    value={newUser.restaurant}
                    onChange={(e) => setNewUser({ ...newUser, restaurant: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Restoran adı girin..."
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowNewUserModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FaPlus />
                Kullanıcı Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </ModernAdminLayout>
  );
}

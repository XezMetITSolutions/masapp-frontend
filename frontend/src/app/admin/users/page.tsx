'use client';

import { useState, useEffect } from 'react';
import ResponsiveTable from '@/components/ResponsiveTable';
import AdminLayout from '@/components/admin/AdminLayout';
import apiService from '@/services/api';
import { 
  FaUsers, 
  FaSearch, 
  FaFilter, 
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaShieldAlt
} from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff' | 'customer' | 'restaurant_owner';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  restaurant?: string;
  lastLogin: string;
  createdAt: string;
  avatar?: string;
  username?: string;
}

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Backend'den kullanıcıları çek
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getAllRestaurantUsers();
        if (response.success) {
          setUsers(response.data);
        } else {
          console.error('API response failed:', response);
          // Fallback data for development
          setUsers([
            {
              id: 'demo-1',
              name: 'Demo Restoran',
              email: 'demo@restoran.com',
              phone: '+90 555 123 4567',
              role: 'restaurant_owner',
              status: 'active',
              restaurant: 'Demo Restoran',
              lastLogin: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              username: 'demo-restoran'
            }
          ]);
        }
      } catch (error) {
        console.error('Kullanıcıları çekme hatası:', error);
        // Fallback data for development
        setUsers([
          {
            id: 'demo-1',
            name: 'Demo Restoran',
            email: 'demo@restoran.com',
            phone: '+90 555 123 4567',
            role: 'restaurant_owner',
            status: 'active',
            restaurant: 'Demo Restoran',
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            username: 'demo-restoran'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleClass = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-gray-100 text-gray-800';
      case 'restaurant_owner': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch(role) {
      case 'admin': return 'Admin';
      case 'manager': return 'Yönetici';
      case 'staff': return 'Personel';
      case 'customer': return 'Müşteri';
      case 'restaurant_owner': return 'İşletme Sahibi';
      default: return role;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'pending': return 'Beklemede';
      case 'suspended': return 'Askıya Alındı';
      default: return status;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Kullanıcı',
      sortable: true,
      render: (value: string, row: User) => (
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <FaUsers className="text-gray-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
            {row.username && (
              <div className="text-xs text-gray-400">@{row.username}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleClass(value)}`}>
          {getRoleText(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Durum',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusClass(value)}`}>
          {getStatusText(value)}
        </span>
      )
    },
    {
      key: 'restaurant',
      label: 'İşletme',
      sortable: true,
      render: (value: string) => value || '-'
    },
    {
      key: 'lastLogin',
      label: 'Son Giriş',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('tr-TR')
    },
    {
      key: 'createdAt',
      label: 'Kayıt Tarihi',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('tr-TR')
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = async (action: string, user: User) => {
    setIsLoading(true);
    try {
      // Demo: Kullanıcı işlemi simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`${action} işlemi:`, user);
      alert(`${action} işlemi tamamlandı`);
    } catch (error) {
      console.error('User action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Kullanıcı Yönetimi" description="Kullanıcı hesaplarını yönetin">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
              <p className="text-gray-600 mt-1">Sistem kullanıcılarını görüntüle ve yönet</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center">
                <FaPlus className="mr-2" />
                Yeni Kullanıcı
              </button>
              <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center">
                <FaUserCheck className="mr-2" />
                Toplu Onay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ad, email veya telefon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Roller</option>
                <option value="admin">Admin</option>
                <option value="manager">Yönetici</option>
                <option value="staff">Personel</option>
                <option value="customer">Müşteri</option>
                <option value="restaurant_owner">İşletme Sahibi</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="pending">Beklemede</option>
                <option value="suspended">Askıya Alındı</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center">
                <FaFilter className="mr-2" />
                Filtrele
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <FaCheck className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <FaTimes className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Beklemede</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <FaShieldAlt className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Admin</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="px-8">
        <ResponsiveTable
          columns={columns}
          data={filteredUsers}
          onAction={handleUserAction}
          mobileView="card"
        />
      </div>
    </AdminLayout>
  );
}

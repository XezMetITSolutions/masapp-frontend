'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResponsiveTable from '@/components/ResponsiveTable';
import { 
  FaBuilding, 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaStar,
  FaUsers,
  FaQrcode
} from 'react-icons/fa';

interface Restaurant {
  id: string;
  name: string;
  subdomain: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  rating: number;
  totalOrders: number;
  monthlyRevenue: number;
  owner: string;
  createdAt: string;
  lastActivity: string;
}

export default function RestaurantsManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const restaurants: Restaurant[] = [
    {
      id: 'rest-1',
      name: 'Pizza Palace',
      subdomain: 'pizzapalace',
      category: 'İtalyan',
      address: 'Kadıköy, İstanbul',
      phone: '+90 555 123 4567',
      email: 'info@pizzapalace.com',
      status: 'active',
      rating: 4.5,
      totalOrders: 1250,
      monthlyRevenue: 45000,
      owner: 'Ahmet Yılmaz',
      createdAt: '2024-01-15T08:00:00Z',
      lastActivity: '2024-03-15T10:30:00Z'
    },
    {
      id: 'rest-2',
      name: 'Burger King',
      subdomain: 'burgerking',
      category: 'Fast Food',
      address: 'Beşiktaş, İstanbul',
      phone: '+90 555 234 5678',
      email: 'info@burgerking.com',
      status: 'active',
      rating: 4.2,
      totalOrders: 2100,
      monthlyRevenue: 78000,
      owner: 'Ayşe Demir',
      createdAt: '2024-01-20T10:30:00Z',
      lastActivity: '2024-03-15T09:15:00Z'
    },
    {
      id: 'rest-3',
      name: 'Sushi Master',
      subdomain: 'sushimaster',
      category: 'Japon',
      address: 'Şişli, İstanbul',
      phone: '+90 555 345 6789',
      email: 'info@sushimaster.com',
      status: 'pending',
      rating: 0,
      totalOrders: 0,
      monthlyRevenue: 0,
      owner: 'Mehmet Kaya',
      createdAt: '2024-03-10T14:30:00Z',
      lastActivity: '2024-03-10T14:30:00Z'
    },
    {
      id: 'rest-4',
      name: 'Coffee Corner',
      subdomain: 'coffeecorner',
      category: 'Kahve',
      address: 'Beyoğlu, İstanbul',
      phone: '+90 555 456 7890',
      email: 'info@coffeecorner.com',
      status: 'active',
      rating: 4.8,
      totalOrders: 890,
      monthlyRevenue: 32000,
      owner: 'Fatma Özkan',
      createdAt: '2024-02-01T12:00:00Z',
      lastActivity: '2024-03-15T08:45:00Z'
    },
    {
      id: 'rest-5',
      name: 'Steak House',
      subdomain: 'steakhouse',
      category: 'Et Restoranı',
      address: 'Etiler, İstanbul',
      phone: '+90 555 567 8901',
      email: 'info@steakhouse.com',
      status: 'suspended',
      rating: 3.9,
      totalOrders: 650,
      monthlyRevenue: 28000,
      owner: 'Ali Veli',
      createdAt: '2024-01-25T16:20:00Z',
      lastActivity: '2024-03-05T18:30:00Z'
    }
  ];

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

  const getCategoryClass = (category: string) => {
    switch(category) {
      case 'İtalyan': return 'bg-red-100 text-red-800';
      case 'Fast Food': return 'bg-orange-100 text-orange-800';
      case 'Japon': return 'bg-blue-100 text-blue-800';
      case 'Kahve': return 'bg-yellow-100 text-yellow-800';
      case 'Et Restoranı': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Restoran',
      sortable: true,
      render: (value: string, row: Restaurant) => (
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
            <FaBuilding className="text-gray-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.category}</div>
            <div className="text-xs text-blue-600 mt-1">
              <a href={`https://${row.subdomain}.guzellestir.com`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {row.subdomain}.guzellestir.com
              </a>
            </div>
          </div>
        </div>
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
      key: 'rating',
      label: 'Puan',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{value > 0 ? value.toFixed(1) : '-'}</span>
        </div>
      )
    },
    {
      key: 'totalOrders',
      label: 'Toplam Sipariş',
      sortable: true,
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'monthlyRevenue',
      label: 'Aylık Gelir',
      sortable: true,
      render: (value: number) => `${value.toLocaleString()} ₺`
    },
    {
      key: 'owner',
      label: 'Sahip',
      sortable: true
    },
    {
      key: 'createdAt',
      label: 'Kayıt Tarihi',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('tr-TR')
    }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || restaurant.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRestaurantAction = async (action: string, restaurant: Restaurant) => {
    setIsLoading(true);
    try {
      // Demo: Restoran işlemi simülasyonu
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`${action} işlemi:`, restaurant);
      
      // Farklı aksiyonlar için gerçek işlevler
      switch(action) {
        case 'view':
          // Restoran detay sayfasına yönlendir
          router.push(`/admin/restaurants/${restaurant.id}`);
          break;
        case 'edit':
          // Restoran düzenleme sayfasına yönlendir
          router.push(`/admin/restaurants/${restaurant.id}/edit`);
          break;
        case 'delete':
          // Restoranı listeden kaldır
          const index = restaurants.findIndex(r => r.id === restaurant.id);
          if (index > -1) {
            restaurants.splice(index, 1);
            // Sayfayı yenile
            router.refresh();
          }
          break;
        default:
          console.log(`${action} işlemi tamamlandı`);
      }
    } catch (error) {
      console.error('Restaurant action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRestaurant = () => {
    // Yeni restoran ekleme sayfasına yönlendir
    router.push('/admin/restaurants/add');
  };

  const handleBulkApprove = () => {
    const pendingRestaurants = restaurants.filter(r => r.status === 'pending');
    if (pendingRestaurants.length === 0) {
      return;
    }
    
    // Beklemedeki restoranları aktif yap
    restaurants.forEach(restaurant => {
      if (restaurant.status === 'pending') {
        restaurant.status = 'active';
      }
    });
    
    // Sayfayı yenile
    router.refresh();
  };

  const handleQRManagement = () => {
    // QR kod yönetimi sayfasına yönlendir
    router.push('/admin/qr-management');
  };

  const handleFilter = () => {
    // Filtreleme zaten otomatik olarak çalışıyor, sadece scroll yap
    document.querySelector('.bg-white.rounded-lg.shadow-sm.border.border-gray-200.overflow-hidden')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restoran Yönetimi</h1>
              <p className="text-gray-600 mt-1">İşletmeleri görüntüle ve yönet</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleAddRestaurant}
                disabled={isLoading}
                className="bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-blue-700 px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaPlus className="mr-2" />
                Yeni Restoran
              </button>
              <button 
                onClick={handleBulkApprove}
                disabled={isLoading}
                className="bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed text-green-700 px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaCheck className="mr-2" />
                Toplu Onay
              </button>
              <button 
                onClick={handleQRManagement}
                disabled={isLoading}
                className="bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed text-purple-700 px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaQrcode className="mr-2" />
                QR Kodlar
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
                  placeholder="Restoran adı, kategori veya adres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="İtalyan">İtalyan</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Japon">Japon</option>
                <option value="Kahve">Kahve</option>
                <option value="Et Restoranı">Et Restoranı</option>
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
              <button 
                onClick={handleFilter}
                disabled={isLoading}
                className="w-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
              >
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
                <FaBuilding className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Restoran</p>
                <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <FaCheck className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktif Restoran</p>
                <p className="text-2xl font-bold text-gray-900">{restaurants.filter(r => r.status === 'active').length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{restaurants.filter(r => r.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{restaurants.reduce((sum, r) => sum + r.totalOrders, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="px-8">
        <ResponsiveTable
          columns={columns}
          data={filteredRestaurants}
          onAction={handleRestaurantAction}
          mobileView="card"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaGlobe, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaExternalLinkAlt,
  FaServer,
  FaClock,
  FaDollarSign,
  FaUsers,
  FaChartLine,
  FaCog,
  FaShieldAlt
} from 'react-icons/fa';

interface Subdomain {
  id: string;
  subdomain: string;
  restaurantName: string;
  restaurantId: string;
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  plan: 'basic' | 'premium' | 'pro';
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  lastActivity: string;
  dnsStatus: 'active' | 'pending' | 'error';
  totalVisits: number;
  monthlyRevenue: number;
}

export default function SubdomainsManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);

  // Demo subdomain verileri
  useEffect(() => {
    const demoSubdomains: Subdomain[] = [
      {
        id: 'sub-1',
        subdomain: 'kardesler',
        restaurantName: 'Kardeşler Restoran',
        restaurantId: 'rest-1',
        status: 'active',
        plan: 'premium',
        ownerName: 'Ahmet Yılmaz',
        ownerEmail: 'info@kardesler.com',
        createdAt: '2024-03-15T08:00:00Z',
        lastActivity: '2024-03-15T10:30:00Z',
        dnsStatus: 'active',
        totalVisits: 1250,
        monthlyRevenue: 45000
      },
      {
        id: 'sub-2',
        subdomain: 'pizza-palace',
        restaurantName: 'Pizza Palace',
        restaurantId: 'rest-2',
        status: 'pending',
        plan: 'basic',
        ownerName: 'Ayşe Demir',
        ownerEmail: 'info@pizzapalace.com',
        createdAt: '2024-03-20T10:30:00Z',
        lastActivity: '2024-03-20T10:30:00Z',
        dnsStatus: 'pending',
        totalVisits: 0,
        monthlyRevenue: 0
      },
      {
        id: 'sub-3',
        subdomain: 'sushi-master',
        restaurantName: 'Sushi Master',
        restaurantId: 'rest-3',
        status: 'active',
        plan: 'pro',
        ownerName: 'Mehmet Kaya',
        ownerEmail: 'info@sushimaster.com',
        createdAt: '2024-03-10T14:30:00Z',
        lastActivity: '2024-03-15T09:15:00Z',
        dnsStatus: 'active',
        totalVisits: 890,
        monthlyRevenue: 32000
      },
      {
        id: 'sub-4',
        subdomain: 'coffee-corner',
        restaurantName: 'Coffee Corner',
        restaurantId: 'rest-4',
        status: 'active',
        plan: 'basic',
        ownerName: 'Fatma Özkan',
        ownerEmail: 'info@coffeecorner.com',
        createdAt: '2024-02-01T12:00:00Z',
        lastActivity: '2024-03-15T08:45:00Z',
        dnsStatus: 'active',
        totalVisits: 650,
        monthlyRevenue: 18000
      }
    ];
    setSubdomains(demoSubdomains);
  }, []);

  const filteredSubdomains = subdomains.filter(subdomain => {
    const matchesSearch = subdomain.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subdomain.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subdomain.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subdomain.status === statusFilter;
    const matchesPlan = planFilter === 'all' || subdomain.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleSubdomainAction = async (action: string, subdomain: Subdomain) => {
    setIsLoading(true);
    try {
      // Demo: Subdomain işlemi simülasyonu
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`${action} işlemi:`, subdomain);
      
      switch(action) {
        case 'view':
          router.push(`/admin/subdomains/${subdomain.id}`);
          break;
        case 'edit':
          router.push(`/admin/subdomains/${subdomain.id}/edit`);
          break;
        case 'delete':
          const index = subdomains.findIndex(s => s.id === subdomain.id);
          if (index > -1) {
            subdomains.splice(index, 1);
            setSubdomains([...subdomains]);
          }
          break;
        case 'activate':
          subdomain.status = 'active';
          setSubdomains([...subdomains]);
          break;
        case 'suspend':
          subdomain.status = 'suspended';
          setSubdomains([...subdomains]);
          break;
        default:
          console.log(`${action} işlemi tamamlandı`);
      }
    } catch (error) {
      console.error('Subdomain action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubdomain = () => {
    router.push('/admin/subdomains/create');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getPlanBadge = (plan: string) => {
    const badges = {
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      pro: 'bg-orange-100 text-orange-800'
    };
    return badges[plan as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getDNSStatusBadge = (dnsStatus: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return badges[dnsStatus as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subdomain Yönetimi</h1>
              <p className="text-gray-600 mt-1">İşletme subdomainlerini yönet</p>
            </div>
            <button
              onClick={handleCreateSubdomain}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" />
              Yeni Subdomain
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Subdomain, restoran adı veya sahip adı ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="pending">Beklemede</option>
              <option value="inactive">Pasif</option>
              <option value="suspended">Askıya Alınmış</option>
            </select>
            
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Planlar</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subdomains List */}
      <div className="px-8 py-6">
        <div className="grid gap-6">
          {filteredSubdomains.map((subdomain) => (
            <div key={subdomain.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subdomain.subdomain}.guzellestir.com
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(subdomain.status)}`}>
                      {subdomain.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadge(subdomain.plan)}`}>
                      {subdomain.plan}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDNSStatusBadge(subdomain.dnsStatus)}`}>
                      DNS: {subdomain.dnsStatus}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{subdomain.restaurantName}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Sahip: {subdomain.ownerName} ({subdomain.ownerEmail})
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2" />
                      <span>{subdomain.totalVisits.toLocaleString()} ziyaret</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaDollarSign className="mr-2" />
                      <span>₺{subdomain.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{new Date(subdomain.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaChartLine className="mr-2" />
                      <span>Son aktivite: {new Date(subdomain.lastActivity).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <a
                    href={`https://${subdomain.subdomain}.guzellestir.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <FaExternalLinkAlt className="mr-1" />
                    Ziyaret Et
                  </a>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSubdomainAction('view', subdomain)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Görüntüle"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleSubdomainAction('edit', subdomain)}
                      className="text-gray-600 hover:text-gray-800 p-2"
                      title="Düzenle"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleSubdomainAction('dns', subdomain)}
                      className="text-green-600 hover:text-green-800 p-2"
                      title="DNS Ayarları"
                    >
                      <FaServer />
                    </button>
                    <button
                      onClick={() => handleSubdomainAction('settings', subdomain)}
                      className="text-purple-600 hover:text-purple-800 p-2"
                      title="Ayarlar"
                    >
                      <FaCog />
                    </button>
                    <button
                      onClick={() => handleSubdomainAction('delete', subdomain)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Sil"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredSubdomains.length === 0 && (
          <div className="text-center py-12">
            <FaGlobe className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Subdomain bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun subdomain bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}

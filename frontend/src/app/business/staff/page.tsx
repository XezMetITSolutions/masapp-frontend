'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaUsers, 
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
  FaHeadset,
  FaUtensils,
  FaShoppingCart,
  FaQrcode,
  FaBell,
  FaUserPlus,
  FaUserEdit,
  FaUserTimes,
  FaUserCheck,
  FaUserClock,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaSort,
  FaDownload,
  FaPrint,
  FaCreditCard,
  FaCopy,
  FaEyeSlash,
  FaSync,
  FaBars,
  FaMoneyBillWave
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';
import useBusinessSettingsStore from '@/store/useBusinessSettingsStore';

export default function StaffPage() {
  const router = useRouter();
  const { authenticatedRestaurant, isAuthenticated, logout } = useAuthStore();
  const { 
    settings, 
    updateStaffCredentials, 
    generateStaffCredentials 
  } = useBusinessSettingsStore();
  // Feature flag: per-staff panel credentials (keep code but disable UI by default)
  const individualStaffPanelsEnabled = false;
  const [staff, setStaff] = useState<any[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPanelModal, setShowPanelModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [showPasswords, setShowPasswords] = useState({
    kitchen: false,
    waiter: false,
    cashier: false
  });
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'waiter',
    department: 'service',
    salary: '',
    startDate: '',
    notes: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Demo personel verileri
  useEffect(() => {
    const demoStaff = [
      {
        id: 1,
        name: 'Ahmet Yılmaz',
        email: 'ahmet@restaurant.com',
        phone: '0532 123 45 67',
        role: 'manager',
        department: 'management',
        salary: 8500,
        startDate: '2023-01-15',
        status: 'active',
        lastLogin: '2024-01-15 14:30',
        totalOrders: 245,
        rating: 4.8,
        notes: 'Deneyimli yönetici, müşteri memnuniyeti odaklı',
        avatar: null
      },
      {
        id: 2,
        name: 'Fatma Demir',
        email: 'fatma@restaurant.com',
        phone: '0533 987 65 43',
        role: 'waiter',
        department: 'service',
        salary: 4500,
        startDate: '2023-03-20',
        status: 'active',
        lastLogin: '2024-01-15 14:25',
        totalOrders: 189,
        rating: 4.6,
        notes: 'Hızlı ve dikkatli servis',
        avatar: null
      },
      {
        id: 3,
        name: 'Mehmet Kaya',
        email: 'mehmet@restaurant.com',
        phone: '0534 555 44 33',
        role: 'chef',
        department: 'kitchen',
        salary: 6500,
        startDate: '2022-11-10',
        status: 'active',
        lastLogin: '2024-01-15 14:20',
        totalOrders: 0,
        rating: 4.9,
        notes: 'Usta aşçı, yaratıcı menü önerileri',
        avatar: null
      },
      {
        id: 4,
        name: 'Ayşe Özkan',
        email: 'ayse@restaurant.com',
        phone: '0535 777 88 99',
        role: 'waiter',
        department: 'service',
        salary: 4200,
        startDate: '2023-06-01',
        status: 'active',
        lastLogin: '2024-01-15 14:15',
        totalOrders: 156,
        rating: 4.4,
        notes: 'Yeni başlayan, öğrenmeye açık',
        avatar: null
      },
      {
        id: 5,
        name: 'Ali Veli',
        email: 'ali@restaurant.com',
        phone: '0536 111 22 33',
        role: 'cashier',
        department: 'finance',
        salary: 4000,
        startDate: '2023-08-15',
        status: 'inactive',
        lastLogin: '2024-01-10 16:45',
        totalOrders: 0,
        rating: 4.2,
        notes: 'İzinli, 2 hafta sonra dönecek',
        avatar: null
      }
    ];

    setStaff(demoStaff);
    setFilteredStaff(demoStaff);
  }, []);

  // Filtreleme ve arama
  useEffect(() => {
    let filtered = [...staff];

    // Rol filtresi
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    // Arama
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
      );
    }

    setFilteredStaff(filtered);
  }, [staff, roleFilter, statusFilter, searchTerm]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'chef': return 'bg-orange-100 text-orange-800';
      case 'waiter': return 'bg-blue-100 text-blue-800';
      case 'cashier': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'manager': return 'Yönetici';
      case 'chef': return 'Aşçı';
      case 'waiter': return 'Garson';
      case 'cashier': return 'Kasiyer';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'on_leave': return 'İzinli';
      case 'terminated': return 'İşten Ayrıldı';
      default: return status;
    }
  };

  const getDepartmentText = (department: string) => {
    switch (department) {
      case 'management': return 'Yönetim';
      case 'service': return 'Servis';
      case 'kitchen': return 'Mutfak';
      case 'finance': return 'Mali İşler';
      case 'admin': return 'Yönetim';
      default: return department;
    }
  };

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    inactive: staff.filter(s => s.status === 'inactive').length,
    onLeave: staff.filter(s => s.status === 'on_leave').length,
    managers: staff.filter(s => s.role === 'manager').length,
    waiters: staff.filter(s => s.role === 'waiter').length,
    chefs: staff.filter(s => s.role === 'chef').length,
    avgRating: staff.length > 0 ? (staff.reduce((acc, s) => acc + s.rating, 0) / staff.length).toFixed(1) : 0
  };

  const handleAddStaff = () => {
    const name = newStaff.name.trim();
    const email = newStaff.email.trim();
    if (!name) { alert('Ad Soyad zorunludur.'); return; }
    if (!email) { alert('E-posta zorunludur.'); return; }

    const now = new Date();
    const newMember: any = {
      id: Date.now(),
      name: name,
      email: email,
      phone: newStaff.phone.trim(),
      role: newStaff.role,
      department: newStaff.department,
      salary: Number(newStaff.salary || 0),
      startDate: newStaff.startDate || now.toISOString().slice(0, 10),
      status: 'active',
      lastLogin: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
      totalOrders: 0,
      rating: 0,
      notes: newStaff.notes,
      avatar: null
    };

    setStaff(prev => [newMember, ...prev]);
    setShowAddModal(false);
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      role: 'waiter',
      department: 'service',
      salary: '',
      startDate: '',
      notes: ''
    });
  };

  const handleEditStaff = (staffMember: any) => {
    setSelectedStaff(staffMember);
    setShowEditModal(true);
  };
 
  const handleUpdateStaff = () => {
    if (!selectedStaff) { return; }
    const name = (selectedStaff.name || '').trim();
    const email = (selectedStaff.email || '').trim();
    if (!name) { alert('Ad Soyad zorunludur.'); return; }
    if (!email) { alert('E-posta zorunludur.'); return; }

    const updated = {
      ...selectedStaff,
      salary: Number(selectedStaff.salary || 0)
    };

    setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
    setShowEditModal(false);
  };

  const handleDeleteStaff = (staffId: number) => {
    if (confirm('Bu personeli silmek istediğinizden emin misiniz?')) {
      setStaff(staff.filter(s => s.id !== staffId));
      console.log('Personel silindi:', staffId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">MasApp İşletme</h1>
              <p className="text-purple-200 text-xs sm:text-sm mt-1">Personel Yönetimi</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <nav className="mt-4 sm:mt-6">
          <Link href="/business/dashboard" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaChartLine className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Kontrol Paneli</span>
          </Link>
          <Link href="/business/menu" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaUtensils className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Menü Yönetimi</span>
          </Link>
          <Link href="/business/staff" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 bg-purple-700 bg-opacity-50 border-l-4 border-white rounded-r-lg mx-2 sm:mx-0">
            <FaUsers className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Personel</span>
          </Link>
          <Link href="/business/qr-codes" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaQrcode className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">QR Kodlar</span>
          </Link>
          <Link href="/business/reports" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaChartBar className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Raporlar</span>
          </Link>
          <Link href="/business/support" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaHeadset className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Destek</span>
          </Link>
          <Link href="/business/settings" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaCog className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Ayarlar</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button onClick={handleLogout} 
            className="flex items-center justify-between w-full p-2 hover:bg-purple-700 rounded-lg">
            <span className="text-sm">{user?.name}</span>
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-0 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBars className="text-lg text-gray-600" />
              </button>
            <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">Personel</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Personel bilgilerini yönetin ve takip edin</p>
            </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-2 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <FaUserPlus className="text-xs sm:text-sm" />
                <span className="hidden sm:inline">Personel Ekle</span>
                <span className="sm:hidden">Ekle</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6 lg:p-8">
          {/* Panel Yönetimi Bölümü */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Panel Yönetimi</h3>
              <div className="text-xs sm:text-sm text-gray-500">
                Personel panellerini yönetin ve erişim bilgilerini kontrol edin
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Mutfak Paneli */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FaUtensils className="text-orange-600 text-sm sm:text-base" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Mutfak Paneli</h4>
                    <p className="text-xs sm:text-sm text-gray-500">Mutfak personeli</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">URL:</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {settings.basicInfo.subdomain}.masapp.com/mutfak
                      </span>
                      <button
                        onClick={() => {
                          const url = `${settings.basicInfo.subdomain}.masapp.com/mutfak`;
                          navigator.clipboard.writeText(url);
                          alert('URL kopyalandı!');
                        }}
                        className="p-1 text-gray-500 hover:text-orange-600 transition-colors flex-shrink-0"
                        title="Kopyala"
                      >
                        <FaCopy size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">Giriş:</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <input
                        type="text"
                        value={settings.staffCredentials['kitchen']?.username || 'mutfak_demo'}
                        onChange={(e) => updateStaffCredentials('kitchen', { username: e.target.value })}
                        className="font-mono text-xs bg-gray-100 px-2 py-1 rounded flex-1 border-0 focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={() => {
                          const newUsername = prompt('Yeni kullanıcı adı girin:', settings.staffCredentials['kitchen']?.username || 'mutfak_demo');
                          if (newUsername) {
                            updateStaffCredentials('kitchen', { username: newUsername });
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-orange-600 transition-colors flex-shrink-0"
                        title="Giriş Adı Güncelle"
                      >
                        <FaSync size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">Şifre:</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <input
                        type={showPasswords.kitchen ? 'text' : 'password'}
                        value={settings.staffCredentials['kitchen']?.password || 'mutfak123'}
                        onChange={(e) => updateStaffCredentials('kitchen', { password: e.target.value })}
                        className="font-mono text-xs bg-gray-100 px-2 py-1 rounded flex-1 border-0 focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={() => setShowPasswords(prev => ({ ...prev, kitchen: !prev.kitchen }))}
                        className="p-1 text-gray-500 hover:text-orange-600 transition-colors flex-shrink-0"
                        title={showPasswords.kitchen ? 'Gizle' : 'Göster'}
                      >
                        {showPasswords.kitchen ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
                      </button>
                      <button
                        onClick={() => {
                          const newPassword = prompt('Yeni şifre girin:', settings.staffCredentials['kitchen']?.password || 'mutfak123');
                          if (newPassword) {
                            updateStaffCredentials('kitchen', { password: newPassword });
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-orange-600 transition-colors flex-shrink-0"
                        title="Şifre Güncelle"
                      >
                        <FaSync size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">Durum:</span>
                    <span className="ml-2 text-green-600 font-medium">Aktif</span>
                  </div>
                </div>
              </div>

              {/* Garson Paneli */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaUsers className="text-blue-600 text-sm sm:text-base" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Garson Paneli</h4>
                    <p className="text-xs sm:text-sm text-gray-500">Garson personeli</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">URL:</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {settings.basicInfo.subdomain}.masapp.com/garson
                      </span>
                      <button
                        onClick={() => {
                          const url = `${settings.basicInfo.subdomain}.masapp.com/garson`;
                          navigator.clipboard.writeText(url);
                          alert('URL kopyalandı!');
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0"
                        title="Kopyala"
                      >
                        <FaCopy size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">Giriş:</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <input
                        type="text"
                        value={settings.staffCredentials['waiter']?.username || 'garson_demo'}
                        onChange={(e) => updateStaffCredentials('waiter', { username: e.target.value })}
                        className="font-mono text-xs bg-gray-100 px-2 py-1 rounded flex-1 border-0 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newUsername = prompt('Yeni kullanıcı adı girin:', settings.staffCredentials['waiter']?.username || 'garson_demo');
                          if (newUsername) {
                            updateStaffCredentials('waiter', { username: newUsername });
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0"
                        title="Giriş Adı Güncelle"
                      >
                        <FaSync size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">Şifre:</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <input
                        type={showPasswords.waiter ? 'text' : 'password'}
                        value={settings.staffCredentials['waiter']?.password || 'garson123'}
                        onChange={(e) => updateStaffCredentials('waiter', { password: e.target.value })}
                        className="font-mono text-xs bg-gray-100 px-2 py-1 rounded flex-1 border-0 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setShowPasswords(prev => ({ ...prev, waiter: !prev.waiter }))}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0"
                        title={showPasswords.waiter ? 'Gizle' : 'Göster'}
                      >
                        {showPasswords.waiter ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
                      </button>
                      <button
                        onClick={() => {
                          const newPassword = prompt('Yeni şifre girin:', settings.staffCredentials['waiter']?.password || 'garson123');
                          if (newPassword) {
                            updateStaffCredentials('waiter', { password: newPassword });
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0"
                        title="Şifre Güncelle"
                      >
                        <FaSync size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">Durum:</span>
                    <span className="ml-2 text-green-600 font-medium">Aktif</span>
                  </div>
                </div>
              </div>

              {/* Kasa Paneli */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaCreditCard className="text-green-600 text-sm sm:text-base" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Kasa Paneli</h4>
                    <p className="text-xs sm:text-sm text-gray-500">Kasa personeli</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">URL:</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {settings.basicInfo.subdomain}.masapp.com/kasa
                      </span>
                      <button
                        onClick={() => {
                          const url = `${settings.basicInfo.subdomain}.masapp.com/kasa`;
                          navigator.clipboard.writeText(url);
                          alert('URL kopyalandı!');
                        }}
                        className="p-1 text-gray-500 hover:text-green-600 transition-colors flex-shrink-0"
                        title="Kopyala"
                      >
                        <FaCopy size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">Giriş:</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <input
                        type="text"
                        value={settings.staffCredentials['cashier']?.username || 'kasa_demo'}
                        onChange={(e) => updateStaffCredentials('cashier', { username: e.target.value })}
                        className="font-mono text-xs bg-gray-100 px-2 py-1 rounded flex-1 border-0 focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => {
                          const newUsername = prompt('Yeni kullanıcı adı girin:', settings.staffCredentials['cashier']?.username || 'kasa_demo');
                          if (newUsername) {
                            updateStaffCredentials('cashier', { username: newUsername });
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-green-600 transition-colors flex-shrink-0"
                        title="Giriş Adı Güncelle"
                      >
                        <FaSync size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">Şifre:</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <input
                        type={showPasswords.cashier ? 'text' : 'password'}
                        value={settings.staffCredentials['cashier']?.password || 'kasa123'}
                        onChange={(e) => updateStaffCredentials('cashier', { password: e.target.value })}
                        className="font-mono text-xs bg-gray-100 px-2 py-1 rounded flex-1 border-0 focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => setShowPasswords(prev => ({ ...prev, cashier: !prev.cashier }))}
                        className="p-1 text-gray-500 hover:text-green-600 transition-colors flex-shrink-0"
                        title={showPasswords.cashier ? 'Gizle' : 'Göster'}
                      >
                        {showPasswords.cashier ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
                      </button>
                      <button
                        onClick={() => {
                          const newPassword = prompt('Yeni şifre girin:', settings.staffCredentials['cashier']?.password || 'kasa123');
                          if (newPassword) {
                            updateStaffCredentials('cashier', { password: newPassword });
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-green-600 transition-colors flex-shrink-0"
                        title="Şifre Güncelle"
                      >
                        <FaSync size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-600">Durum:</span>
                    <span className="ml-2 text-green-600 font-medium">Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <FaUsers className="text-lg sm:text-xl text-blue-600" />
                </div>
                <span className="text-xs sm:text-sm text-blue-600 font-medium">Toplam</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.total}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Personel</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                  <FaUserCheck className="text-lg sm:text-xl text-green-600" />
                </div>
                <span className="text-xs sm:text-sm text-green-600 font-medium">Aktif</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.active}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Personel</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                  <FaUserShield className="text-lg sm:text-xl text-purple-600" />
                </div>
                <span className="text-xs sm:text-sm text-purple-600 font-medium">Yönetici</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.managers}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Kişi</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <FaUserClock className="text-lg sm:text-xl text-blue-600" />
                </div>
                <span className="text-xs sm:text-sm text-blue-600 font-medium">Garson</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.waiters}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Kişi</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                  <FaUtensils className="text-lg sm:text-xl text-orange-600" />
                </div>
                <span className="text-xs sm:text-sm text-orange-600 font-medium">Aşçı</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.chefs}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Kişi</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                  <FaChartLine className="text-lg sm:text-xl text-yellow-600" />
                </div>
                <span className="text-xs sm:text-sm text-yellow-600 font-medium">Ortalama</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stats.avgRating}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Puan</p>
            </div>
          </div>


          {/* Filtreler ve Arama */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Arama */}
              <div className="sm:col-span-2 lg:col-span-2 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Personel ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              {/* Rol Filtresi */}
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="all">Tüm Roller</option>
                  <option value="manager">Yönetici</option>
                  <option value="chef">Aşçı</option>
                  <option value="waiter">Garson</option>
                  <option value="cashier">Kasiyer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Durum Filtresi */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="on_leave">İzinli</option>
                  <option value="terminated">İşten Ayrıldı</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personel Listesi - Desktop View */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Personel Listesi ({filteredStaff.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredStaff.map(member => (
                <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-purple-600 text-lg">
                          {member.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                            {getRoleText(member.role)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                            {getStatusText(member.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {getDepartmentText(member.department)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₺{member.salary.toLocaleString('tr-TR')}/ay
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.rating} ⭐
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {individualStaffPanelsEnabled && (
                        <button
                          onClick={() => {
                            setSelectedStaff(member);
                            setShowPanelModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Panel Bilgileri"
                        >
                          <FaCog />
                        </button>
                        )}
                        <button
                          onClick={() => handleEditStaff(member)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ek Bilgiler */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>İşe Başlama: {member.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <span>Son Giriş: {member.lastLogin}</span>
                    </div>
                  </div>

                  {member.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic">
                        <strong>Not:</strong> {member.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-12">
                <FaUsers className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Personel bulunamadı</p>
                <p className="text-gray-400 text-sm mt-2">Filtreleri değiştirerek tekrar deneyin</p>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filteredStaff.map(member => (
              <div key={member.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-600 text-sm">
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {member.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                            {getRoleText(member.role)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                            {getStatusText(member.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          ₺{member.salary.toLocaleString('tr-TR')}/ay
                        </span>
                        <span className="text-xs text-gray-500">
                          {member.rating} ⭐
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        <span className="truncate">{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span className="truncate">İşe Başlama: {member.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        <span className="truncate">Son Giriş: {member.lastLogin}</span>
                      </div>
                    </div>

                    {member.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-700 italic">
                          <strong>Not:</strong> {member.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {getDepartmentText(member.department)}
                      </span>
                      <div className="flex gap-1">
                        {individualStaffPanelsEnabled && (
                          <button
                            onClick={() => {
                              setSelectedStaff(member);
                              setShowPanelModal(true);
                            }}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Panel Bilgileri"
                          >
                            <FaCog className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditStaff(member)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredStaff.length === 0 && (
              <div className="text-center py-8">
                <FaUsers className="text-3xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Personel bulunamadı</p>
                <p className="text-gray-400 text-xs mt-1">Filtreleri değiştirerek tekrar deneyin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personel Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Yeni Personel Ekle</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="Personel adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="0532 123 45 67"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Rol *
                    </label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    >
                      <option value="waiter">Garson</option>
                      <option value="chef">Aşçı</option>
                      <option value="cashier">Kasiyer</option>
                      <option value="manager">Yönetici</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Departman
                    </label>
                    <select
                      value={newStaff.department}
                      onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    >
                      <option value="service">Servis</option>
                      <option value="kitchen">Mutfak</option>
                      <option value="finance">Mali İşler</option>
                      <option value="management">Yönetim</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Maaş (₺)
                    </label>
                    <input
                      type="number"
                      value={newStaff.salary}
                      onChange={(e) => setNewStaff({...newStaff, salary: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      placeholder="4500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      İşe Başlama
                    </label>
                    <input
                      type="date"
                      value={newStaff.startDate}
                      onChange={(e) => setNewStaff({...newStaff, startDate: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Notlar
                  </label>
                  <textarea
                    value={newStaff.notes}
                    onChange={(e) => setNewStaff({...newStaff, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="Personel hakkında notlar..."
                  />
                </div>

                <button
                  onClick={handleAddStaff}
                  className="w-full py-2.5 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaUserPlus className="text-sm" />
                  Personel Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personel Düzenleme Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Personel Düzenle</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={selectedStaff.name}
                    onChange={(e) => setSelectedStaff({...selectedStaff, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    value={selectedStaff.email}
                    onChange={(e) => setSelectedStaff({...selectedStaff, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={selectedStaff.phone}
                    onChange={(e) => setSelectedStaff({...selectedStaff, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select
                      value={selectedStaff.role}
                      onChange={(e) => setSelectedStaff({...selectedStaff, role: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="waiter">Garson</option>
                      <option value="chef">Aşçı</option>
                      <option value="cashier">Kasiyer</option>
                      <option value="manager">Yönetici</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      value={selectedStaff.status}
                      onChange={(e) => setSelectedStaff({...selectedStaff, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                      <option value="on_leave">İzinli</option>
                      <option value="terminated">İşten Ayrıldı</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maaş (₺)
                    </label>
                    <input
                      type="number"
                      value={selectedStaff.salary}
                      onChange={(e) => setSelectedStaff({...selectedStaff, salary: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puan
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={selectedStaff.rating}
                      onChange={(e) => setSelectedStaff({...selectedStaff, rating: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notlar
                  </label>
                  <textarea
                    value={selectedStaff.notes}
                    onChange={(e) => setSelectedStaff({...selectedStaff, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleUpdateStaff}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <FaUserEdit />
                    Güncelle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel Bilgileri Modal */}
      {individualStaffPanelsEnabled && showPanelModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold">Panel Bilgileri - {selectedStaff.name}</h3>
                <button
                  onClick={() => setShowPanelModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Mevcut Panel Bilgileri */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Mevcut Panel Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Panel URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={settings.staffCredentials[selectedStaff.id]?.panelUrl || ''}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            const url = settings.staffCredentials[selectedStaff.id]?.panelUrl;
                            if (url) {
                              navigator.clipboard.writeText(url);
                              alert('URL kopyalandı!');
                            }
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Kopyala
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kullanıcı Adı
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={settings.staffCredentials[selectedStaff.id]?.username || ''}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            const username = settings.staffCredentials[selectedStaff.id]?.username;
                            if (username) {
                              navigator.clipboard.writeText(username);
                              alert('Kullanıcı adı kopyalandı!');
                            }
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Kopyala
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şifre
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          value={settings.staffCredentials[selectedStaff.id]?.password || ''}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            const password = settings.staffCredentials[selectedStaff.id]?.password;
                            if (password) {
                              navigator.clipboard.writeText(password);
                              alert('Şifre kopyalandı!');
                            }
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Kopyala
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durum
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          settings.staffCredentials[selectedStaff.id]?.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {settings.staffCredentials[selectedStaff.id]?.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                        <button
                          onClick={() => {
                            updateStaffCredentials(selectedStaff.id, {
                              ...settings.staffCredentials[selectedStaff.id],
                              isActive: !settings.staffCredentials[selectedStaff.id]?.isActive
                            });
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            settings.staffCredentials[selectedStaff.id]?.isActive 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {settings.staffCredentials[selectedStaff.id]?.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Yeni Panel Oluştur */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Yeni Panel Oluştur</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Bu personel için yeni panel bilgileri oluşturmak istiyorsanız aşağıdaki butona tıklayın.
                  </p>
                  <button
                    onClick={() => {
                      generateStaffCredentials(selectedStaff.id, selectedStaff.role);
                      alert('Yeni panel bilgileri oluşturuldu!');
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <FaCog />
                    Yeni Panel Oluştur
                  </button>
                </div>

                {/* Panel Erişim Bilgileri */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Panel Erişim Bilgileri</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p><strong>Garson Paneli:</strong></p>
                        <p className="font-mono text-xs text-blue-600">garson.{settings.basicInfo.subdomain}.com</p>
                      </div>
                      <button
                        onClick={() => {
                          const url = `https://garson.${settings.basicInfo.subdomain}.com`;
                          navigator.clipboard.writeText(url);
                          alert('URL kopyalandı!');
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Kopyala"
                      >
                        <FaCopy size={12} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p><strong>Kasa Paneli:</strong></p>
                        <p className="font-mono text-xs text-blue-600">kasa.{settings.basicInfo.subdomain}.com</p>
                      </div>
                      <button
                        onClick={() => {
                          const url = `https://kasa.${settings.basicInfo.subdomain}.com`;
                          navigator.clipboard.writeText(url);
                          alert('URL kopyalandı!');
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Kopyala"
                      >
                        <FaCopy size={12} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p><strong>Mutfak Paneli:</strong></p>
                        <p className="font-mono text-xs text-blue-600">mutfak.{settings.basicInfo.subdomain}.com</p>
                      </div>
                      <button
                        onClick={() => {
                          const url = `https://mutfak.${settings.basicInfo.subdomain}.com`;
                          navigator.clipboard.writeText(url);
                          alert('URL kopyalandı!');
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Kopyala"
                      >
                        <FaCopy size={12} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p><strong>Yönetici Paneli:</strong></p>
                        <p className="font-mono text-xs text-blue-600">yonetici.{settings.basicInfo.subdomain}.com</p>
                      </div>
                      <button
                        onClick={() => {
                          const url = `https://yonetici.${settings.basicInfo.subdomain}.com`;
                          navigator.clipboard.writeText(url);
                          alert('URL kopyalandı!');
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Kopyala"
                      >
                        <FaCopy size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPanelModal(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

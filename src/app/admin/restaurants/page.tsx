'use client';

import { useState, useEffect } from 'react';
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
  FaTimes,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaKey,
  FaQrcode,
  FaEyeSlash,
  FaCopy,
  FaExternalLinkAlt
} from 'react-icons/fa';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    subdomain: ''
  });
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{username: string, password: string} | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // localStorage'dan restoranları yükle
  useEffect(() => {
    const savedRestaurants = localStorage.getItem('masapp-restaurants');
    if (savedRestaurants) {
      setRestaurants(JSON.parse(savedRestaurants));
    }
  }, []);

  // Subdomain kontrolü
  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    setCheckingSubdomain(true);
    
    // Geçerli subdomain formatı kontrolü
    const validSubdomainRegex = /^[a-z0-9-]+$/;
    if (!validSubdomainRegex.test(subdomain)) {
      setSubdomainAvailable(false);
      setCheckingSubdomain(false);
      return;
    }

    // Rezerve edilmiş kelimeler
    const reservedWords = ['admin', 'www', 'api', 'app', 'mail', 'ftp', 'blog', 'shop', 'store', 'support', 'help', 'docs', 'status', 'cdn', 'assets'];
    if (reservedWords.includes(subdomain.toLowerCase())) {
      setSubdomainAvailable(false);
      setCheckingSubdomain(false);
      return;
    }

    // Mevcut restoranlarda subdomain kontrolü
    const existingRestaurant = restaurants.find(r => r.subdomain === subdomain.toLowerCase());
    if (existingRestaurant) {
      setSubdomainAvailable(false);
      setCheckingSubdomain(false);
      return;
    }

    // Simüle edilmiş API çağrısı (gerçek uygulamada DNS kontrolü yapılabilir)
    setTimeout(() => {
      setSubdomainAvailable(true);
      setCheckingSubdomain(false);
    }, 500);
  };

  // Form verilerini güncelle
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Subdomain değiştiğinde kontrol et
    if (name === 'subdomain') {
      const subdomain = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({
        ...prev,
        subdomain: subdomain
      }));
      checkSubdomainAvailability(subdomain);
    }
  };

  // Restoranları localStorage'a kaydet
  const saveRestaurantsToStorage = (newRestaurants: any[]) => {
    localStorage.setItem('masapp-restaurants', JSON.stringify(newRestaurants));
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

  const generateCredentials = () => {
    const username = formData.subdomain.toLowerCase().replace(/[^a-z0-9]/g, '');
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    return { username, password };
  };

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Subdomain kontrolü
    if (!formData.subdomain || subdomainAvailable !== true) {
      alert('Lütfen geçerli bir subdomain girin.');
      return;
    }

    const credentials = generateCredentials();
    const restaurantId = `restaurant-${Date.now()}`;
    const cleanSubdomain = formData.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    const newRestaurant = {
      id: restaurantId,
      ...formData,
      status: 'active',
      qrCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastOrder: 'Henüz sipariş yok',
      credentials,
      subdomain: cleanSubdomain,
      domain: `${cleanSubdomain}.guzellestir.com`,
      panelUrls: {
        dashboard: `https://${cleanSubdomain}.guzellestir.com/business/dashboard`,
        waiter: `https://${cleanSubdomain}.guzellestir.com/business/waiter`,
        kitchen: `https://${cleanSubdomain}.guzellestir.com/kitchen`,
        cashier: `https://${cleanSubdomain}.guzellestir.com/business/cashier`,
        menu: `https://${cleanSubdomain}.guzellestir.com/business/menu`,
        qr: `https://${cleanSubdomain}.guzellestir.com/business/qr-codes`
      }
    };
    
    // Restoranı kaydet
    const updatedRestaurants = [...restaurants, newRestaurant];
    setRestaurants(updatedRestaurants);
    saveRestaurantsToStorage(updatedRestaurants);
    
    // Restoran için otomatik panel kurulumu yap
    setupRestaurantPanels(newRestaurant);
    
    setGeneratedCredentials(credentials);
    setFormData({
      name: '',
      owner: '',
      email: '',
      phone: '',
      address: '',
      subdomain: ''
    });
    setSubdomainAvailable(null);
    setCheckingSubdomain(false);
    setShowAddForm(false);
  };

  // Restoran panellerini otomatik kurulum
  const setupRestaurantPanels = (restaurant: any) => {
    // Restoran için varsayılan menü oluştur
    const defaultMenu = [
      {
        id: 'menu-1',
        name: 'Ana Yemekler',
        items: [
          { id: 'item-1', name: 'Adana Kebap', price: 45, category: 'food', prepTime: 15 },
          { id: 'item-2', name: 'Döner', price: 35, category: 'food', prepTime: 10 },
          { id: 'item-3', name: 'Lahmacun', price: 25, category: 'food', prepTime: 12 }
        ]
      },
      {
        id: 'menu-2',
        name: 'İçecekler',
        items: [
          { id: 'item-4', name: 'Ayran', price: 8, category: 'drink', prepTime: 2 },
          { id: 'item-5', name: 'Çay', price: 5, category: 'drink', prepTime: 3 },
          { id: 'item-6', name: 'Kola', price: 12, category: 'drink', prepTime: 1 }
        ]
      }
    ];

    // Restoran için varsayılan personel oluştur
    const defaultStaff = [
      {
        id: 'staff-1',
        name: 'Garson 1',
        email: 'garson1@' + restaurant.subdomain + '.com',
        phone: '+90 555 000 0001',
        role: 'waiter',
        department: 'service',
        salary: 5000,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        credentials: {
          username: 'garson1',
          password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
        }
      },
      {
        id: 'staff-2',
        name: 'Aşçı 1',
        email: 'ascı1@' + restaurant.subdomain + '.com',
        phone: '+90 555 000 0002',
        role: 'chef',
        department: 'kitchen',
        salary: 6000,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        credentials: {
          username: 'ascı1',
          password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
        }
      },
      {
        id: 'staff-3',
        name: 'Kasiyer 1',
        email: 'kasiyer1@' + restaurant.subdomain + '.com',
        phone: '+90 555 000 0003',
        role: 'cashier',
        department: 'cashier',
        salary: 5500,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        credentials: {
          username: 'kasiyer1',
          password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
        }
      }
    ];

    // Restoran için varsayılan ayarlar oluştur
    const defaultSettings = {
      restaurantId: restaurant.id,
      subdomain: restaurant.subdomain,
      basicInfo: {
        restaurantName: restaurant.name,
        ownerName: restaurant.owner,
        email: restaurant.email,
        phone: restaurant.phone,
        address: restaurant.address,
        subdomain: restaurant.subdomain
      },
      businessHours: {
        monday: { open: '09:00', close: '23:00', closed: false },
        tuesday: { open: '09:00', close: '23:00', closed: false },
        wednesday: { open: '09:00', close: '23:00', closed: false },
        thursday: { open: '09:00', close: '23:00', closed: false },
        friday: { open: '09:00', close: '23:00', closed: false },
        saturday: { open: '09:00', close: '23:00', closed: false },
        sunday: { open: '09:00', close: '23:00', closed: false }
      },
      tableCount: 15,
      taxRate: 0.18,
      serviceCharge: 0.10
    };

    // localStorage'a restoran verilerini kaydet
    localStorage.setItem(`masapp-restaurant-${restaurant.id}-menu`, JSON.stringify(defaultMenu));
    localStorage.setItem(`masapp-restaurant-${restaurant.id}-staff`, JSON.stringify(defaultStaff));
    localStorage.setItem(`masapp-restaurant-${restaurant.id}-settings`, JSON.stringify(defaultSettings));
    
    // Restoran için sipariş store'unu başlat
    const initialOrders: any[] = [];
    localStorage.setItem(`masapp-restaurant-${restaurant.id}-orders`, JSON.stringify(initialOrders));

    console.log(`✅ Restoran panelleri kuruldu: ${restaurant.name}`);
    console.log(`🌐 Panel URL'leri:`, restaurant.panelUrls);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Restoran işlemleri
  const handleViewRestaurant = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setShowViewModal(true);
  };

  const handleEditRestaurant = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      owner: restaurant.owner,
      email: restaurant.email,
      phone: restaurant.phone,
      address: restaurant.address,
      subdomain: restaurant.subdomain
    });
    setShowEditModal(true);
  };

  const handleUpdateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) return;

    const updatedRestaurants = restaurants.map(restaurant => 
      restaurant.id === selectedRestaurant.id 
        ? { ...restaurant, ...formData }
        : restaurant
    );
    
    setRestaurants(updatedRestaurants);
    saveRestaurantsToStorage(updatedRestaurants);
    setShowEditModal(false);
    setSelectedRestaurant(null);
    setFormData({
      name: '',
      owner: '',
      email: '',
      phone: '',
      address: '',
      subdomain: ''
    });
  };

  const handleDeleteRestaurant = (restaurant: any) => {
    if (confirm(`${restaurant.name} restoranını silmek istediğinizden emin misiniz?`)) {
      const updatedRestaurants = restaurants.filter(r => r.id !== restaurant.id);
      setRestaurants(updatedRestaurants);
      saveRestaurantsToStorage(updatedRestaurants);
    }
  };

  const handleChangePassword = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setNewPassword('');
    setShowNewPassword(false);
    setShowPasswordModal(true);
  };

  const generateRandomPassword = () => {
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    setNewPassword(password);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Şifre panoya kopyalandı!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Şifre panoya kopyalandı!');
    }
  };

  const handleUpdatePassword = () => {
    if (!selectedRestaurant || !newPassword.trim()) {
      alert('Lütfen bir şifre girin!');
      return;
    }

    const updatedRestaurants = restaurants.map(restaurant => 
      restaurant.id === selectedRestaurant.id 
        ? { 
            ...restaurant, 
            credentials: {
              ...restaurant.credentials,
              password: newPassword.trim()
            }
          }
        : restaurant
    );
    
    setRestaurants(updatedRestaurants);
    saveRestaurantsToStorage(updatedRestaurants);
    setShowPasswordModal(false);
    setSelectedRestaurant(null);
    setNewPassword('');
    
    alert(`Şifre başarıyla güncellendi!\n\nYeni şifre: ${newPassword}`);
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
              <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
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

      {/* Add Restaurant Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Yeni Restoran Ekle</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddRestaurant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restoran Adı</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örn: Pizza Palace"
                  />
                </div>
                
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sahip Adı</label>
                <input
                  type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örn: Ahmet Yılmaz"
                />
              </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
            </div>
            
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+90 212 555 0123"
                  />
            </div>
            
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kadıköy, İstanbul"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="subdomain"
                      value={formData.subdomain}
                      onChange={handleFormChange}
                      required
                      className={`flex-1 px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        subdomainAvailable === false ? 'border-red-300 bg-red-50' : 
                        subdomainAvailable === true ? 'border-green-300 bg-green-50' : 
                        'border-gray-300'
                      }`}
                      placeholder="kardesler"
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                      .guzellestir.com
                    </span>
                  </div>
                  {formData.subdomain && (
                    <div className="mt-2">
                      {checkingSubdomain ? (
                        <div className="flex items-center text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm">Kontrol ediliyor...</span>
                        </div>
                      ) : subdomainAvailable === true ? (
                        <div className="flex items-center text-green-600">
                          <FaCheckCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm">Subdomain kullanılabilir!</span>
                        </div>
                      ) : subdomainAvailable === false ? (
                        <div className="flex items-center text-red-600">
                          <FaTimesCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm">Bu subdomain kullanılamaz</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
            
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
              <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                    Restoran Ekle
              </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Generated Credentials Modal */}
      {generatedCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Restoran Başarıyla Eklendi!</h3>
                <p className="text-gray-600">Restoran giriş bilgileri oluşturuldu</p>
      </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Giriş Bilgileri</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kullanıcı Adı:</span>
                    <span className="font-mono text-gray-900">{generatedCredentials.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Şifre:</span>
                    <span className="font-mono text-gray-900">{generatedCredentials.password}</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Bu bilgileri güvenli bir yerde saklayın. Şifre sadece bir kez gösterilir!
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Kullanıcı Adı: ${generatedCredentials.username}\nŞifre: ${generatedCredentials.password}`);
                    alert('Giriş bilgileri panoya kopyalandı!');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kopyala
                </button>
                <button
                  onClick={() => setGeneratedCredentials(null)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                      <button 
                        onClick={() => handleViewRestaurant(restaurant)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Görüntüle"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditRestaurant(restaurant)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Düzenle"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleChangePassword(restaurant)}
                        className="text-yellow-600 hover:text-yellow-900 p-1"
                        title="Şifre Değiştir"
                      >
                        <FaKey className="w-4 h-4" />
                      </button>
                      {restaurant.panelUrls && (
                        <a
                          href={restaurant.panelUrls.dashboard}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-900 p-1"
                          title="Panele Git"
                        >
                          <FaExternalLinkAlt className="w-4 h-4" />
                        </a>
                      )}
                      <button 
                        onClick={() => handleDeleteRestaurant(restaurant)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Sil"
                      >
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

      {/* View Restaurant Modal */}
      {showViewModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Restoran Detayları</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restoran Adı</label>
                    <p className="text-gray-900">{selectedRestaurant.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sahip</label>
                    <p className="text-gray-900">{selectedRestaurant.owner}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <p className="text-gray-900">{selectedRestaurant.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <p className="text-gray-900">{selectedRestaurant.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                    <p className="text-gray-900">{selectedRestaurant.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
                    <p className="text-gray-900">{selectedRestaurant.subdomain}.guzellestir.com</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRestaurant.status)}`}>
                      {getStatusText(selectedRestaurant.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturulma Tarihi</label>
                    <p className="text-gray-900">{selectedRestaurant.createdAt}</p>
                  </div>
                </div>
              </div>

              {selectedRestaurant.credentials && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Giriş Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                      <p className="font-mono text-gray-900">{selectedRestaurant.credentials.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                      <p className="font-mono text-gray-900">{selectedRestaurant.credentials.password}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedRestaurant.panelUrls && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Panel URL'leri</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Dashboard:</span>
                      <a 
                        href={selectedRestaurant.panelUrls.dashboard} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-mono"
                      >
                        {selectedRestaurant.panelUrls.dashboard}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Garson Paneli:</span>
                      <a 
                        href={selectedRestaurant.panelUrls.waiter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-mono"
                      >
                        {selectedRestaurant.panelUrls.waiter}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Mutfak Paneli:</span>
                      <a 
                        href={selectedRestaurant.panelUrls.kitchen} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-mono"
                      >
                        {selectedRestaurant.panelUrls.kitchen}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Kasa Paneli:</span>
                      <a 
                        href={selectedRestaurant.panelUrls.cashier} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-mono"
                      >
                        {selectedRestaurant.panelUrls.cashier}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Menü Yönetimi:</span>
                      <a 
                        href={selectedRestaurant.panelUrls.menu} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-mono"
                      >
                        {selectedRestaurant.panelUrls.menu}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">QR Kodlar:</span>
                      <a 
                        href={selectedRestaurant.panelUrls.qr} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-mono"
                      >
                        {selectedRestaurant.panelUrls.qr}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Restaurant Modal */}
      {showEditModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Restoran Düzenle</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateRestaurant} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Restoran Adı</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sahip</label>
                    <input
                      type="text"
                      name="owner"
                      value={formData.owner}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
                    <div className="flex">
                      <input
                        type="text"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                        .guzellestir.com
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Güncelle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaKey className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Şifre Değiştir</h3>
                <p className="text-gray-600">{selectedRestaurant.name} restoranı için yeni şifre belirleyin</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Yeni şifreyi girin..."
                      className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={generateRandomPassword}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Rastgele Oluştur
                  </button>
                  {newPassword && (
                    <button
                      onClick={() => copyToClipboard(newPassword)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      <FaCopy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setSelectedRestaurant(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleUpdatePassword}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Şifre Değiştir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModernAdminLayout>
  );
}

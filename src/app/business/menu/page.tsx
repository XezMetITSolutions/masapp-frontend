'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaUtensils,
  FaFire,
  FaTag,
  FaChartBar,
  FaStore, 
  FaUsers, 
  FaShoppingCart,
  FaChartLine,
  FaQrcode,
  FaHeadset,
  FaCog,
  FaSignOutAlt,
  FaEye,
  FaClipboardList,
  FaTimes,
  FaFolderOpen,
  FaCamera,
  FaUpload,
  FaPercent,
  FaCheck,
  FaExclamationTriangle,
  FaBars,
  FaMoneyBillWave
} from 'react-icons/fa';
import useMenuStore from '@/store/useMenuStore';
import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const CameraCapture = lazy(() => import('@/components/CameraCapture'));
const ImageUploader = lazy(() => import('@/components/ImageUploader'));
const BulkImportModal = lazy(() => import('@/components/BulkImportModal'));

export default function MenuManagement() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentRestaurant } = useRestaurantStore();
  
  const {
    items,
    categories,
    isLoading,
    fetchMenu,
    getItemsByCategory,
    bulkUpdatePrices,
    updateItemPrice
  } = useMenuStore();

  const [activeTab, setActiveTab] = useState<'items' | 'categories' | 'stats'>('items');
  const [searchTerm, setSearchTerm] = useState('');
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'out-of-stock'>('all');
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [subcategories, setSubcategories] = useState<Array<{id: string, name: {tr: string, en: string}}>>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [bulkPriceType, setBulkPriceType] = useState<'percentage' | 'fixed'>('percentage');
  const [bulkPriceValue, setBulkPriceValue] = useState('');
  const [bulkPriceOperation, setBulkPriceOperation] = useState<'increase' | 'decrease'>('increase');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Form state'leri
  const [formData, setFormData] = useState({
    nameTr: '',
    nameEn: '',
    descriptionTr: '',
    descriptionEn: '',
    price: '',
    category: '',
    preparationTime: '',
    calories: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/business/login');
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      nameTr: '',
      nameEn: '',
      descriptionTr: '',
      descriptionEn: '',
      price: '',
      category: '',
      preparationTime: '',
      calories: '',
      isAvailable: true
    });
    setShowItemForm(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setFormData({
      nameTr: item.name.tr || '',
      nameEn: item.name.en || '',
      descriptionTr: item.description.tr || '',
      descriptionEn: item.description.en || '',
      price: item.price?.toString() || '',
      category: item.category || '',
      preparationTime: item.preparationTime?.toString() || '',
      calories: item.calories?.toString() || '',
      isAvailable: item.isAvailable !== false
    });
    setShowItemForm(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      // Demo için ürünü listeden kaldır
      console.log('Ürün silindi:', itemId);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      // Demo için kategoriyi listeden kaldır
      console.log('Kategori silindi:', categoryId);
    }
  };

  // Toplu fiyat düzenleme fonksiyonu
  const handleBulkPriceUpdate = () => {
    if (!bulkPriceValue || isNaN(Number(bulkPriceValue))) {
      return;
    }

    const value = Number(bulkPriceValue);
    const itemsToUpdate = selectedCategory === 'all' 
      ? items 
      : items.filter(item => item.category === selectedCategory);

    if (itemsToUpdate.length === 0) {
      return;
    }

    // Store'u kullanarak gerçek fiyat güncellemesi
    bulkUpdatePrices(selectedCategory, bulkPriceOperation, bulkPriceType, value);

    // Modal'ı kapat ve formu sıfırla
    setShowBulkPriceModal(false);
    setBulkPriceValue('');
    setBulkPriceOperation('increase');
    setBulkPriceType('percentage');
    setSelectedCategory('all');
  };

  const handleImport = (importedItems: any[]) => {
    setShowImportModal(false);
  };

  const handleBulkImport = (importedItems: any[]) => {
    setShowBulkImport(false);
    console.log(`${importedItems.length} ürün başarıyla içe aktarıldı!`);
  };

  const toggleItemAvailability = (itemId: string) => {
    // Demo için ürün durumu değiştir
    console.log('Ürün durumu değiştirildi:', itemId);
  };

  const duplicateItem = (item: any) => {
    // Demo için ürün kopyala
    console.log('Ürün kopyalandı:', item);
  };

  const handleSupport = () => {
    router.push('/business/support');
  };

  const addSubcategory = () => {
    const newSubcategory = {
      id: `sub-${Date.now()}`,
      name: { tr: '', en: '' }
    };
    setSubcategories([...subcategories, newSubcategory]);
  };

  const removeSubcategory = (id: string) => {
    setSubcategories(subcategories.filter(sub => sub.id !== id));
  };

  const updateSubcategory = (id: string, field: 'tr' | 'en', value: string) => {
    setSubcategories(subcategories.map(sub => 
      sub.id === id ? { ...sub, name: { ...sub.name, [field]: value } } : sub
    ));
  };

  const handleCameraCapture = (imageBlob: Blob) => {
    const imageUrl = URL.createObjectURL(imageBlob);
    setCapturedImage(imageUrl);
    setShowCamera(false);
    console.log('📸 Fotoğraf başarıyla çekildi!');
  };

  const handleImageUpload = () => {
    setShowCamera(true);
  };

  const handleFileUpload = () => {
    setShowImageUploader(true);
  };

  const handleImageSelect = (imageBlob: Blob) => {
    const imageUrl = URL.createObjectURL(imageBlob);
    setCapturedImage(imageUrl);
    setShowImageUploader(false);
    console.log('📁 Görsel başarıyla yüklendi!');
  };

  // Filtrelenmiş ürünler
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.tr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'available' && item.isAvailable !== false) ||
                         (statusFilter === 'out-of-stock' && item.isAvailable === false);
    
    const showItem = showOutOfStock || item.isAvailable !== false;
    
    return matchesSearch && matchesStatus && showItem;
  });

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
              <h1 className="text-xl sm:text-2xl font-bold">MasApp</h1>
              <p className="text-purple-200 text-xs sm:text-sm mt-1">Restoran Yönetim Sistemi</p>
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
          <Link href="/business/menu" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 bg-purple-700 bg-opacity-50 border-l-4 border-white rounded-r-lg mx-2 sm:mx-0">
            <FaUtensils className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Menü Yönetimi</span>
          </Link>
          <Link href="/business/staff" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
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

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="border-t border-purple-700 pt-3 sm:pt-4">
            <div className="flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm font-medium">MasApp</p>
                <p className="text-xs text-purple-300">info@masapp.com</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <FaSignOutAlt className="text-sm sm:text-base" />
              </button>
            </div>
          </div>
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
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">Menü</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">MasApp</p>
            </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-3 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menü Yönetimi</h1>
            <p className="text-gray-600 mt-2">Restoran menünüzü yönetin ve düzenleyin</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'items'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaUtensils className="inline mr-2" />
            Ürünler ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'categories'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaTag className="inline mr-2" />
            Kategoriler ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaChartBar className="inline mr-2" />
            İstatistikler
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          {/* Action Buttons - Mobile Optimized */}
          <div className="flex justify-center items-center">
            <div className="flex gap-2 sm:gap-3">
              <button 
                onClick={() => setShowBulkPriceModal(true)}
                className="px-4 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 flex items-center gap-2 shadow-lg text-sm font-medium min-w-[80px] sm:min-w-auto"
              >
                <FaPercent className="text-sm" />
                <span className="hidden sm:inline">Toplu Fiyat Düzenle</span>
                <span className="sm:hidden">Fiyat</span>
              </button>
              <button 
                onClick={() => setShowBulkImport(true)}
                className="px-4 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 shadow-lg relative text-sm font-medium min-w-[80px] sm:min-w-auto"
              >
                <FaUpload className="text-sm" />
                <span className="hidden sm:inline">Toplu İçe Aktar</span>
                <span className="sm:hidden">İçe Aktar</span>
                <span className="absolute -top-1 -right-1 bg-purple-300 text-white text-xs px-2 py-1 rounded-full font-bold">AI</span>
              </button>
              <button 
                onClick={handleAddItem}
                className="px-4 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 shadow-lg text-sm font-medium min-w-[80px] sm:min-w-auto"
              >
                <FaPlus className="text-sm" />
                <span className="hidden sm:inline">Yeni Ürün Ekle</span>
                <span className="sm:hidden">Yeni</span>
                <span className="absolute -top-1 -right-1 bg-pink-300 text-white text-xs px-2 py-1 rounded-full font-bold">AI</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Filtreler */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Durum:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tümü</option>
                  <option value="available">Mevcut</option>
                  <option value="out-of-stock">Tükendi</option>
                </select>
              </div>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOutOfStock}
                  onChange={(e) => setShowOutOfStock(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Tükenen ürünleri göster</span>
              </label>
            </div>
          </div>

          {/* Items List - Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ürün
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fiyat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.image || '/placeholder-food.jpg'}
                            alt={item.name.tr}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name.tr}
                              {item.popular && (
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                                  <FaFire className="mr-1 text-yellow-600" />
                                  Popüler
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {item.description.tr}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {categories.find(c => c.id === item.category)?.name.tr || item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₺{item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (item as any).isAvailable !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            (item as any).isAvailable !== false ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {(item as any).isAvailable !== false ? 'Mevcut' : 'Tükendi'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditItem(item)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={item.image || '/placeholder-food.jpg'}
                    alt={item.name.tr}
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name.tr}
                        </h3>
                        {item.popular && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200 mt-1">
                            <FaFire className="mr-1 text-yellow-600" />
                            Popüler
                          </span>
                        )}
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.description.tr}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          ₺{item.price}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          (item as any).isAvailable !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            (item as any).isAvailable !== false ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {(item as any).isAvailable !== false ? 'Mevcut' : 'Tükendi'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {categories.find(c => c.id === item.category)?.name.tr || item.category}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Kategoriler</h2>
            <button 
              onClick={handleAddCategory}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FaPlus />
              Yeni Kategori Ekle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{category.name.tr}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (category as any).isActive !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(category as any).isActive !== false ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    {getItemsByCategory(category.id).length} ürün
                  </p>
                  
                  {/* Alt Kategoriler */}
                  {(category as any).subcategories && (category as any).subcategories.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Alt Kategoriler:</p>
                      <div className="flex flex-wrap gap-1">
                        {(category as any).subcategories.map((sub: any, index: number) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {sub.name.tr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditCategory(category)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <FaEdit />
                      Düzenle
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Menü İstatistikleri</h2>
            <div className="text-xs text-gray-500">Demo verileri üzerinden hesaplanır</div>
          </div>

          {/* KPI Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {label:'Toplam Ürün', value: items.length, icon:<FaUtensils className='text-blue-600' />, bg:'bg-blue-100'},
              {label:'Popüler Ürünler', value: items.filter(i=>i.popular).length, icon:<FaFire className='text-red-600' />, bg:'bg-red-100'},
              {label:'Kategori Sayısı', value: categories.length, icon:<FaTag className='text-green-600' />, bg:'bg-green-100'},
              {label:'Ortalama Fiyat', value:`₺${items.length>0? Math.round(items.reduce((s,i)=>s+i.price,0)/items.length):0}`, icon:<FaChartBar className='text-purple-600' />, bg:'bg-purple-100'}
            ].map((kpi,idx)=> (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bg}`}>{kpi.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* En Çok Satanlar & Fiyat Dağılımı (demo) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-4">En Çok Satanlar (Demo)</h3>
              <ul className="space-y-2 text-sm">
                {items.slice(0,5).map((i,ix)=> (
                  <li key={ix} className="flex justify-between">
                    <span className="truncate pr-2">{(i as any).name?.tr || (i as any).name}</span>
                    <span className="text-gray-600">{i.price} ₺</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-4">Fiyat Dağılımı (Demo)</h3>
              <div className="h-40 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 rounded"></div>
              <p className="text-xs text-gray-500 mt-2">Gerçek satış verileri entegre edildiğinde grafikler otomatik güncellenecek.</p>
            </div>
          </div>

          {/* Not: Gerekirse bu sekme kapatılabilir */}
          {items.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
              Henüz ürün eklenmedi. İstatistikler, ürün ve satış verileri oluştukça gösterilir. Bu sekmeyi Ayarlar’dan kapatabilirsiniz.
            </div>
          )}
        </div>
      )}

          {/* Modals */}
          {showItemForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingItem ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                  </h2>
                  <button
                    onClick={() => setShowItemForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <form className="space-y-6">
                    {/* Ürün Adı */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ürün Adı (Türkçe)
                        </label>
                        <input
                          type="text"
                          value={formData.nameTr}
                          onChange={(e) => setFormData({...formData, nameTr: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Örn: Bruschetta"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ürün Adı (İngilizce)
                        </label>
                        <input
                          type="text"
                          value={formData.nameEn}
                          onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Örn: Bruschetta"
                        />
                      </div>
                    </div>

                    {/* Açıklama */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açıklama (Türkçe)
                        </label>
                        <textarea
                          value={formData.descriptionTr}
                          onChange={(e) => setFormData({...formData, descriptionTr: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Ürün açıklaması..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açıklama (İngilizce)
                        </label>
                        <textarea
                          value={formData.descriptionEn}
                          onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Product description..."
                        />
                      </div>
                    </div>

                    {/* Ürün Fotoğrafı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ürün Fotoğrafı
                      </label>
                      
                      {capturedImage ? (
                        /* Çekilen Fotoğraf Önizlemesi */
                        <div className="space-y-4">
                          <div className="relative">
                            <img
                              src={capturedImage}
                              alt="Çekilen fotoğraf"
                              className="w-full h-48 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              onClick={() => setCapturedImage(null)}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <FaTimes size={16} />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleImageUpload}
                              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                            >
                              <FaCamera size={16} />
                              Yeniden Çek
                            </button>
                            <button
                              onClick={() => setCapturedImage(null)}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              Kaldır
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Kamera ve Dosya Yükleme Seçenekleri */
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={handleImageUpload}
                              className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors"
                            >
                              <div className="text-purple-500">
                                <FaCamera className="mx-auto h-8 w-8 mb-2" />
                                <p className="text-sm font-medium">Kameradan Çek</p>
                                <p className="text-xs text-gray-500">Telefon kamerası</p>
                              </div>
                            </button>
                            
                            <button
                              onClick={handleFileUpload}
                              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                              <div className="text-gray-500">
                                <svg className="mx-auto h-8 w-8 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-sm font-medium">Dosyadan Yükle</p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                              </div>
                            </button>
                          </div>
                          
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <span className="text-2xl">✨</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-purple-800 mb-2">AI Görsel İşleme Aktif!</h4>
                                <div className="space-y-1 text-sm text-purple-700">
                                  <p>• 🎯 Otomatik arka plan kaldırma</p>
                                  <p>• 🎨 Renk ve parlaklık optimizasyonu</p>
                                  <p>• 📐 Akıllı boyutlandırma</p>
                                  <p>• ⚡ Keskinlik artırma</p>
                                </div>
                                <p className="text-xs text-purple-600 mt-2">
                                  💡 Kameradan çekmek daha profesyonel sonuçlar verir
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fiyat ve Kategori */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fiyat (₺)
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="45"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kategori
                        </label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Kategori Seçin</option>
                          <option value="baslangiclar">Başlangıçlar</option>
                          <option value="ana-yemekler">Ana Yemekler</option>
                          <option value="tatlilar">Tatlılar</option>
                          <option value="icecekler">İçecekler</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alt Kategori
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option value="">Alt Kategori Seçin</option>
                          <option value="soguk-baslangiclar">Soğuk Başlangıçlar</option>
                          <option value="sicak-baslangiclar">Sıcak Başlangıçlar</option>
                          <option value="et-yemekleri">Et Yemekleri</option>
                          <option value="tavuk-yemekleri">Tavuk Yemekleri</option>
                          <option value="balik-yemekleri">Balık Yemekleri</option>
                          <option value="vegan-yemekler">Vegan Yemekler</option>
                          <option value="soguk-tatlilar">Soğuk Tatlılar</option>
                          <option value="sicak-tatlilar">Sıcak Tatlılar</option>
                          <option value="soguk-icecekler">Soğuk İçecekler</option>
                          <option value="sicak-icecekler">Sıcak İçecekler</option>
                        </select>
                      </div>
                    </div>

                    {/* Kalori ve Hazırlık Süresi */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kalori
                        </label>
                        <input
                          type="number"
                          value={formData.calories}
                          onChange={(e) => setFormData({...formData, calories: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="250"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hazırlık Süresi (dakika)
                        </label>
                        <input
                          type="number"
                          value={formData.preparationTime}
                          onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="15"
                        />
                      </div>
                    </div>

                    {/* Malzemeler */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Malzemeler (Türkçe)
                        </label>
                        <textarea
                          defaultValue={editingItem?.ingredients?.join(', ') || ''}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Ekmek, Domates, Sarımsak, Zeytinyağı, Fesleğen..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Malzemeler (İngilizce)
                        </label>
                        <textarea
                          defaultValue={editingItem?.ingredients?.join(', ') || ''}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Bread, Tomato, Garlic, Olive oil, Basil..."
                        />
                      </div>
                    </div>

                    {/* Alerjenler */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alerjenler
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Gluten', 'Süt', 'Yumurta', 'Fındık', 'Fıstık', 'Soya', 'Balık', 'Kabuklu Deniz Ürünleri'].map((allergen) => (
                          <label key={allergen} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{allergen}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Durum ve Popüler */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ürün Durumu
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="status"
                                value="available"
                                defaultChecked={editingItem?.isAvailable !== false}
                                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Mevcut
                              </span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="status"
                                value="out-of-stock"
                                defaultChecked={editingItem?.isAvailable === false}
                                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Tükendi
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition-colors">
                            <input
                              type="checkbox"
                              defaultChecked={editingItem?.popular || false}
                              className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                            />
                            <span className="ml-3 text-sm font-medium text-yellow-800 flex items-center gap-2">
                              <FaFire className="text-yellow-600" size={16} />
                              Popüler Ürün
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Porsiyon (TR)
                          </label>
                          <input
                            type="text"
                            defaultValue={editingItem?.servingInfo?.tr || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Örn: 1-2 kişilik"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Porsiyon (EN)
                          </label>
                          <input
                            type="text"
                            defaultValue={editingItem?.servingInfo?.en || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Örn: 1-2 people"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                  
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                    <button
                      onClick={() => setShowItemForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => {
                        // Gerçek güncelleme işlemi
                        if (editingItem) {
                          // Fiyat güncelleme
                          if (formData.price && !isNaN(Number(formData.price))) {
                            updateItemPrice(editingItem.id, Number(formData.price));
                          }
                          console.log('Ürün güncellendi:', formData);
                        } else {
                          // Yeni ürün ekleme işlemi burada yapılacak
                          console.log('Yeni ürün eklendi:', formData);
                        }
                        setShowItemForm(false);
                        setEditingItem(null);
                      }}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {editingItem ? 'Güncelle' : 'Kaydet'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showCategoryForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
                  </h2>
                  <button
                    onClick={() => setShowCategoryForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <form className="space-y-6">
                    {/* Kategori Adı */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kategori Adı (Türkçe)
                        </label>
                        <input
                          type="text"
                          defaultValue={editingCategory?.name?.tr || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Örn: Başlangıçlar"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kategori Adı (İngilizce)
                        </label>
                        <input
                          type="text"
                          defaultValue={editingCategory?.name?.en || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Örn: Starters"
                        />
                      </div>
                    </div>


                    {/* Alt Kategoriler */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Alt Kategoriler
                        </label>
                        <button
                          type="button"
                          onClick={addSubcategory}
                          className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center gap-1 transition-colors"
                        >
                          <FaPlus size={12} />
                          Alt Kategori Ekle
                        </button>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                        {subcategories.length > 0 ? (
                          subcategories.map((sub, index) => (
                            <div key={sub.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={sub.name.tr}
                                  onChange={(e) => updateSubcategory(sub.id, 'tr', e.target.value)}
                                  placeholder="Alt kategori adı (Türkçe)"
                                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <input
                                  type="text"
                                  value={sub.name.en}
                                  onChange={(e) => updateSubcategory(sub.id, 'en', e.target.value)}
                                  placeholder="Alt kategori adı (İngilizce)"
                                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSubcategory(sub.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                title="Alt kategoriyi sil"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            <FaFolderOpen className="mx-auto mb-3 text-gray-400" size={32} />
                            <p className="text-sm font-medium mb-1">Henüz alt kategori eklenmemiş</p>
                            <p className="text-xs text-gray-400">"Alt Kategori Ekle" butonuna tıklayarak başlayın</p>
                          </div>
                        )}
                      </div>
                      {subcategories.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          💡 Alt kategoriler ürünlerde daha detaylı sınıflandırma için kullanılır
                        </p>
                      )}
                    </div>

                    {/* Sıralama */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sıralama
                      </label>
                      <input
                        type="number"
                        defaultValue={editingCategory?.sortOrder || 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    {/* Durum */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={editingCategory?.isActive !== false}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Aktif</span>
                      </label>
                    </div>
                  </form>
                  
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                    <button
                      onClick={() => setShowCategoryForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => {
                        // Gerçek kategori güncelleme işlemi
                        if (editingCategory) {
                          console.log('Kategori güncellendi:', editingCategory);
                        } else {
                          console.log('Yeni kategori eklendi');
                        }
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                        setSubcategories([]); // Formu temizle
                      }}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {editingCategory ? 'Güncelle' : 'Kaydet'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showImportModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Menü İçe Aktarma</h2>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <div className="space-y-6">
                    {/* Dosya Yükleme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excel/CSV Dosyası Yükle
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-2">Dosya seçmek için tıklayın</p>
                          <p className="text-sm text-gray-400">Excel (.xlsx) veya CSV (.csv) dosyaları desteklenir</p>
                        </div>
                      </div>
                    </div>

                    {/* Hazır Şablonlar */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Hazır Şablonlar
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                          <div className="font-medium text-gray-900">Restoran Menüsü</div>
                          <div className="text-sm text-gray-500">Genel restoran menü şablonu</div>
                        </button>
                        <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                          <div className="font-medium text-gray-900">Cafe Menüsü</div>
                          <div className="text-sm text-gray-500">Kahve ve atıştırmalık menüsü</div>
                        </button>
                        <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                          <div className="font-medium text-gray-900">Fast Food</div>
                          <div className="text-sm text-gray-500">Hızlı servis menü şablonu</div>
                        </button>
                        <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                          <div className="font-medium text-gray-900">Boş Şablon</div>
                          <div className="text-sm text-gray-500">Sıfırdan başlayın</div>
                        </button>
                      </div>
                    </div>

                    {/* İçe Aktarma Seçenekleri */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        İçe Aktarma Seçenekleri
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">Mevcut ürünleri güncelle</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                          <span className="ml-2 text-sm text-gray-700">Yeni ürünleri ekle</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                          <span className="ml-2 text-sm text-gray-700">Kategorileri de içe aktar</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                    <button
                      onClick={() => setShowImportModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => {
                        console.log('Menü içe aktarıldı!');
                        setShowImportModal(false);
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      İçe Aktar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kamera Modal */}
          {showCamera && (
            <CameraCapture
              onCapture={handleCameraCapture}
              onClose={() => setShowCamera(false)}
              aspectRatio="square"
              enableAI={true}
              productCategory="food"
            />
          )}

          {/* Dosya Yükleme Modal */}
          {showImageUploader && (
            <Suspense fallback={
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-center">Yükleniyor...</p>
                </div>
              </div>
            }>
              <ImageUploader
                onImageSelect={handleImageSelect}
                onClose={() => setShowImageUploader(false)}
                aspectRatio="square"
              />
            </Suspense>
          )}

          {/* Toplu İçe Aktarma Modal */}
          {showBulkImport && (
            <Suspense fallback={
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-center">Yükleniyor...</p>
                </div>
              </div>
            }>
              <BulkImportModal
                onImport={handleBulkImport}
                onClose={() => setShowBulkImport(false)}
              />
            </Suspense>
          )}

          {/* Toplu Fiyat Düzenleme Modal */}
          {showBulkPriceModal && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowBulkPriceModal(false)}
            >
              <div 
                className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Toplu Fiyat Düzenleme</h3>
                    <button
                      onClick={() => setShowBulkPriceModal(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Kategori Seçimi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Seçimi
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">Tüm Kategoriler</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name.tr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* İşlem Türü */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İşlem Türü
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="increase"
                          checked={bulkPriceOperation === 'increase'}
                          onChange={(e) => setBulkPriceOperation(e.target.value as 'increase' | 'decrease')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Fiyat Artır</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="decrease"
                          checked={bulkPriceOperation === 'decrease'}
                          onChange={(e) => setBulkPriceOperation(e.target.value as 'increase' | 'decrease')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Fiyat Azalt</span>
                      </label>
                    </div>
                  </div>

                  {/* Değer Türü */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Değer Türü
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="percentage"
                          checked={bulkPriceType === 'percentage'}
                          onChange={(e) => setBulkPriceType(e.target.value as 'percentage' | 'fixed')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yüzde (%)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="fixed"
                          checked={bulkPriceType === 'fixed'}
                          onChange={(e) => setBulkPriceType(e.target.value as 'percentage' | 'fixed')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Sabit Tutar (₺)</span>
                      </label>
                    </div>
                  </div>

                  {/* Değer Girişi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {bulkPriceType === 'percentage' ? 'Yüzde Değeri' : 'Sabit Tutar'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={bulkPriceValue}
                        onChange={(e) => setBulkPriceValue(e.target.value)}
                        placeholder={bulkPriceType === 'percentage' ? 'Örn: 10' : 'Örn: 5'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min="0"
                        step={bulkPriceType === 'percentage' ? '0.1' : '0.01'}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {bulkPriceType === 'percentage' ? '%' : '₺'}
                      </span>
                    </div>
                  </div>

                  {/* Önizleme */}
                  {bulkPriceValue && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaExclamationTriangle className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">Önizleme</span>
                      </div>
                      <p className="text-sm text-green-700">
                        {selectedCategory === 'all' ? items.length : items.filter(item => item.category === selectedCategory).length} ürünün fiyatı 
                        {bulkPriceOperation === 'increase' ? ' artırılacak' : ' azaltılacak'}: 
                        <span className="font-semibold">
                          {bulkPriceType === 'percentage' 
                            ? ` %${bulkPriceValue}` 
                            : ` ${bulkPriceValue}₺`
                          }
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 p-6 pt-0">
                  <button
                    onClick={() => setShowBulkPriceModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleBulkPriceUpdate}
                    disabled={!bulkPriceValue || isNaN(Number(bulkPriceValue)) || Number(bulkPriceValue) <= 0}
                    className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      !bulkPriceValue || isNaN(Number(bulkPriceValue)) || Number(bulkPriceValue) <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <FaCheck />
                    Fiyatları Güncelle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
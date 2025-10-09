'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';
import { lazy, Suspense } from 'react';
import BusinessSidebar from '@/components/BusinessSidebar';
import { useFeature } from '@/hooks/useFeature';

// Lazy load heavy components
const CameraCapture = lazy(() => import('@/components/CameraCapture'));
const ImageUploader = lazy(() => import('@/components/ImageUploader'));
const BulkImportModal = lazy(() => import('@/components/BulkImportModal'));

export default function MenuManagement() {
  const router = useRouter();
  const { authenticatedRestaurant, authenticatedStaff, isAuthenticated, logout, initializeAuth } = useAuthStore();
  const { 
    currentRestaurant, 
    restaurants,
    categories: allCategories, 
    menuItems: allMenuItems,
    createMenuCategory,
    createMenuItem,
    updateMenuCategory,
    deleteMenuCategory,
    updateMenuItem,
    deleteMenuItem,
    fetchRestaurantMenu,
    loading,
    error
  } = useRestaurantStore();
  
  // Feature kontrolü
  const hasQrMenu = useFeature('qr_menu');
  
  // Restoran ID'sini al
  const getRestaurantId = useCallback(() => {
    // Önce authenticated restaurant'tan al
    if (authenticatedRestaurant?.id) {
      return authenticatedRestaurant.id;
    }
    
    // Subdomain'den de alabilir (fallback)
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];
      const mainDomains = ['localhost', 'www', 'guzellestir'];
      
      if (!mainDomains.includes(subdomain) && hostname.includes('.')) {
        // Subdomain'e göre restaurant bul
        const restaurant = restaurants.find(r => 
          r.name.toLowerCase().replace(/\s+/g, '') === subdomain ||
          r.username === subdomain
        );
        return restaurant?.id;
      }
    }
    return null;
  }, [authenticatedRestaurant?.id, restaurants]);
  
  const currentRestaurantId = getRestaurantId();
  
  // Veri zaten store'dan restorana özel olarak geliyor, tekrar filtrelemeye gerek yok.
  const categories = allCategories;
  const items = allMenuItems;
  
  const displayName = authenticatedRestaurant?.name || authenticatedStaff?.name || 'Kullanıcı';

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
  
  // Form state'leri - Sadece Türkçe
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    calories: '',
    isAvailable: true,
    isPopular: false
  });
  
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    order: 0,
    isActive: true
  });

  // Sayfa yüklendiğinde auth'u initialize et
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Sayfa yüklendiğinde menüyü backend'den çek
  useEffect(() => {
    console.log('🏪 Current Restaurant ID:', currentRestaurantId);
    if (currentRestaurantId) {
      console.log('📥 Fetching menu for restaurant:', currentRestaurantId);
      fetchRestaurantMenu(currentRestaurantId);
    } else {
      console.warn('⚠️ No restaurant ID found!');
    }
  }, [currentRestaurantId, fetchRestaurantMenu]);

  useEffect(() => {
    // Eğer subdomain varsa authentication olmadan da çalışsın (test için)
    const hasSubdomain = typeof window !== 'undefined' && 
      !['localhost', 'www', 'guzellestir'].includes(window.location.hostname.split('.')[0]) &&
      window.location.hostname.includes('.');
      
    if (!isAuthenticated() && !hasSubdomain) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/business/login');
  };

  // Özellik kontrolünü geçici olarak pasifleştir (menü yönetimi herkes için açık)
  // if (!hasQrMenu) { ... }

  const handleAddItem = () => {
    setEditingItem(null);
    setCapturedImage(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      preparationTime: '',
      calories: '',
      isAvailable: true,
      isPopular: false
    });
    setShowItemForm(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price.toString(),
      category: item.categoryId || '',
      preparationTime: item.preparationTime?.toString() || '',
      calories: item.calories?.toString() || '',
      isAvailable: item.isAvailable !== false,
      isPopular: item.isPopular || false
    });
    // Resmi de yükle
    if (item.image) {
      setCapturedImage(item.image);
    }
    setShowItemForm(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        if (currentRestaurantId) {
          await deleteMenuItem(currentRestaurantId, itemId);
          console.log('Ürün silindi:', itemId);
          // Menüyü yeniden yükle
          await fetchRestaurantMenu(currentRestaurantId);
        }
      } catch (error) {
        console.error('Ürün silinirken hata:', error);
        alert('Ürün silinirken bir hata oluştu');
      }
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      order: categories.length,
      isActive: true
    });
    setSubcategories([]);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name || '',
      description: category.description || '',
      order: category.order || 0,
      isActive: category.isActive !== false
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu kategoriye ait tüm ürünler de silinecektir.')) {
      try {
        if (currentRestaurantId) {
          await deleteMenuCategory(currentRestaurantId, categoryId);
          console.log('Kategori silindi:', categoryId);
          // Menüyü yeniden yükle
          await fetchRestaurantMenu(currentRestaurantId);
        }
      } catch (error) {
        console.error('Kategori silinirken hata:', error);
        alert('Kategori silinirken bir hata oluştu');
      }
    }
  };

  // Filtrelenmiş ürünler
  const filteredItems = items.filter(item => {
    // Güvenlik kontrolü - item.name ve item.description undefined olabilir
    const itemName = item.name || '';
    const itemDescription = item.description || '';
    
    const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         itemDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'available' && item.isAvailable !== false) ||
                         (statusFilter === 'out-of-stock' && item.isAvailable === false);
    
    const showItem = showOutOfStock || item.isAvailable !== false;
    
    return matchesSearch && matchesStatus && showItem;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

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
            {error && (
              <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                Hata: {error}
              </div>
            )}
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Yükleniyor...</span>
        </div>
      )}

      {/* Content */}
      {!loading && activeTab === 'items' && (
        <div className="space-y-6">
          {/* Action Buttons - Mobile Optimized */}
          <div className="flex justify-center items-center">
            <div className="flex gap-2 sm:gap-3">
              <button 
                onClick={handleAddItem}
                className="px-4 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 shadow-lg text-sm font-medium min-w-[80px] sm:min-w-auto"
              >
                <FaPlus className="text-sm" />
                <span className="hidden sm:inline">Yeni Ürün Ekle</span>
                <span className="sm:hidden">Yeni</span>
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
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                              {item.isPopular && (
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                                  <FaFire className="mr-1 text-yellow-600" />
                                  Popüler
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {categories.find(c => c.id === item.categoryId)?.name || 'Kategori Yok'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₺{item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isAvailable !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            item.isAvailable !== false ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {item.isAvailable !== false ? 'Mevcut' : 'Tükendi'}
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
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        {item.isPopular && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200 mt-1">
                            <FaFire className="mr-1 text-yellow-600" />
                            Popüler
                          </span>
                        )}
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          ₺{item.price}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.isAvailable !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            item.isAvailable !== false ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {item.isAvailable !== false ? 'Mevcut' : 'Tükendi'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {categories.find(c => c.id === item.categoryId)?.name || 'Kategori Yok'}
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

      {!loading && activeTab === 'categories' && (
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

          {categories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FaFolderOpen className="mx-auto text-5xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz kategori yok</h3>
              <p className="text-sm text-gray-500 mb-4">
                Menü ürünlerinizi düzenlemek için kategoriler oluşturun
              </p>
              <button 
                onClick={handleAddCategory}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
              >
                <FaPlus />
                İlk Kategoriyi Ekle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.isActive !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.isActive !== false ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    {items.filter(i => i.categoryId === category.id).length} ürün
                  </p>
                  
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
          )}
        </div>
      )}

      {!loading && activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Menü İstatistikleri</h2>
            <div className="text-xs text-gray-500">Backend verileri üzerinden hesaplanır</div>
          </div>

          {/* KPI Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {label:'Toplam Ürün', value: items.length, icon:<FaUtensils className='text-blue-600' />, bg:'bg-blue-100'},
              {label:'Popüler Ürünler', value: items.filter(i=>i.isPopular).length, icon:<FaFire className='text-red-600' />, bg:'bg-red-100'},
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ürün Adı *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Örn: Bruschetta"
                        required
                      />
                    </div>

                    {/* Açıklama */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açıklama
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ürün açıklaması..."
                      />
                    </div>

                    {/* Fiyat ve Kategori */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fiyat (₺) *
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="45"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kategori *
                        </label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        >
                          <option value="">Kategori Seçin</option>
                          {categories.length > 0 ? (
                            categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))
                          ) : (
                            <option disabled>Önce kategori ekleyin</option>
                          )}
                        </select>
                        {categories.length === 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Kategori bulunamadı. Lütfen önce "Kategoriler" sekmesinden kategori ekleyin.
                          </p>
                        )}
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
                                checked={formData.isAvailable}
                                onChange={(e) => setFormData({...formData, isAvailable: e.target.value === 'available'})}
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
                                checked={!formData.isAvailable}
                                onChange={(e) => setFormData({...formData, isAvailable: e.target.value !== 'out-of-stock'})}
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
                              checked={formData.isPopular}
                              onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                              className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                            />
                            <span className="ml-3 text-sm font-medium text-yellow-800 flex items-center gap-2">
                              <FaFire className="text-yellow-600" size={16} />
                              Popüler Ürün
                            </span>
                          </label>
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
                      onClick={async () => {
                        // Gerçek güncelleme işlemi
                        if (editingItem) {
                          // Ürün güncelleme
                          try {
                            if (currentRestaurantId) {
                              await updateMenuItem(currentRestaurantId, editingItem.id, {
                                name: formData.name,
                                description: formData.description,
                                price: Number(formData.price),
                                categoryId: formData.category,
                                preparationTime: Number(formData.preparationTime) || 0,
                                calories: Number(formData.calories) || 0,
                                isAvailable: formData.isAvailable,
                                isPopular: formData.isPopular,
                                image: capturedImage || editingItem.image
                              });
                              console.log('Ürün güncellendi:', formData);
                              // Menüyü yeniden yükle
                              await fetchRestaurantMenu(currentRestaurantId);
                            }
                          } catch (error) {
                            console.error('Ürün güncellenirken hata:', error);
                            alert('Ürün güncellenirken bir hata oluştu');
                          }
                        } else {
                          // Yeni ürün ekleme
                          if (!formData.name || !formData.price || !formData.category) {
                            alert('Lütfen ürün adı, fiyat ve kategori alanlarını doldurun!');
                            return;
                          }
                          
                          try {
                            if (currentRestaurantId) {
                              await createMenuItem(currentRestaurantId, {
                                categoryId: formData.category,
                                name: formData.name,
                                description: formData.description,
                                price: Number(formData.price),
                                image: capturedImage || '/placeholder-food.jpg',
                                order: items.length + 1,
                                isAvailable: formData.isAvailable,
                                isPopular: formData.isPopular,
                                preparationTime: Number(formData.preparationTime) || 0,
                                calories: Number(formData.calories) || 0
                              });
                              console.log('Yeni ürün backend\'e kaydedildi:', formData);
                              // Menüyü yeniden yükle
                              await fetchRestaurantMenu(currentRestaurantId);
                            }
                          } catch (error) {
                            console.error('Ürün eklenirken hata:', error);
                            alert('Ürün eklenirken bir hata oluştu');
                          }
                        }
                        setShowItemForm(false);
                        setEditingItem(null);
                        setCapturedImage(null);
                        // Form resetle
                        setFormData({
                          name: '',
                          description: '',
                          price: '',
                          category: '',
                          preparationTime: '',
                          calories: '',
                          isAvailable: true,
                          isPopular: false
                        });
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
              <div className="bg-white rounded-xl max-w-md w-full overflow-hidden">
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
                <div className="p-6">
                  <form className="space-y-4">
                    {/* Kategori Adı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori Adı *
                      </label>
                      <input
                        type="text"
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Örn: Başlangıçlar, Ana Yemekler, Tatlılar"
                        required
                      />
                    </div>

                    {/* Durum */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={categoryFormData.isActive}
                          onChange={(e) => setCategoryFormData({...categoryFormData, isActive: e.target.checked})}
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
                      onClick={async () => {
                        // Gerçek kategori güncelleme işlemi
                        if (!categoryFormData.name) {
                          alert('Lütfen kategori adını girin!');
                          return;
                        }
                        
                        try {
                          if (editingCategory) {
                            if (currentRestaurantId) {
                              await updateMenuCategory(currentRestaurantId, editingCategory.id, {
                                name: categoryFormData.name,
                                description: categoryFormData.description,
                                order: categoryFormData.order,
                                isActive: categoryFormData.isActive
                              });
                              console.log('Kategori güncellendi:', editingCategory);
                              // Menüyü yeniden yükle
                              await fetchRestaurantMenu(currentRestaurantId);
                            }
                          } else {
                            // Backend API'sine kaydet
                            if (currentRestaurantId) {
                              await createMenuCategory(currentRestaurantId, {
                                name: categoryFormData.name,
                                description: categoryFormData.description,
                                order: categories.length,
                                isActive: categoryFormData.isActive
                              });
                              console.log('Yeni kategori backend\'e kaydedildi');
                              // Menüyü yeniden yükle
                              await fetchRestaurantMenu(currentRestaurantId);
                            }
                          }
                        } catch (error) {
                          console.error('Kategori işlemi sırasında hata:', error);
                          alert('Kategori işlemi sırasında bir hata oluştu');
                        }
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                        setSubcategories([]); // Formu temizle
                        setCategoryFormData({
                          name: '',
                          description: '',
                          order: 0,
                          isActive: true
                        });
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
        </div>
      </div>
    </div>
  );
}
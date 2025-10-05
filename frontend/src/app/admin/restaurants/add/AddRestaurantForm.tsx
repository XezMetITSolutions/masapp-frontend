'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaSave,
  FaStore,
  FaPalette,
  FaCog
} from 'react-icons/fa';
import useRestaurantStore from '@/store/useRestaurantStore';
import { Restaurant } from '@/types';
import { updateSubdomainsFile } from '@/lib/subdomains';

interface AddRestaurantFormProps {
  onClose: () => void;
}

export default function AddRestaurantForm({ onClose }: AddRestaurantFormProps) {
  const router = useRouter();
  const { addRestaurant } = useRestaurantStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    tableCount: 10,
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    plan: 'basic' as 'basic' | 'premium' | 'enterprise',
    language: ['tr'],
    currency: 'TRY',
    taxRate: 18,
    serviceChargeRate: 0,
    allowTips: true,
    allowOnlinePayment: true,
    autoAcceptOrders: false
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newRestaurant: Restaurant = {
      id: `rest_${Date.now()}`,
      name: formData.name,
      username: formData.username,
      password: formData.password,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      ownerId: `owner_${Date.now()}`,
      tableCount: formData.tableCount,
      qrCodes: [],
      settings: {
        language: formData.language,
        currency: formData.currency,
        taxRate: formData.taxRate,
        serviceChargeRate: formData.serviceChargeRate,
        allowTips: formData.allowTips,
        allowOnlinePayment: formData.allowOnlinePayment,
        autoAcceptOrders: formData.autoAcceptOrders,
        workingHours: [
          { day: 'Pazartesi', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Salı', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Çarşamba', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Perşembe', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Cuma', open: '09:00', close: '22:00', isOpen: true },
          { day: 'Cumartesi', open: '09:00', close: '23:00', isOpen: true },
          { day: 'Pazar', open: '09:00', close: '23:00', isOpen: true }
        ]
      },
      subscription: {
        plan: formData.plan,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'active'
      },
      createdAt: new Date(),
      status: 'active'
    };

    addRestaurant(newRestaurant);
    
    alert('Restoran başarıyla eklendi!');
    
    onClose();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaStore className="mr-2 text-blue-600" />
              Restoran Bilgileri
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restoran Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Lezzet Durağı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kullanıcı Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="restoran_kullanici_adi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="info@restoran.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0212 123 45 67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres *
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Mahalle, Sokak, İlçe/İl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Masa Sayısı *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.tableCount}
                  onChange={(e) => setFormData({ ...formData, tableCount: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaPalette className="mr-2 text-purple-600" />
              Görünüm Ayarları
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ana Renk
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="h-10 w-20"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İkincil Renk
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="h-10 w-20"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaCog className="mr-2 text-orange-600" />
              Abonelik Planı
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="plan"
                  value="basic"
                  checked={formData.plan === 'basic'}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Basic Plan</div>
                  <div className="text-sm text-gray-500">10 masa, temel özellikler</div>
                </div>
                <div className="text-lg font-bold">₺299/ay</div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="plan"
                  value="premium"
                  checked={formData.plan === 'premium'}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Premium Plan</div>
                  <div className="text-sm text-gray-500">25 masa, gelişmiş özellikler</div>
                </div>
                <div className="text-lg font-bold">₺599/ay</div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg text-white flex items-center ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <FaSave className="mr-2" />
          {isLoading ? 'Kaydediliyor...' : 'Restoran Ekle'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaSave,
  FaStore,
  FaPalette,
  FaCog
} from 'react-icons/fa';
import useRestaurantStore from '@/store/useRestaurantStore';
import { Restaurant } from '@/types';

interface EditRestaurantFormProps {
  restaurantId: string;
  onClose: () => void;
}

export default function EditRestaurantForm({ restaurantId, onClose }: EditRestaurantFormProps) {
  const router = useRouter();
  const { restaurants, updateRestaurant } = useRestaurantStore();

  const restaurant = useMemo(
    () => restaurants.find((r) => r.id === restaurantId) || null,
    [restaurants, restaurantId]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    tableCount: 10,
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    plan: 'basic' as 'basic' | 'premium' | 'enterprise',
  });

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        username: restaurant.username,
        email: restaurant.email,
        phone: restaurant.phone,
        address: restaurant.address,
        tableCount: restaurant.tableCount,
        primaryColor: restaurant.primaryColor,
        secondaryColor: restaurant.secondaryColor,
        plan: restaurant.subscription?.plan || 'basic',
      });
    }
  }, [restaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;
    setIsLoading(true);

    const updates: Partial<Restaurant> = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      tableCount: formData.tableCount,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      subscription: {
        ...(restaurant.subscription || {}),
        plan: formData.plan,
      },
    };

    updateRestaurant(restaurant.id, updates);
    onClose();
    router.refresh();
  };

  if (!restaurant) {
    return <div>Restoran bilgileri yükleniyor...</div>;
  }

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Restoran Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Masa Sayısı *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.tableCount}
                  onChange={(e) => setFormData({ ...formData, tableCount: parseInt(e.target.value || '0', 10) })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Ana Renk</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">İkincil Renk</label>
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
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <FaSave className="mr-2" />
          {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUtensils, FaQrcode, FaPhone, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import { getCurrentRestaurant } from '@/utils/subdomain';
import RestaurantLayout from '@/components/RestaurantLayout';

export default function RestaurantHomePage() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const restaurantData = await getCurrentRestaurant();
        if (restaurantData) {
          setRestaurant(restaurantData);
        }
      } catch (error) {
        console.error('Restoran bilgisi alınamadı:', error);
      }
    };

    loadRestaurant();
  }, []);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <RestaurantLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <FaUtensils className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
                <p className="text-gray-600">Hoş geldiniz!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-yellow-500">
                <FaStar className="text-xl" />
                <span className="text-lg font-semibold">4.8</span>
                <span className="text-gray-600">(127 değerlendirme)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Menü Kartı */}
          <div 
            onClick={() => router.push('/demo/menu')}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaQrcode className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Menüyü İncele</h2>
              <p className="text-gray-600 mb-4">QR kod ile menümüzü inceleyin ve sipariş verin</p>
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                Menüye Git
              </button>
            </div>
          </div>

          {/* İletişim Kartı */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-orange-500 text-xl" />
                <div>
                  <p className="font-semibold text-gray-900">Telefon</p>
                  <p className="text-gray-600">{restaurant.phone || 'Belirtilmemiş'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-orange-500 text-xl" />
                <div>
                  <p className="font-semibold text-gray-900">Adres</p>
                  <p className="text-gray-600">{restaurant.address || 'Belirtilmemiş'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaClock className="text-orange-500 text-xl" />
                <div>
                  <p className="font-semibold text-gray-900">Çalışma Saatleri</p>
                  <p className="text-gray-600">09:00 - 23:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Kod Bölümü */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">QR Kod ile Sipariş Verin</h3>
            <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FaQrcode className="text-gray-400 text-4xl" />
            </div>
            <p className="text-gray-600 text-sm">
              Masanızdaki QR kodu okutarak menüye erişin ve sipariş verin
            </p>
          </div>
        </div>
      </div>
    </div>
    </RestaurantLayout>
  );
}

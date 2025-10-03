'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Restaurant {
  id: string;
  name: string;
  subdomain: string;
  description: string;
  cuisine: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  instagram: string;
  facebook: string;
  openingTime: string;
  closingTime: string;
  status: 'active' | 'inactive' | 'pending';
}

export default function RestaurantPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurantData();
  }, [subdomain]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/restaurants/${subdomain}`);
      
      if (!response.ok) {
        throw new Error('Restoran bulunamadı');
      }
      
      const data = await response.json();
      setRestaurant(data.restaurant);
    } catch (error) {
      console.error('Restaurant fetch error:', error);
      setError('Restoran bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restoran Bulunamadı</h1>
          <p className="text-gray-600 mb-4">
            {error || 'Aradığınız restoran mevcut değil veya erişim izni yok.'}
          </p>
          <button 
            onClick={() => window.location.href = 'https://masapp.com'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (restaurant.status !== 'active') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restoran Aktif Değil</h1>
          <p className="text-gray-600 mb-4">
            Bu restoran şu anda hizmet vermemektedir.
          </p>
          <button 
            onClick={() => window.location.href = 'https://masapp.com'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
              <p className="text-gray-600 mt-1">{restaurant.cuisine}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Açılış Saati</p>
              <p className="font-medium">{restaurant.openingTime} - {restaurant.closingTime}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="#menu" className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
              Menü
            </a>
            <a href="#about" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              Hakkımızda
            </a>
            <a href="#contact" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              İletişim
            </a>
            <a href="#order" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              Sipariş Ver
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Hoş Geldiniz!</h2>
          <p className="text-lg mb-6">{restaurant.description}</p>
          <div className="flex space-x-4">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
              Menüyü İncele
            </button>
            <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-600">
              Sipariş Ver
            </button>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Adres:</span> {restaurant.address}, {restaurant.city}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Telefon:</span> {restaurant.phone}
              </p>
              {restaurant.website && (
                <p className="text-gray-600">
                  <span className="font-medium">Website:</span> 
                  <a href={restaurant.website} className="text-blue-600 hover:underline ml-1">
                    {restaurant.website}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya</h3>
            <div className="flex space-x-4">
              {restaurant.instagram && (
                <a 
                  href={`https://instagram.com/${restaurant.instagram}`}
                  className="text-pink-600 hover:text-pink-700"
                >
                  Instagram
                </a>
              )}
              {restaurant.facebook && (
                <a 
                  href={`https://facebook.com/${restaurant.facebook}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div id="menu" className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Menümüz</h3>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Menü yakında eklenecek...</p>
            <p className="text-gray-400 mt-2">Restoran yöneticisi menüyü henüz eklememiş.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              Powered by <a href="https://masapp.com" className="text-blue-400 hover:underline">MASAPP</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/context/LanguageContext';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { getSubdomain, isRestaurantSubdomain } from '@/utils/subdomain';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { currentLanguage, setLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Restoran kontrolü
  useEffect(() => {
    if (isRestaurantSubdomain()) {
      const subdomain = getSubdomain();
      if (subdomain) {
        // Restoran var mı kontrol et
        const restaurants = JSON.parse(localStorage.getItem('masapp-restaurants') || '[]');
        const restaurant = restaurants.find((r: any) => r.subdomain === subdomain);
        
        if (!restaurant || restaurant.status !== 'active') {
          // Restoran yoksa veya aktif değilse ana sayfaya yönlendir
          window.location.href = 'https://guzellestir.com';
          return;
        }
      }
    }
  }, []);

  const getLanguageCode = () => {
    switch (currentLanguage) {
      case 'English': return 'en';
      case 'German': return 'de';
      default: return 'tr';
    }
  };

  const languageCode = getLanguageCode();

  const translations = {
    en: {
      title: 'MasApp Business',
      subtitle: 'Login to your account',
      username: 'Username / Email',
      password: 'Password',
      login: 'Login',
      quickAccess: 'Quick Access',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      contactAdmin: 'Contact Administrator'
    },
    tr: {
      title: 'MasApp Business',
      subtitle: 'Hesabınıza giriş yapın',
      username: 'Kullanıcı Adı / E-posta',
      password: 'Şifre',
      login: 'Giriş Yap',
      quickAccess: 'Hızlı Erişim',
      forgotPassword: 'Şifremi Unuttum?',
      noAccount: 'Hesabınız yok mu?',
      contactAdmin: 'Yönetici ile İletişim'
    },
    de: {
      title: 'MasApp Business',
      subtitle: 'Bei Ihrem Konto anmelden',
      username: 'Benutzername / E-Mail',
      password: 'Passwort',
      login: 'Anmelden',
      quickAccess: 'Schnellzugriff',
      forgotPassword: 'Passwort vergessen?',
      noAccount: 'Kein Konto?',
      contactAdmin: 'Administrator kontaktieren'
    }
  };

  const t = translations[languageCode as 'en' | 'tr' | 'de'] || translations.tr;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Demo kullanıcılar + localStorage'dan oluşturulan kullanıcılar
      const demoUsers = [
        { username: 'admin', password: 'admin123', role: 'restaurant_owner', name: 'Admin User' },
        { username: 'waiter', password: 'waiter123', role: 'waiter', name: 'Waiter User' },
        { username: 'kitchen', password: 'kitchen123', role: 'kitchen', name: 'Kitchen User' },
        { username: 'cashier', password: 'cashier123', role: 'cashier', name: 'Cashier User' }
      ];

      // localStorage'dan oluşturulan restoran kullanıcılarını al
      const savedRestaurants = localStorage.getItem('masapp-restaurants');
      let restaurantUsers: any[] = [];
      if (savedRestaurants) {
        const restaurants = JSON.parse(savedRestaurants);
        restaurantUsers = restaurants.map((restaurant: any) => ({
          username: restaurant.credentials?.username || restaurant.subdomain,
          password: restaurant.credentials?.password || 'default123',
          role: 'restaurant_owner',
          name: restaurant.owner,
          restaurantName: restaurant.name,
          restaurantId: restaurant.id
        }));
      }

      // localStorage'dan oluşturulan restoran personelini al
      const savedStaff = localStorage.getItem('masapp-restaurant-staff');
      let staffUsers: any[] = [];
      if (savedStaff) {
        const staff = JSON.parse(savedStaff);
        staffUsers = staff.map((member: any) => ({
          username: member.credentials?.username || member.email,
          password: member.credentials?.password || 'default123',
          role: member.role,
          name: member.name,
          restaurantId: member.restaurantId || 'demo-restaurant-1'
        }));
      }

      const allUsers = [...demoUsers, ...restaurantUsers, ...staffUsers];

      const user = allUsers.find(u => 
        u.username === formData.username && u.password === formData.password
      );

      if (user) {
        const userData = {
          id: `user-${user.username}`,
          name: user.name,
          email: `${user.username}@masapp.com`,
          role: user.role as 'waiter' | 'kitchen' | 'cashier' | 'restaurant_owner',
          restaurantId: user.restaurantId || 'demo-restaurant-1',
          status: 'active' as const,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        await login(userData, 'demo-access-token', 'demo-refresh-token');

        // Rol bazlı yönlendirme
        if (user.role === 'waiter') {
        router.push('/business/waiter');
        } else if (user.role === 'kitchen') {
        router.push('/business/kitchen');
        } else if (user.role === 'cashier') {
        router.push('/business/cashier');
        } else if (user.role === 'restaurant_owner') {
          // Restoran sahipleri kendi restoran paneline yönlendirilmeli
          router.push('/business/dashboard');
        }
      } else {
        setError('Kullanıcı adı veya şifre hatalı');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLanguage('Turkish')}
              className={`px-3 py-1 rounded ${languageCode === 'tr' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage('English')}
              className={`px-3 py-1 rounded ${languageCode === 'en' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('German')}
              className={`px-3 py-1 rounded ${languageCode === 'de' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              DE
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-purple-600 text-2xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-2">{t.subtitle}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.username}
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Kullanıcı adı veya e-posta"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.password}
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Şifrenizi girin"
              />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaSignInAlt className="w-5 h-5" />
            )}
            {isLoading ? 'Giriş yapılıyor...' : t.login}
          </button>
        </form>

        {/* Quick Access Link */}
        <div className="mt-6 text-center">
          <a
            href="/business/quick-access"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            {t.quickAccess} →
          </a>
            </div>

        {/* Help Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-500">
            <a href="#" className="text-purple-600 hover:text-purple-700">
              {t.forgotPassword}
            </a>
          </p>
          <p className="text-sm text-gray-500">
            {t.noAccount} <a href="#" className="text-purple-600 hover:text-purple-700">{t.contactAdmin}</a>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Giriş Bilgileri:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Garson:</strong> waiter / waiter123</p>
            <p><strong>Mutfak:</strong> kitchen / kitchen123</p>
            <p><strong>Kasa:</strong> cashier / cashier123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
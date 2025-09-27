'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Eğer zaten giriş yapmışsa dashboard'a yönlendir
  useEffect(() => {
    const user = localStorage.getItem('masapp-admin-user');
    const token = localStorage.getItem('masapp-admin-token');
    
    if (user && token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Demo admin credentials
      const adminCredentials = {
        username: 'admin',
        password: 'admin123'
      };

      if (formData.username === adminCredentials.username && formData.password === adminCredentials.password) {
        // Admin bilgilerini localStorage'a kaydet
        const adminUser = {
          id: 'admin-1',
          username: 'admin',
          email: 'admin@guzellestir.com',
          role: 'super_admin',
          name: 'Süper Admin',
          loginTime: new Date().toISOString()
        };

        const token = 'admin-token-' + Date.now();

        localStorage.setItem('masapp-admin-user', JSON.stringify(adminUser));
        localStorage.setItem('masapp-admin-token', token);

        // Dashboard'a yönlendir
        router.push('/admin/dashboard');
      } else {
        setError('Kullanıcı adı veya şifre hatalı!');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(''); // Hata mesajını temizle
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Girişi</h1>
          <p className="text-gray-600 mt-2">MasApp Yönetim Paneli</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Kullanıcı adınızı girin"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Şifrenizi girin"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Giriş yapılıyor...
              </div>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Giriş Bilgileri:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Kullanıcı Adı:</strong> admin</p>
            <p><strong>Şifre:</strong> admin123</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2024 MasApp. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}

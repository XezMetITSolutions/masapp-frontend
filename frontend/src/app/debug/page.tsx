'use client';

import { useState } from 'react';
import { FaCamera, FaUpload, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

export default function DebugPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: 'Debug Test Ürün',
    description: 'Debug test açıklaması',
    price: '25.00',
    category: '07c1ceaa-a3d9-40a7-91b7-e99b0e00c29a'
  });

  const restaurantId = 'f6811f51-c0b4-4a81-bbb9-6d1a1da3803f';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Seçilen dosya:', file.name, 'Boyut:', file.size, 'Tip:', file.type);
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Lütfen sadece resim dosyası seçin.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        console.log('Yüklenen resim boyutu:', result.length);
        setCapturedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const testImageUpload = async () => {
    if (!capturedImage) {
      alert('Önce bir resim yükleyin!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('=== DEBUG TEST BAŞLADI ===');
      console.log('Form Data:', formData);
      console.log('Captured Image:', capturedImage ? 'VAR (' + capturedImage.length + ' karakter)' : 'YOK');
      console.log('Restaurant ID:', restaurantId);

      const createData = {
        categoryId: formData.category,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        imageUrl: capturedImage,
        order: 1,
        isAvailable: true,
        isPopular: false
      };

      console.log('Create Data gönderiliyor:', createData);
      console.log('Resim URL uzunluğu:', createData.imageUrl.length);

      const response = await fetch(`https://masapp-backend.onrender.com/api/restaurants/${restaurantId}/menu/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setResult({
          success: true,
          data: responseData,
          message: 'Ürün başarıyla oluşturuldu!'
        });
      } else {
        setError(`Hata: ${response.status} - ${responseData.message || 'Bilinmeyen hata'}`);
      }
    } catch (err: any) {
      console.error('Test hatası:', err);
      setError(`Network hatası: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetItems = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`https://masapp-backend.onrender.com/api/restaurants/${restaurantId}/menu/items`);
      const data = await response.json();
      
      console.log('Mevcut ürünler:', data);
      setResult({
        success: true,
        data: data,
        message: `Toplam ${data.data?.length || 0} ürün bulundu`
      });
    } catch (err: any) {
      setError(`Get items hatası: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Resim Yükleme Debug Sayfası</h1>
        
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ürün Bilgileri</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Resim Yükleme */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Resim Yükleme</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Dosya Yükleme */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <FaUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600">Dosyadan Yükle</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 5MB)</p>
              </label>
            </div>

            {/* Resim Önizleme */}
            <div className="border-2 border-gray-300 rounded-lg p-6 text-center">
              {capturedImage ? (
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Önizleme"
                    className="max-w-full max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Boyut: {capturedImage.length} karakter
                  </p>
                </div>
              ) : (
                <div className="text-gray-400">
                  <FaCamera className="mx-auto text-4xl mb-2" />
                  <p className="text-sm">Resim önizlemesi</p>
            </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Butonları */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test İşlemleri</h2>
          <div className="flex gap-4">
            <button
              onClick={testImageUpload}
              disabled={loading || !capturedImage}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              Resim ile Ürün Oluştur
            </button>
            <button
              onClick={testGetItems}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              Mevcut Ürünleri Getir
            </button>
          </div>
        </div>

        {/* Sonuçlar */}
        {(result || error) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Sonuçlar</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-red-800">
                  <FaTimes />
                  <span className="font-medium">Hata:</span>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-green-800">
                  <FaCheck />
                  <span className="font-medium">Başarılı:</span>
                </div>
                <p className="text-green-700 mt-1">{result.message}</p>
            </div>
          )}

            {(result || error) && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Detaylı Sonuç:</h3>
                <pre className="text-xs text-gray-600 overflow-auto max-h-96 bg-white p-3 rounded border">
                  {JSON.stringify(result || error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Console Logları */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Console Logları</h2>
          <p className="text-sm text-gray-600 mb-2">
            F12 tuşuna basın ve Console sekmesini açın. Tüm debug logları orada görünecek.
          </p>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
            <div>🔍 Debug logları console'da görünecek</div>
            <div>📊 Resim boyutu ve veri kontrolü</div>
            <div>🌐 API request/response detayları</div>
            <div>✅ Başarı/hata durumları</div>
          </div>
        </div>
      </div>
    </div>
  );
}
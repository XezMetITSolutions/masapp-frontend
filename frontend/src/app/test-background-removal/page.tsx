'use client';

import React, { useState } from 'react';
import { FaUpload, FaTrash, FaDownload, FaSpinner, FaImage } from 'react-icons/fa';

export default function BackgroundRemovalTest() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      console.log('🔄 Arkaplan silme başlatılıyor...');
      const startTime = Date.now();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/background-removal/remove-background`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: selectedImage
        }),
      });

      const data = await response.json();
      const endTime = Date.now();

      if (data.success) {
        setProcessedImage(data.data.processedImage);
        setProcessingTime(data.data.processingTime);
        console.log('✅ Arkaplan silindi!', data.data);
      } else {
        throw new Error(data.message || 'Arkaplan silme başarısız');
      }
    } catch (error) {
      console.error('❌ Arkaplan silme hatası:', error);
      setError(error instanceof Error ? error.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageData: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImages = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setError(null);
    setProcessingTime(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <FaImage className="mr-3 text-blue-600" />
            RemBG Arkaplan Silme Test
          </h1>

          {/* Test Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Test Durumu</h2>
            <p className="text-blue-700">
              Bu sayfa RemBG Python kütüphanesinin performansını test eder.
              Render'da RemBG'nin çalışıp çalışmadığını kontrol edin.
            </p>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resim Yükle
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FaUpload className="mr-2" />
                Resim Seç
              </label>
              {selectedImage && (
                <button
                  onClick={clearImages}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Temizle
                </button>
              )}
            </div>
          </div>

          {/* Images Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Original Image */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Orijinal Resim</h3>
              {selectedImage ? (
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                  Resim seçilmedi
                </div>
              )}
            </div>

            {/* Processed Image */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Arkaplan Silinmiş</h3>
              {processedImage ? (
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="max-w-full h-auto rounded-lg"
                  />
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => downloadImage(processedImage, 'arkaplan-silinmis.png')}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      <FaDownload className="mr-1" />
                      İndir
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Arkaplan siliniyor...
                    </div>
                  ) : (
                    'Arkaplan silinmedi'
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={removeBackground}
              disabled={!selectedImage || loading}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <FaTrash className="mr-2" />
                  Arkaplanı Sil
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {processingTime && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">İşlem Sonuçları</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-800">İşlem Süresi:</span>
                  <span className="ml-2 text-green-700">{processingTime}ms</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Durum:</span>
                  <span className="ml-2 text-green-700">Başarılı</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Hata</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Test Talimatları</h3>
            <ol className="list-decimal list-inside text-yellow-800 space-y-1">
              <li>Bir yemek fotoğrafı yükleyin</li>
              <li>"Arkaplanı Sil" butonuna tıklayın</li>
              <li>İşlem süresini not edin</li>
              <li>Sonuç kalitesini değerlendirin</li>
              <li>Render'da RemBG'nin çalışıp çalışmadığını kontrol edin</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

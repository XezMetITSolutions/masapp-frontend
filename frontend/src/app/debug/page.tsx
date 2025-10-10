'use client';

import { useState, useRef } from 'react';
import { FaCamera, FaUpload, FaTrash, FaCheck } from 'react-icons/fa';

export default function DebugPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [fileImage, setFileImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const startCamera = async () => {
    try {
      addLog('Kamera başlatılıyor...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 800 },
          height: { ideal: 600 },
          facingMode: 'environment' // Arka kamera
        } 
      });
      
      setCameraStream(stream);
      setIsCameraOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      addLog('Kamera başarıyla başlatıldı');
    } catch (error) {
      addLog(`Kamera hatası: ${error}`);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraOpen(false);
      addLog('Kamera durduruldu');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (video && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      addLog(`Kamera ile çekilen resim: ${imageData.length} karakter`);
      addLog(`Resim boyutu: ${canvas.width}x${canvas.height}`);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addLog(`Seçilen dosya: ${file.name}`);
      addLog(`Dosya boyutu: ${file.size} bytes`);
      addLog(`Dosya tipi: ${file.type}`);
      
      if (file.size > 5 * 1024 * 1024) {
        addLog('HATA: Dosya boyutu çok büyük (max 5MB)');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        addLog('HATA: Sadece resim dosyası seçin');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFileImage(result);
        addLog(`Dosya yüklendi: ${result.length} karakter`);
      };
      reader.readAsDataURL(file);
    }
  };

  const testImageUpload = async () => {
    const imageToTest = capturedImage || fileImage;
    if (!imageToTest) {
      addLog('HATA: Test edilecek resim yok');
      return;
    }
    
    try {
      addLog('Test başlatılıyor...');
      
      // Backend API test
      const response = await fetch('https://masapp-backend.onrender.com/api/test-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageToTest,
          testData: {
            filename: 'debug-test.jpg',
            size: imageToTest.length,
            timestamp: new Date().toISOString()
          }
        }),
      });

      const result = await response.json();
      setTestResults(result);
      
      if (response.ok) {
        addLog('✅ Backend test başarılı');
        addLog(`Backend yanıtı: ${JSON.stringify(result)}`);
      } else {
        addLog(`❌ Backend test hatası: ${response.status}`);
        addLog(`Hata detayı: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      addLog(`❌ Test hatası: ${error}`);
    }
  };

  const testMenuAPI = async () => {
    try {
      addLog('Menü API test ediliyor...');
      
      // Restaurant ID'yi test için kullan
      const restaurantId = 'f6811f51-c0b4-4a81-bbb9-6d1a1da3803f';
      const imageToTest = capturedImage || fileImage || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A';
      
      // Önce kategorileri çek
      addLog('Kategoriler çekiliyor...');
      const categoriesResponse = await fetch(`https://masapp-backend.onrender.com/api/restaurants/${restaurantId}/menu/categories`);
      const categoriesResult = await categoriesResponse.json();
      
      if (!categoriesResponse.ok || !categoriesResult.success) {
        addLog(`❌ Kategori çekme hatası: ${categoriesResponse.status}`);
        addLog(`Hata detayı: ${JSON.stringify(categoriesResult)}`);
      return;
    }
    
      const categories = categoriesResult.data || [];
      if (categories.length === 0) {
        addLog('❌ Hiç kategori bulunamadı');
        return;
      }
      
      const firstCategory = categories[0];
      addLog(`✅ İlk kategori bulundu: ${firstCategory.name} (ID: ${firstCategory.id})`);
      
      // Resmi küçült (ilk 1000 karakter)
      const smallImageToTest = imageToTest.substring(0, 1000);
      addLog(`Resim küçültüldü: ${imageToTest.length} -> ${smallImageToTest.length} karakter`);
      
      const menuItemData = {
        categoryId: firstCategory.id,
        name: 'Debug Test Ürün',
        price: 25.50,
        imageUrl: smallImageToTest
      };

      addLog(`Gönderilen veri: ${JSON.stringify(menuItemData, null, 2)}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout

      try {
        const response = await fetch(`https://masapp-backend.onrender.com/api/restaurants/${restaurantId}/menu/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(menuItemData),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

      const result = await response.json();
      
      addLog(`Response status: ${response.status}`);
      addLog(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
      addLog(`Response body: ${JSON.stringify(result, null, 2)}`);
      
      if (response.ok) {
        addLog('✅ Menü ürünü başarıyla oluşturuldu');
        addLog(`Oluşturulan ürün ID: ${result.data?.id}`);
        addLog(`Resim URL uzunluğu: ${result.data?.imageUrl?.length || 0}`);
      } else {
        addLog(`❌ Menü API hatası: ${response.status}`);
        addLog(`Hata detayı: ${JSON.stringify(result)}`);
        
        // Daha basit bir test yapalım
        addLog('Basit test yapılıyor...');
        const simpleData = {
          categoryId: firstCategory.id,
          name: 'Basit Test',
          price: 10.00,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD'
        };
        
        const simpleResponse = await fetch(`https://masapp-backend.onrender.com/api/restaurants/${restaurantId}/menu/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(simpleData),
        });
        
        const simpleResult = await simpleResponse.json();
        addLog(`Basit test sonucu: ${simpleResponse.status}`);
        addLog(`Basit test detayı: ${JSON.stringify(simpleResult)}`);
        
        // Yeni test endpoint'ini dene
        addLog('Yeni test endpoint deneniyor...');
        const newTestResponse = await fetch('https://masapp-backend.onrender.com/api/test-menu-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantId,
            categoryId: firstCategory.id,
            name: 'Test Ürün',
            price: 15.50,
            imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD'
          }),
        });
        
        const newTestResult = await newTestResponse.json();
        addLog(`Yeni test endpoint sonucu: ${newTestResponse.status}`);
        addLog(`Yeni test endpoint detayı: ${JSON.stringify(newTestResult)}`);
      }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          addLog(`❌ Timeout: İstek 10 saniyede tamamlanmadı`);
        } else {
          addLog(`❌ Fetch hatası: ${fetchError.message}`);
        }
      }
    } catch (error) {
      addLog(`❌ Menü API test hatası: ${error}`);
    }
  };

  const clearAll = () => {
    setCapturedImage(null);
    setFileImage(null);
    setTestResults(null);
    setLogs([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    addLog('Tüm veriler temizlendi');
  };

  const currentImage = capturedImage || fileImage;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Resim Yükleme Debug Sayfası</h1>
        
        {/* Image Display */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Resim Önizleme</h2>
          {currentImage ? (
            <div className="space-y-4">
              <img 
                src={currentImage} 
                alt="Yüklenen resim" 
                className="max-w-md h-64 object-cover rounded-lg border"
                onLoad={() => addLog('Resim başarıyla yüklendi')}
                onError={() => addLog('❌ Resim yüklenirken hata oluştu')}
              />
              <div className="text-sm text-gray-600">
                <p>Resim boyutu: {currentImage.length} karakter</p>
                <p>Resim tipi: {currentImage.substring(0, 50)}...</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Henüz resim yüklenmedi
            </div>
          )}
        </div>

        {/* Camera Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📷 Kamera ile Çek</h2>
          
          {!isCameraOpen ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <FaCamera />
              Kamerayı Aç
            </button>
          ) : (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md h-64 object-cover rounded-lg border"
              />
              <div className="flex gap-2">
                <button
                  onClick={capturePhoto}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <FaCheck />
                  Fotoğraf Çek
                </button>
                <button
                  onClick={stopCamera}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <FaTrash />
                  Kamerayı Kapat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📁 Dosya Yükle</h2>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
          >
            <FaUpload />
            Dosya Seç
          </button>
                  </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Test İşlemleri</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testImageUpload}
              disabled={!currentImage}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Backend API
            </button>
            
            <button
              onClick={testMenuAPI}
              className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
            >
              Test Menü API
            </button>
            
            <button
              onClick={clearAll}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              <FaTrash />
              Temizle
            </button>
            </div>
              </div>

        {/* Test Results */}
        {testResults && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📊 Test Sonuçları</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {/* Logs */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">📝 Loglar</h2>
          <div className="bg-black text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">Henüz log yok...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
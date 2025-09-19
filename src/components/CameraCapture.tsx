'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaTimes, FaCheck, FaUndo, FaRedo, FaMagic, FaSpinner } from 'react-icons/fa';
import { aiImageProcessor, ImageEnhancementOptions, ProcessedImage } from '@/lib/aiImageProcessor';
import AIImagePreview from './AIImagePreview';

interface CameraCaptureProps {
  onCapture: (imageBlob: Blob) => void;
  onClose: () => void;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  enableAI?: boolean;
  productCategory?: 'food' | 'drink' | 'dessert';
}

export default function CameraCapture({ 
  onCapture, 
  onClose, 
  aspectRatio = 'square',
  enableAI = true,
  productCategory = 'food'
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [showAIPreview, setShowAIPreview] = useState(false);

  // Kamera boyutları
  const getCameraDimensions = () => {
    switch (aspectRatio) {
      case 'square':
        return { width: 400, height: 400 };
      case 'landscape':
        return { width: 600, height: 400 };
      case 'portrait':
        return { width: 400, height: 600 };
      default:
        return { width: 400, height: 400 };
    }
  };

  const { width, height } = getCameraDimensions();

  // Kamera başlatma
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 800 },
          height: { ideal: 600 },
          facingMode: 'environment' // Arka kamera
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Kamera erişimi reddedildi. Lütfen kamera iznini verin.');
      console.error('Kamera hatası:', err);
    }
  };

  // Kamera durdurma
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Fotoğraf çekme
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    setIsCapturing(true);

    // Canvas boyutlarını ayarla
    canvas.width = width;
    canvas.height = height;

    // Video'dan canvas'a çiz
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);
    
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();

    // Canvas'ı blob'a çevir
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        setIsCapturing(false);
      }
    }, 'image/jpeg', 0.9);
  };

  // Fotoğrafı onayla
  const confirmCapture = async () => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          if (enableAI) {
            // AI işleme başlat
            setIsProcessingAI(true);
            try {
              const template = aiImageProcessor.getImageTemplate(productCategory);
              const options: ImageEnhancementOptions = {
                autoEnhance: true,
                removeBackground: true,
                ...template,
                aspectRatio: 'food', // template'den gelen aspectRatio'yu override et
                style: 'rounded' // template'den gelen style'ı override et
              };
              
              const processed = await aiImageProcessor.processImage(blob, options);
              setProcessedImage(processed);
              setShowAIPreview(true);
            } catch (error) {
              console.error('AI işleme hatası:', error);
              // Hata durumunda orijinal görseli kullan
              onCapture(blob);
              onClose();
            } finally {
              setIsProcessingAI(false);
            }
          } else {
            // AI olmadan direkt kabul et
            onCapture(blob);
            onClose();
          }
        }
      }, 'image/jpeg', 0.9);
    }
  };

  // Yeniden çek
  const retakePhoto = () => {
    setCapturedImage(null);
    setRotation(0);
    setProcessedImage(null);
    setShowAIPreview(false);
  };

  // AI önizleme kabul et
  const handleAIAccept = (imageBlob: Blob) => {
    onCapture(imageBlob);
    onClose();
  };

  // AI önizleme reddet
  const handleAIReject = () => {
    setShowAIPreview(false);
    setProcessedImage(null);
  };

  // AI yeniden uygula
  const handleAIReapply = async (options: ImageEnhancementOptions) => {
    if (!processedImage) return;
    
    setIsProcessingAI(true);
    try {
      const reprocessed = await aiImageProcessor.processImage(processedImage.original, options);
      setProcessedImage(reprocessed);
    } catch (error) {
      console.error('Yeniden işleme hatası:', error);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Döndürme
  const rotateImage = (direction: 'left' | 'right') => {
    setRotation(prev => prev + (direction === 'left' ? -90 : 90));
  };

  // Component mount olduğunda kamerayı başlat
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">📷</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kamera Hatası</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={startCamera}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Tekrar Dene
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI Önizleme Modal'ı
  if (showAIPreview && processedImage) {
    return (
      <AIImagePreview
        processedImage={processedImage}
        onAccept={handleAIAccept}
        onReject={handleAIReject}
        onReapply={handleAIReapply}
        isProcessing={isProcessingAI}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ürün Fotoğrafı Çek</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Kamera Alanı */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {!capturedImage ? (
          <>
            {/* Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Çekim Çerçevesi */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="border-2 border-white border-dashed rounded-lg relative"
                style={{ width: `${width}px`, height: `${height}px` }}
              >
                {/* Köşe işaretleri */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg"></div>
              </div>
            </div>

            {/* Yönergeler */}
            <div className="absolute bottom-20 left-4 right-4 text-center text-white">
              <div className="bg-black bg-opacity-50 rounded-lg p-4">
                <p className="text-sm mb-1">📱 Ürünü çerçeveye hizalayın</p>
                <p className="text-sm mb-1">💡 İyi aydınlatma sağlayın</p>
                <p className="text-sm">🎯 Arka plan temiz olsun</p>
              </div>
            </div>
          </>
        ) : (
          /* Çekilen Fotoğraf Önizlemesi */
          <div className="relative">
            <img
              src={capturedImage}
              alt="Çekilen fotoğraf"
              className="max-w-full max-h-full object-contain"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>
        )}
      </div>

      {/* Kontroller */}
      <div className="bg-white p-4">
        {!capturedImage ? (
          /* Çekim Kontrolleri */
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={capturePhoto}
              disabled={isCapturing}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 disabled:opacity-50"
            >
              <FaCamera size={24} />
            </button>
          </div>
        ) : (
          /* Düzenleme Kontrolleri */
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => rotateImage('left')}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <FaUndo size={20} />
              </button>
              <button
                onClick={() => rotateImage('right')}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <FaRedo size={20} />
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={retakePhoto}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Yeniden Çek
              </button>
              <button
                onClick={confirmCapture}
                disabled={isProcessingAI}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessingAI ? (
                  <FaSpinner className="animate-spin" size={16} />
                ) : enableAI ? (
                  <FaMagic size={16} />
                ) : (
                  <FaCheck size={16} />
                )}
                {isProcessingAI ? 'AI İşleniyor...' : enableAI ? 'AI ile İşle' : 'Onayla'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gizli Canvas */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
}

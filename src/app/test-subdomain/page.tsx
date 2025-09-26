'use client';

import { useEffect, useState } from 'react';
import { getSubdomain, getCurrentRestaurant } from '@/utils/subdomain';

export default function TestSubdomainPage() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [hostname, setHostname] = useState<string>('');

  useEffect(() => {
    setHostname(window.location.hostname);
    const currentSubdomain = getSubdomain();
    setSubdomain(currentSubdomain);
    
    if (currentSubdomain && currentSubdomain !== 'admin') {
      getCurrentRestaurant().then(setRestaurant);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Subdomain Test Sayfası</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Domain Bilgileri</h2>
          <div className="space-y-2">
            <p><strong>Hostname:</strong> {hostname}</p>
            <p><strong>Subdomain:</strong> {subdomain || 'Yok'}</p>
            <p><strong>Full URL:</strong> {typeof window !== 'undefined' ? window.location.href : ''}</p>
          </div>
        </div>

        {restaurant && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Restoran Bilgileri</h2>
            <div className="space-y-2">
              <p><strong>Restoran Adı:</strong> {restaurant.name}</p>
              <p><strong>Subdomain:</strong> {restaurant.subdomain}</p>
              <p><strong>Domain:</strong> {restaurant.domain}</p>
              <p><strong>Durum:</strong> {restaurant.status}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test URL'leri</h2>
          <div className="space-y-2">
            <p><strong>Ana Domain:</strong> <a href="https://guzellestir.com" className="text-blue-600 hover:underline">guzellestir.com</a></p>
            <p><strong>Admin Panel:</strong> <a href="https://admin.guzellestir.com" className="text-blue-600 hover:underline">admin.guzellestir.com</a></p>
            <p><strong>Test Restoran:</strong> <a href="https://kardesler.guzellestir.com" className="text-blue-600 hover:underline">kardesler.guzellestir.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Restaurant } from '@/types';

interface DashboardContentProps {
  restaurant: Restaurant;
}

export default function DashboardContent({ restaurant }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('menu')}
            className={`${activeTab === 'menu' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Menü Yönetimi
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`${activeTab === 'orders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Siparişler
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Ayarlar
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'menu' && <div>Menü yönetimi içeriği burada olacak.</div>}
        {activeTab === 'orders' && <div>Siparişler içeriği burada olacak.</div>}
        {activeTab === 'settings' && <div>Ayarlar içeriği burada olacak.</div>}
      </div>
    </div>
  );
}

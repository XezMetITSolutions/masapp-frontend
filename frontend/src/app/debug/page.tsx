'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';

export default function DebugPage() {
  const [hostname, setHostname] = useState('');
  const [subdomain, setSubdomain] = useState('');
  
  // Auth store
  const { authenticatedRestaurant, authenticatedStaff } = useAuthStore();
  
  // Restaurant store
  const { 
    restaurants, 
    categories: allCategories, 
    menuItems: allMenuItems,
    currentRestaurant
  } = useRestaurantStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname);
      setSubdomain(window.location.hostname.split('.')[0]);
    }
  }, []);

  // Subdomain'e göre restaurant bul
  const findRestaurantBySubdomain = (slug: string) => {
    return restaurants.find(r => 
      r.username === slug || 
      r.id === slug ||
      r.name.toLowerCase() === slug.toLowerCase() ||
      r.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
    );
  };

  const activeRestaurant = findRestaurantBySubdomain(subdomain);

  // Restaurant ID'ye göre filtrele
  const getFilteredData = (restaurantId: string | undefined) => {
    if (!restaurantId) return { categories: [], items: [] };
    
    return {
      categories: allCategories.filter(c => c.restaurantId === restaurantId),
      items: allMenuItems.filter(i => i.restaurantId === restaurantId)
    };
  };

  const filteredData = getFilteredData(activeRestaurant?.id);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Restaurant Store Debug</h1>
        
        {/* URL Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📍 URL Bilgileri</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-600">Hostname:</span>
              <span className="ml-2 text-blue-600">{hostname}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Subdomain:</span>
              <span className="ml-2 text-green-600">{subdomain}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Full URL:</span>
              <span className="ml-2 text-purple-600">{typeof window !== 'undefined' ? window.location.href : 'Loading...'}</span>
            </div>
          </div>
        </div>

        {/* Auth Store */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔐 Auth Store</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-600">Authenticated Restaurant:</span>
              <span className="ml-2 text-blue-600">{authenticatedRestaurant?.name || 'None'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Restaurant ID:</span>
              <span className="ml-2 text-green-600">{authenticatedRestaurant?.id || 'None'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Authenticated Staff:</span>
              <span className="ml-2 text-purple-600">{authenticatedStaff?.name || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Restaurant Store Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🏪 Restaurant Store Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{restaurants.length}</div>
              <div className="text-sm text-gray-600">Total Restaurants</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{allCategories.length}</div>
              <div className="text-sm text-gray-600">Total Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{allMenuItems.length}</div>
              <div className="text-sm text-gray-600">Total Menu Items</div>
            </div>
          </div>
        </div>

        {/* All Restaurants */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🏢 All Restaurants</h2>
          {restaurants.length === 0 ? (
            <div className="text-red-600 font-medium">⚠️ No restaurants found in store!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Categories</th>
                    <th className="px-4 py-2 text-left">Menu Items</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((restaurant, index) => {
                    const restaurantCategories = allCategories.filter(c => c.restaurantId === restaurant.id);
                    const restaurantItems = allMenuItems.filter(i => i.restaurantId === restaurant.id);
                    
                    return (
                      <tr key={restaurant.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 font-medium">{restaurant.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{restaurant.id}</td>
                        <td className="px-4 py-2 text-sm text-blue-600">{restaurant.username || 'N/A'}</td>
                        <td className="px-4 py-2 text-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {restaurantCategories.length}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {restaurantItems.length}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Active Restaurant (Subdomain Match) */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🎯 Active Restaurant (Subdomain: {subdomain})</h2>
          {activeRestaurant ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800">✅ Restaurant Found!</div>
                <div className="mt-2 space-y-1">
                  <div><span className="font-medium">Name:</span> {activeRestaurant.name}</div>
                  <div><span className="font-medium">ID:</span> {activeRestaurant.id}</div>
                  <div><span className="font-medium">Username:</span> {activeRestaurant.username || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-blue-600">{filteredData.categories.length}</div>
                  <div className="text-sm text-gray-600">Categories for this restaurant</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-purple-600">{filteredData.items.length}</div>
                  <div className="text-sm text-gray-600">Menu items for this restaurant</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="font-medium text-red-800">❌ No restaurant found for subdomain: {subdomain}</div>
              <div className="mt-2 text-sm text-red-600">
                This means the subdomain doesn't match any restaurant's username, id, or name in the store.
              </div>
            </div>
          )}
        </div>

        {/* Menu Items Details */}
        {filteredData.items.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🍽️ Menu Items for {activeRestaurant?.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.items.slice(0, 9).map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="font-medium text-gray-800">{item.name.tr || item.name.en}</div>
                  <div className="text-sm text-gray-600">₺{item.price}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {item.restaurantId}</div>
                </div>
              ))}
            </div>
            {filteredData.items.length > 9 && (
              <div className="mt-4 text-center text-gray-600">
                ... and {filteredData.items.length - 9} more items
              </div>
            )}
          </div>
        )}

        {/* Raw Data */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Raw Data (JSON)</h2>
          <div className="space-y-4">
            <details className="border rounded-lg">
              <summary className="p-3 bg-gray-50 cursor-pointer font-medium">All Restaurants JSON</summary>
              <pre className="p-3 text-xs bg-gray-100 overflow-auto max-h-64">
                {JSON.stringify(restaurants, null, 2)}
              </pre>
            </details>
            
            <details className="border rounded-lg">
              <summary className="p-3 bg-gray-50 cursor-pointer font-medium">All Menu Items JSON</summary>
              <pre className="p-3 text-xs bg-gray-100 overflow-auto max-h-64">
                {JSON.stringify(allMenuItems, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

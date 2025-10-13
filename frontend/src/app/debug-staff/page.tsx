'use client';

import { useState, useEffect } from 'react';
import apiService from '@/services/api';

export default function StaffDebugPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loginTest, setLoginTest] = useState({
    username: 'kasa_hazal',
    password: '123456',
    subdomain: 'hazal'
  });
  const [loginResult, setLoginResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Restaurant'ları getir
      const restaurantsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/restaurants`);
      const restaurantsData = await restaurantsResponse.json();
      setRestaurants(restaurantsData.data || []);

      // Staff'ları getir
      const staffResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/all`);
      const staffData = await staffResponse.json();
      setStaff(staffData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setLoginResult(null);

    try {
      const response = await apiService.staffLogin(
        loginTest.username,
        loginTest.password,
        loginTest.subdomain
      );
      setLoginResult(response);
    } catch (error: any) {
      setLoginResult({
        success: false,
        error: error.message,
        status: error.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Staff Login Debug</h1>

        {/* Restaurant Listesi */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Restaurant Listesi</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Listesi */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Staff Listesi</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.restaurant?.name} ({member.restaurant?.username})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Staff Test</h2>
          
          <div className="mb-4">
            <button
              onClick={async () => {
                try {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/test`);
                  const result = await response.json();
                  console.log('Staff test result:', result);
                  alert(`Staff Test Result: ${JSON.stringify(result, null, 2)}`);
                } catch (error) {
                  console.error('Error testing staff:', error);
                  alert(`Error: ${error}`);
                }
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
            >
              Test Staff Model
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/restore-restaurants`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  });
                  const result = await response.json();
                  console.log('Restaurant restore result:', result);
                  alert(`Restaurant Restore Result: ${JSON.stringify(result, null, 2)}`);
                  
                  // Refresh data
                  fetchData();
                } catch (error) {
                  console.error('Error restoring restaurants:', error);
                  alert(`Error: ${error}`);
                }
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-4"
            >
              Restore Restaurants
            </button>
            
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Staff Ekleme Test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Staff Ekleme Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant</label>
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Restaurant seçin</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} ({restaurant.username})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value="Kasa Hazal"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="text"
                value="kasa@hazal.com"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value="kasa_hazal"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="text"
                value="123456"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value="cashier"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <button
            onClick={async () => {
              if (!selectedRestaurantId) {
                alert('Lütfen bir restaurant seçin!');
                return;
              }
              
              try {
                const staffData = {
                  name: "Kasa Hazal",
                  email: "kasa@hazal.com",
                  phone: "555-1234",
                  role: "cashier",
                  department: "service",
                  notes: "Test staff member",
                  username: "kasa_hazal",
                  password: "123456"
                };
                
                console.log('Creating staff for restaurant:', selectedRestaurantId);
                console.log('Staff data:', staffData);
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/restaurant/${selectedRestaurantId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(staffData)
                });
                
                const result = await response.json();
                console.log('Staff creation result:', result);
                alert(`Staff creation result: ${JSON.stringify(result, null, 2)}`);
                
                // Refresh data
                fetchData();
              } catch (error) {
                console.error('Error creating staff:', error);
                alert(`Error: ${error}`);
              }
            }}
            disabled={!selectedRestaurantId}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Create Staff
          </button>
        </div>

        {/* Login Test */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Login Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginTest.username}
                onChange={(e) => setLoginTest({...loginTest, username: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginTest.password}
                onChange={(e) => setLoginTest({...loginTest, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
              <input
                type="text"
                value={loginTest.subdomain}
                onChange={(e) => setLoginTest({...loginTest, subdomain: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={testLogin}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>

          {loginResult && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Login Result</h3>
              <div className={`p-4 rounded-lg ${
                loginResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(loginResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

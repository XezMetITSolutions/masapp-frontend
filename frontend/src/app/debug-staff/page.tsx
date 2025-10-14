'use client';

import { useEffect, useState } from 'react';

type Restaurant = { id: string; name: string; username: string; email?: string };
type Staff = { id: string; name: string; email: string; username: string; role: string; restaurantId: string };

export default function DebugStaffPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [form, setForm] = useState({
    name: 'Test Kasa',
    email: 'kasa@test.com',
    username: 'hazal_kasa',
    password: '123456',
    role: 'cashier',
    phone: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Restoranları getir
  useEffect(() => {
    (async () => {
      try {
        console.log('📡 Fetching restaurants...');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/restaurants`);
        const data = await res.json();
        console.log('📊 Restaurants response:', data);
        setRestaurants(data?.data || []);

        if (data?.data?.length) {
          setSelectedRestaurantId(data.data[0].id);
        }
      } catch (e) {
        console.error('❌ Restaurant fetch error:', e);
        setResult({ success: false, message: 'Restaurant fetch failed', error: e });
      }
    })();
  }, []);

  // Staff listesini getir
  const loadStaff = async () => {
    if (!selectedRestaurantId) return;
    
    try {
      console.log('📡 Loading staff for restaurant:', selectedRestaurantId);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/restaurant/${selectedRestaurantId}`);
      const data = await res.json();
      console.log('📊 Staff response:', data);
      setStaff(data?.data || []);
    } catch (e) {
      console.error('❌ Staff fetch error:', e);
      setResult({ success: false, message: 'Staff fetch failed', error: e });
    }
  };

  // Restaurant değiştiğinde staff'ı yükle
  useEffect(() => {
    loadStaff();
  }, [selectedRestaurantId]);

  // Restaurant restore
  const restoreRestaurants = async () => {
    setLoading(true);
    setResult(null);
    try {
      console.log('🔄 Restoring restaurants...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/restore-restaurants`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log('📊 Restore response:', data);
      setResult(data);
      
      // Restoranları yeniden yükle
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/restaurants`);
      const restaurantData = await res.json();
      setRestaurants(restaurantData?.data || []);
    } catch (e: any) {
      console.error('❌ Restore error:', e);
      setResult({ success: false, message: e?.message || 'Restore failed' });
    } finally {
      setLoading(false);
    }
  };

  // Staff ekle
  const createStaff = async () => {
    if (!selectedRestaurantId) {
      alert('Lütfen bir restoran seçin');
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.username.trim() || !form.password.trim()) {
      alert('Ad, e-posta, kullanıcı adı ve şifre zorunludur');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      console.log('📡 Creating staff...', { restaurantId: selectedRestaurantId, ...form });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/restaurant/${selectedRestaurantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          username: form.username.trim(),
          password: form.password,
          role: form.role,
          phone: form.phone.trim() || undefined
        })
      });
      const data = await response.json();
      console.log('📊 Create staff response:', data);
      setResult(data);
      
      // Staff listesini yeniden yükle
      await loadStaff();
    } catch (e: any) {
      console.error('❌ Create staff error:', e);
      setResult({ success: false, message: e?.message || 'Create staff failed' });
    } finally {
      setLoading(false);
    }
  };

  // Staff sil
  const deleteStaff = async (staffId: string) => {
    if (!confirm('Bu personeli silmek istediğinizden emin misiniz?')) return;
    
    setLoading(true);
    setResult(null);
    try {
      console.log('🗑️ Deleting staff:', staffId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/${staffId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log('📊 Delete staff response:', data);
      setResult(data);
      
      // Staff listesini yeniden yükle
      await loadStaff();
    } catch (e: any) {
      console.error('❌ Delete staff error:', e);
      setResult({ success: false, message: e?.message || 'Delete staff failed' });
    } finally {
      setLoading(false);
    }
  };

  // Staff login test
  const testStaffLogin = async (username: string, password: string) => {
    setLoading(true);
    setResult(null);
    try {
      console.log('🔐 Testing staff login...', { username, password });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          subdomain: 'hazal'
        })
      });
      const data = await response.json();
      console.log('📊 Login response:', data);
      setResult(data);
    } catch (e: any) {
      console.error('❌ Login error:', e);
      setResult({ success: false, message: e?.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🔧 Staff Debug Sayfası</h1>

        {/* Restaurant Restore */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🏪 Restaurant Restore</h2>
          <button
            onClick={restoreRestaurants}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Restoring...' : 'Restore Restaurants'}
          </button>
        </div>

        {/* Restaurant Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🏪 Restaurant Seçimi</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Restoran</label>
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Seçiniz</option>
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.username})</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600">
            Toplam {restaurants.length} restoran bulundu
          </p>
        </div>

        {/* Staff Creation */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">👤 Staff Ekleme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ad Soyad"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="mail@ornek.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="kullanici_adi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="waiter">Garson</option>
                <option value="cashier">Kasiyer</option>
                <option value="chef">Aşçı</option>
                <option value="manager">Yönetici</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon (opsiyonel)</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="5xx xxx xx xx"
              />
            </div>
          </div>
          <button
            onClick={createStaff}
            disabled={loading}
            className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Staff Oluştur'}
          </button>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">👥 Staff Listesi ({staff.length})</h2>
          {staff.length === 0 ? (
            <p className="text-gray-500">Henüz staff bulunmuyor</p>
          ) : (
            <div className="space-y-3">
              {staff.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-600">
                      {s.email} • {s.username} • {s.role}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => testStaffLogin(s.username, '123456')}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Login Test
                    </button>
                    <button
                      onClick={() => deleteStaff(s.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Sonuç</h2>
            <div className={`p-4 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
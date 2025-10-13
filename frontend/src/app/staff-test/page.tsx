'use client';

import { useEffect, useState } from 'react';

type Restaurant = { id: string; name: string; username: string; email?: string };

export default function StaffTestPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [form, setForm] = useState({
    name: 'Test Kullanıcı',
    email: '',
    username: '',
    password: '123456',
    role: 'waiter',
    phone: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Restoranları getir
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/restaurants`);
        const data = await res.json();
        setRestaurants(data?.data || []);

        // Hazal gibi yayında mevcut olan ilk restoran seçili gelsin
        if (data?.data?.length) {
          setSelectedRestaurantId(data.data[0].id);
        }
      } catch (e) {
        console.error('Restaurant fetch error:', e);
      }
    })();
  }, []);

  const handleCreate = async () => {
    if (!selectedRestaurantId) {
      alert('Lütfen bir restoran seçin');
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.username.trim() || !form.password.trim()) {
      alert('Ad, e‑posta, kullanıcı adı ve şifre zorunludur');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
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
      setResult(data);
    } catch (e: any) {
      setResult({ success: false, message: e?.message || 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Personel Test Sayfası</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">E‑posta</label>
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
            onClick={handleCreate}
            disabled={loading}
            className="mt-2 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Personel Oluştur'}
          </button>

          {result && (
            <div className="mt-6">
              <div className={`p-4 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



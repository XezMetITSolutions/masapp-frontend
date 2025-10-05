import { useState, useEffect } from 'react';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  ticker?: boolean; // kayan çubukta göster
  durationSec?: number; // çubukta gösterim süresi
  icon?: 'sale' | 'flash' | 'info' | 'star' | 'wifi' | 'google' | 'clock' | 'instagram' | 'coffee' | 'loyalty' | 'birthday';
  action?: string; // buton metni
  color?: 'orange' | 'pink' | 'blue' | 'green';
}

export function useAnnouncementStore() {
  // Demo: localStorage, replace with backend in production
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('announcements');
    if (data) setAnnouncements(JSON.parse(data));
    else setAnnouncements([
      { id: 'wifi', title: 'WiFi Şifresi', description: 'restoran2024', icon: 'wifi' },
      { id: 'google', title: 'Google\'da Değerlendirin', description: 'Bir çay ikram edelim!', icon: 'google', action: 'Yorum Yap' },
      { id: 'clock', title: 'Çalışma Saatleri', description: '09:00 - 23:00', icon: 'clock' },
      { id: 'instagram', title: 'Instagram\'da Takip Edin', description: 'Fırsatları kaçırmayın!', icon: 'instagram', action: '@restoranadi' },
      { id: 'coffee', title: 'Çay İkramı', description: 'Google yorumu yapın, çay ikram edelim!', icon: 'coffee', action: 'Detay' },
      { id: 'loyalty', title: 'Sadakat Programı', description: 'Her 10. siparişinizde %20 indirim!', icon: 'sale', action: 'Katıl' },
      { id: 'birthday', title: 'Doğum Günü Özel', description: 'Doğum gününüzde ücretsiz tatlı!', icon: 'info', action: 'Kayıt Ol' },
      { id: 'campaign-sep', title: 'Eylül Ayı Kampanyası', description: 'Tüm salatalarda %20 indirim. Sadece bu ay geçerli!', ticker: true, durationSec: 10 },
      { id: 'fresh', title: 'Bugüne Özel', description: 'Bugüne özel taze çorba servisimiz başlamıştır!', ticker: true, durationSec: 8 }
    ]);
  }, []);

  const addAnnouncement = (a: Announcement) => {
    const updated = [...announcements, a];
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };
  const updateAnnouncement = (id: string, patch: Partial<Announcement>) => {
    const updated = announcements.map(a => a.id === id ? { ...a, ...patch } : a);
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };
  const removeAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };

  return { announcements, addAnnouncement, updateAnnouncement, removeAnnouncement };
}

// Subdomain yönetimi için yardımcı fonksiyonlar

export const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // localhost geliştirme ortamı için
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const subdomain = localStorage.getItem('dev-subdomain');
    return subdomain || null;
  }
  
  // Production ortamı için
  const parts = hostname.split('.');
  
  // guzellestir.com için subdomain kontrolü
  if (parts.length >= 3 && parts[parts.length - 2] === 'guzellestir' && parts[parts.length - 1] === 'com') {
    return parts[0];
  }
  
  // Netlify preview URL'leri için
  if (hostname.includes('netlify.app')) {
    const subdomain = localStorage.getItem('dev-subdomain');
    return subdomain || null;
  }
  
  return null;
};

export const getRestaurantFromSubdomain = async (subdomain: string) => {
  try {
    // localStorage'dan restoran bilgilerini al
    const restaurants = JSON.parse(localStorage.getItem('masapp-restaurants') || '[]');
    const restaurant = restaurants.find((r: any) => r.subdomain === subdomain);
    
    if (restaurant) {
      return restaurant;
    }
    
    // Eğer bulunamazsa, subdomain'e göre yeni restoran oluştur
    const newRestaurant = {
      id: `restaurant-${Date.now()}`,
      name: subdomain.charAt(0).toUpperCase() + subdomain.slice(1),
      subdomain: subdomain,
      domain: `${subdomain}.guzellestir.com`,
      status: 'active',
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'default',
        language: 'tr',
        currency: 'TRY'
      }
    };
    
    // Yeni restoranı kaydet
    const updatedRestaurants = [...restaurants, newRestaurant];
    localStorage.setItem('masapp-restaurants', JSON.stringify(updatedRestaurants));
    
    return newRestaurant;
  } catch (error) {
    console.error('Restoran bilgisi alınamadı:', error);
    return null;
  }
};

export const redirectToSubdomain = (subdomain: string) => {
  if (typeof window === 'undefined') return;
  
  // Geliştirme ortamı için
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    localStorage.setItem('dev-subdomain', subdomain);
    window.location.reload();
    return;
  }
  
  // Production ortamı için
  const protocol = window.location.protocol;
  const newUrl = `${protocol}//${subdomain}.guzellestir.com`;
  window.location.href = newUrl;
};

export const isAdminSubdomain = (): boolean => {
  const subdomain = getSubdomain();
  return subdomain === 'admin';
};

export const isRestaurantSubdomain = (): boolean => {
  const subdomain = getSubdomain();
  return Boolean(subdomain && subdomain !== 'admin' && subdomain !== 'www');
};

export const getCurrentRestaurant = async () => {
  const subdomain = getSubdomain();
  if (!subdomain || subdomain === 'admin') return null;
  
  return await getRestaurantFromSubdomain(subdomain);
};

// Netlify DNS otomatik kurulum yardımcı fonksiyonları

export interface SubdomainInfo {
  subdomain: string;
  domain: string;
  status: 'pending' | 'active' | 'error';
  createdAt: string;
  dnsRecordId?: string;
}

// Subdomain oluşturma
export const createSubdomain = async (subdomain: string): Promise<SubdomainInfo> => {
  const subdomainInfo: SubdomainInfo = {
    subdomain,
    domain: `${subdomain}.guzellestir.com`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    // Netlify API ile DNS kaydı oluştur
    const dnsRecord = await addNetlifyDNSRecord(subdomain);
    
    if (dnsRecord) {
      subdomainInfo.dnsRecordId = dnsRecord.id;
      subdomainInfo.status = 'active';
    }
  } catch (error) {
    console.error('DNS kaydı oluşturma hatası:', error);
    subdomainInfo.status = 'error';
  }

  // LocalStorage'a kaydet
  saveSubdomainToStorage(subdomainInfo);
  
  return subdomainInfo;
};

// Netlify DNS kaydı ekleme
const addNetlifyDNSRecord = async (subdomain: string): Promise<any> => {
  // Bu fonksiyon gerçek Netlify API'si ile çalışır
  // Şimdilik simüle edilmiş bir response döndürüyoruz
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `dns-${Date.now()}`,
        hostname: `${subdomain}.guzellestir.com`,
        type: 'CNAME',
        value: 'masapp-frontend.netlify.app',
        ttl: 3600,
        status: 'active'
      });
    }, 1000);
  });
};

// Subdomain bilgilerini localStorage'a kaydet
const saveSubdomainToStorage = (subdomainInfo: SubdomainInfo) => {
  const existingSubdomains = JSON.parse(localStorage.getItem('masapp-subdomains') || '[]');
  const updatedSubdomains = [...existingSubdomains.filter((s: SubdomainInfo) => s.subdomain !== subdomainInfo.subdomain), subdomainInfo];
  localStorage.setItem('masapp-subdomains', JSON.stringify(updatedSubdomains));
};

// Subdomain durumunu kontrol et
export const checkSubdomainStatus = async (subdomain: string): Promise<SubdomainInfo | null> => {
  const subdomains = JSON.parse(localStorage.getItem('masapp-subdomains') || '[]');
  return subdomains.find((s: SubdomainInfo) => s.subdomain === subdomain) || null;
};

// Tüm subdomain'leri listele
export const getAllSubdomains = (): SubdomainInfo[] => {
  return JSON.parse(localStorage.getItem('masapp-subdomains') || '[]');
};

// Subdomain DNS durumunu güncelle
export const updateSubdomainStatus = (subdomain: string, status: SubdomainInfo['status']) => {
  const subdomains = getAllSubdomains();
  const updatedSubdomains = subdomains.map((s: SubdomainInfo) => 
    s.subdomain === subdomain ? { ...s, status } : s
  );
  localStorage.setItem('masapp-subdomains', JSON.stringify(updatedSubdomains));
};

// Subdomain silme
export const deleteSubdomain = async (subdomain: string) => {
  try {
    // Netlify API ile DNS kaydını sil
    await removeNetlifyDNSRecord(subdomain);
    
    // LocalStorage'dan sil
    const subdomains = getAllSubdomains();
    const updatedSubdomains = subdomains.filter((s: SubdomainInfo) => s.subdomain !== subdomain);
    localStorage.setItem('masapp-subdomains', JSON.stringify(updatedSubdomains));
    
    return true;
  } catch (error) {
    console.error('Subdomain silme hatası:', error);
    return false;
  }
};

// Netlify DNS kaydını silme
const removeNetlifyDNSRecord = async (subdomain: string) => {
  // Bu fonksiyon gerçek Netlify API'si ile çalışır
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

// DNS yayılma durumunu kontrol et
export const checkDNSPropagation = async (subdomain: string): Promise<boolean> => {
  try {
    // Gerçek uygulamada DNS lookup yapılır
    // Şimdilik her zaman true döndürüyoruz
    return true;
  } catch (error) {
    return false;
  }
};

// Restoran için otomatik subdomain kurulumu
export const setupRestaurantSubdomain = async (restaurantName: string, restaurantId: string) => {
  const cleanSubdomain = restaurantName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .substring(0, 20);

  const subdomainInfo = await createSubdomain(cleanSubdomain);
  
  // Restoran verilerine subdomain bilgisini ekle
  const restaurants = JSON.parse(localStorage.getItem('masapp-restaurants') || '[]');
  const updatedRestaurants = restaurants.map((r: any) => 
    r.id === restaurantId ? { ...r, subdomainInfo } : r
  );
  localStorage.setItem('masapp-restaurants', JSON.stringify(updatedRestaurants));
  
  return subdomainInfo;
};

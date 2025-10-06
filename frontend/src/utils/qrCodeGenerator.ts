// QR Code Generation Utilities

export interface QRCodeData {
  id: string;
  name: string;
  type: 'table' | 'general' | 'custom';
  tableNumber?: number;
  restaurantId: string;
  qrCode: string;
  url: string;
  description: string;
  theme: string;
  isActive: boolean;
  scanCount: number;
  createdAt: string;
  token: string;
}

// Token oluşturma fonksiyonu
export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Restaurant slug'ını al - önce subdomain'den, sonra authenticated restaurant'dan
export const getRestaurantSlug = (authenticatedRestaurant?: any): string => {
  // Önce subdomain'den almaya çalış
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const mainDomains = ['localhost', 'www', 'guzellestir'];
    
    if (!mainDomains.includes(subdomain) && hostname.includes('.')) {
      return subdomain;
    }
  }
  
  // Subdomain yoksa authenticated restaurant'dan al
  if (authenticatedRestaurant) {
    // Restaurant name'den slug oluştur
    if (authenticatedRestaurant.name) {
      const slug = authenticatedRestaurant.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 20); // Max 20 karakter
      
      // Bilinen restaurant name'leri için özel mapping
      const nameMapping: { [key: string]: string } = {
        'lezzet-restaurant': 'lezzet',
        'kardesler-lokantasi': 'kardesler',
        'pizza-palace': 'pizza',
        'cafe-central': 'cafe'
      };
      
      return nameMapping[slug] || slug;
    }
    
    // Username varsa onu kullan
    if (authenticatedRestaurant.username) {
      return authenticatedRestaurant.username;
    }
  }
  
  // Son çare olarak current URL'den tahmin et
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath.includes('lezzet')) return 'lezzet';
    if (currentPath.includes('kardesler')) return 'kardesler';
    if (currentPath.includes('pizza')) return 'pizza';
    if (currentPath.includes('cafe')) return 'cafe';
  }
  
  return 'lezzet'; // Default olarak lezzet kullan (demo yerine)
};

// QR kod URL'i oluştur
export const createQRCodeURL = (restaurantSlug: string, tableNumber?: number, token?: string): string => {
  const baseUrl = `https://${restaurantSlug}.guzellestir.com`;
  
  if (tableNumber) {
    return `${baseUrl}/menu/masa/${tableNumber}${token ? `?token=${token}` : ''}`;
  } else {
    return `${baseUrl}/menu${token ? `?token=${token}` : ''}`;
  }
};

// QR kod image URL'i oluştur
export const createQRCodeImageURL = (dataUrl: string, theme: string = 'default'): string => {
  const encodedData = encodeURIComponent(dataUrl);
  const baseUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
  
  // Tema parametreleri
  switch (theme) {
    case 'modern':
      return `${baseUrl}&bgcolor=F8F9FA&color=1F2937&format=png&margin=10`;
    case 'classic':
      return `${baseUrl}&bgcolor=FFFFFF&color=8B4513&format=png&margin=15`;
    case 'minimal':
      return `${baseUrl}&bgcolor=FFFFFF&color=000000&format=png&margin=5`;
    case 'romantic':
      return `${baseUrl}&bgcolor=FFF0F5&color=8B008B&format=png&margin=12`;
    default:
      return `${baseUrl}&bgcolor=FFFFFF&color=000000&format=png&margin=8`;
  }
};

// Masa QR kodu oluştur
export const createTableQRCode = (
  tableNumber: number, 
  restaurantId: string,
  theme: string = 'default',
  authenticatedRestaurant?: any
): QRCodeData => {
  const restaurantSlug = getRestaurantSlug(authenticatedRestaurant);
  const token = generateToken();
  const url = createQRCodeURL(restaurantSlug, tableNumber, token);
  const qrCodeImage = createQRCodeImageURL(url, theme);
  
  return {
    id: `table-${tableNumber}-${Date.now()}`,
    name: `Masa ${tableNumber} - QR Menü`,
    type: 'table',
    tableNumber,
    restaurantId,
    qrCode: qrCodeImage,
    url,
    description: `Masa ${tableNumber} için QR kod menü`,
    theme,
    isActive: true,
    scanCount: 0,
    createdAt: new Date().toISOString(),
    token
  };
};

// Genel QR kodu oluştur
export const createGeneralQRCode = (
  name: string,
  restaurantId: string,
  theme: string = 'default',
  authenticatedRestaurant?: any
): QRCodeData => {
  const restaurantSlug = getRestaurantSlug(authenticatedRestaurant);
  const token = generateToken();
  const url = createQRCodeURL(restaurantSlug, undefined, token);
  const qrCodeImage = createQRCodeImageURL(url, theme);
  
  return {
    id: `general-${Date.now()}`,
    name,
    type: 'general',
    restaurantId,
    qrCode: qrCodeImage,
    url,
    description: `Genel menü QR kodu`,
    theme,
    isActive: true,
    scanCount: 0,
    createdAt: new Date().toISOString(),
    token
  };
};

// Toplu masa QR kodları oluştur
export const createBulkTableQRCodes = (
  startTable: number,
  count: number,
  restaurantId: string,
  theme: string = 'default',
  authenticatedRestaurant?: any
): QRCodeData[] => {
  const qrCodes: QRCodeData[] = [];
  
  for (let i = 0; i < count; i++) {
    const tableNumber = startTable + i;
    qrCodes.push(createTableQRCode(tableNumber, restaurantId, theme, authenticatedRestaurant));
  }
  
  return qrCodes;
};

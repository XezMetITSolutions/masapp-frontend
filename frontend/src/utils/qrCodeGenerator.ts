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

// Subdomain'den restaurant slug'ını al
export const getRestaurantSlug = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const mainDomains = ['localhost', 'www', 'guzellestir'];
    
    if (!mainDomains.includes(subdomain) && hostname.includes('.')) {
      return subdomain;
    }
  }
  return 'demo';
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
  theme: string = 'default'
): QRCodeData => {
  const restaurantSlug = getRestaurantSlug();
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
  theme: string = 'default'
): QRCodeData => {
  const restaurantSlug = getRestaurantSlug();
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
  theme: string = 'default'
): QRCodeData[] => {
  const qrCodes: QRCodeData[] = [];
  
  for (let i = 0; i < count; i++) {
    const tableNumber = startTable + i;
    qrCodes.push(createTableQRCode(tableNumber, restaurantId, theme));
  }
  
  return qrCodes;
};

// Bu dosya, external dependency'leri (jsonwebtoken) kaldırmak için basitleştirilmiştir.
// Gerçek bir uygulamada JWT kütüphaneleri ve daha güçlü şifreleme algoritmaları kullanılmalıdır.

import { UserRole } from '@/types';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
  iat: number;
  exp: number;
}

// CSRF token oluşturma
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// CSRF token doğrulama
export function verifyCSRFToken(headerToken: string, cookieToken: string): boolean {
  return headerToken === cookieToken;
}

// Rate limiting kontrolü
export function checkRateLimit(ip: string, endpoint: string, windowMs?: number): boolean {
  // Demo amaçlı basit rate limiting
  // Gerçek uygulamada Redis veya başka bir cache sistemi kullanılmalıdır
  return true; // Her zaman true döndür (demo için)
}

// Demo amaçlı basit bir token doğrulama fonksiyonu
export function verifyToken(token: string): JWTPayload | null {
  if (token === 'demo-admin-token') {
    return {
      userId: 'admin-1',
      email: 'admin@masapp.com',
      role: 'super_admin',
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + (24 * 60 * 60) // 24 saat
    };
  }
  if (token === 'demo-access-token') {
    return {
      userId: 'user-1',
      email: 'user@masapp.com',
      role: 'restaurant_owner',
      restaurantId: 'restaurant-1',
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + (24 * 60 * 60) // 24 saat
    };
  }
  return null;
}

// Demo token oluşturma
export function createSecureToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  if (payload.role === 'super_admin') {
    return 'demo-admin-token';
  }
  return 'demo-access-token';
}

// Demo token yenileme
export function refreshToken(token: string): string | null {
  if (token === 'demo-refresh-token') {
    return 'demo-access-token';
  }
  return null;
}

// Demo şifre hash'leme
export function hashPassword(password: string): string {
  // Demo için sabit bir hash döndür
  return '$2b$12$edZ0/kaYeqOg2DXwUUjQZOFopMWTWt..Ao4gSFT/6P9bM7EzbauG.';
}

// Demo şifre doğrulama
export function verifyPassword(password: string, hashedPassword: string): boolean {
  return password === 'admin123' && hashedPassword === '$2b$12$edZ0/kaYeqOg2DXwUUjQZOFopMWTWt..Ao4gSFT/6P9bM7EzbauG.';
}
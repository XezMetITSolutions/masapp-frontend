// Bu dosya, karmaşık auth logic'i ve external dependency'leri kaldırmak için basitleştirilmiştir.
// Gerçek bir uygulamada JWT, bcrypt gibi kütüphaneler kullanılmalıdır.

import { UserRole } from '@/types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
  iat: number;
  exp: number;
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

// Demo amaçlı basit bir şifre doğrulama fonksiyonu
export function verifyPassword(password: string, hashedPassword: string): boolean {
  // Demo için her zaman true döndür veya basit bir kontrol yap
  return password === 'admin123' && hashedPassword === '$2b$12$edZ0/kaYeqOg2DXwUUjQZOFopMWTWt..Ao4gSFT/6P9bM7EzbauG.';
}

// Demo token oluşturma
export function generateTokens(user: { id: string; email: string; role: UserRole; restaurantId?: string }): AuthTokens {
  const accessToken = user.role === 'super_admin' ? 'demo-admin-token' : 'demo-access-token';
  const refreshToken = 'demo-refresh-token';
  
  return {
    accessToken,
    refreshToken
  };
}

// Demo şifre hash'leme
export function hashPassword(password: string): string {
  // Demo için sabit bir hash döndür
  return '$2b$12$edZ0/kaYeqOg2DXwUUjQZOFopMWTWt..Ao4gSFT/6P9bM7EzbauG.';
}

// Demo token yenileme
export function refreshToken(refreshToken: string): AuthTokens | null {
  if (refreshToken === 'demo-refresh-token') {
    return {
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token'
    };
  }
  return null;
}

// Email validasyonu
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Şifre güçlülük kontrolü
export function isStrongPassword(password: string): boolean {
  // En az 8 karakter, büyük harf, küçük harf, rakam ve özel karakter
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}
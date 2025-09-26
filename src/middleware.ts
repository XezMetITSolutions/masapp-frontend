import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const subdomain = getSubdomain(hostname);
  
  // Admin subdomain kontrolü
  if (subdomain === 'admin') {
    if (!pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }
  
  // Restoran subdomain kontrolü
  if (subdomain && subdomain !== 'www') {
    return handleRestaurantSubdomain(request, subdomain);
  }
  
  // Ana domain - admin panel'e yönlendir
  if (hostname === 'guzellestir.com' || hostname === 'www.guzellestir.com') {
    if (!pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  // Admin sayfalarını koru
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  // Business sayfalarını koru
  if (pathname.startsWith('/business')) {
    // Login sayfası hariç
    if (pathname === '/business/login') {
      return NextResponse.next();
    }
    
    // Demo token kontrolü (business paneli için)
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken || accessToken !== 'demo-access-token') {
      return NextResponse.redirect(new URL('/business/login', request.url));
    }
  }
  
  return NextResponse.next();
}

function getSubdomain(hostname: string): string | null {
  const parts = hostname.split('.');
  
  // localhost için özel kontrol
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return null;
  }
  
  // En az 3 parça olmalı (subdomain.domain.com)
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
}

function handleRestaurantSubdomain(request: NextRequest, subdomain: string) {
  const { pathname } = request.nextUrl;
  
  // Restoran subdomain'i için business panel'e yönlendir
  if (pathname === '/') {
    // Ana sayfa - business dashboard
    return NextResponse.rewrite(new URL('/business/dashboard', request.url));
  }
  
  if (pathname.startsWith('/business')) {
    // Business panel sayfaları
    return NextResponse.next();
  }
  
  if (pathname.startsWith('/kitchen')) {
    // Mutfak paneli
    return NextResponse.next();
  }
  
  // Diğer tüm istekler için business dashboard'a yönlendir
  return NextResponse.rewrite(new URL('/business/dashboard', request.url));
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/business/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
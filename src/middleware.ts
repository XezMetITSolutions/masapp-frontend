import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Netlify'da subdomain kontrolü devre dışı
  // const subdomain = getSubdomain(hostname);
  
  // Admin sayfalarını koru - Demo için direkt erişim
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
  
  // Restoran subdomain'i için özel routing
  if (pathname === '/') {
    // Ana sayfa - restoran menüsü
    return NextResponse.rewrite(new URL(`/restaurant/${subdomain}`, request.url));
  }
  
  if (pathname.startsWith('/admin')) {
    // Restoran admin paneli
    return NextResponse.rewrite(new URL(`/restaurant/${subdomain}/admin${pathname.replace('/admin', '')}`, request.url));
  }
  
  if (pathname.startsWith('/menu')) {
    // Menü sayfası
    return NextResponse.rewrite(new URL(`/restaurant/${subdomain}/menu${pathname.replace('/menu', '')}`, request.url));
  }
  
  if (pathname.startsWith('/order')) {
    // Sipariş sayfası
    return NextResponse.rewrite(new URL(`/restaurant/${subdomain}/order${pathname.replace('/order', '')}`, request.url));
  }
  
  // Diğer tüm istekler için restoran sayfasına yönlendir
  return NextResponse.rewrite(new URL(`/restaurant/${subdomain}${pathname}`, request.url));
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/business/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
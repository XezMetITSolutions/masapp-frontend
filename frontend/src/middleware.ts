import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Subdomain routing kontrolü
  const subdomain = hostname.split('.')[0];
  
  // Ana domain'ler (subdomain routing yapılmayacak)
  const mainDomains = ['localhost', 'guzellestir', 'masapp', 'www'];
  
  // Query parameter'dan subdomain bilgisi al (geçici çözüm)
  const querySubdomain = searchParams.get('subdomain');
  
  // Eğer subdomain varsa ve ana domain değilse VEYA query parameter varsa
  if ((!mainDomains.includes(subdomain) && hostname.includes('.')) || querySubdomain) {
    // Subdomain-based routing
    if (pathname === '/mutfak') {
      return NextResponse.rewrite(new URL('/business/kitchen', request.url));
    }
    if (pathname === '/garson') {
      return NextResponse.rewrite(new URL('/business/waiter', request.url));
    }
    if (pathname === '/kasa') {
      return NextResponse.rewrite(new URL('/business/cashier', request.url));
    }
    
    // Subdomain ana sayfası business dashboard'a yönlendir
    if (pathname === '/' && querySubdomain) {
      return NextResponse.rewrite(new URL('/business/dashboard', request.url));
    }
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

export const config = {
  matcher: [
    '/business/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
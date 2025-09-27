import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // localhost geliştirme ortamı için
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return NextResponse.next();
  }
  
  // Netlify preview URL'leri için
  if (hostname.includes('netlify.app')) {
    return NextResponse.next();
  }
  
  // Subdomain kontrolü
  const parts = hostname.split('.');
  
  // guzellestir.com domain kontrolü
  if (parts.length >= 3 && parts[parts.length - 2] === 'guzellestir' && parts[parts.length - 1] === 'com') {
    const subdomain = parts[0];
    
    // Admin subdomain
    if (subdomain === 'admin') {
      if (url.pathname === '/') {
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
      }
      if (!url.pathname.startsWith('/admin')) {
        url.pathname = `/admin${url.pathname}`;
        return NextResponse.redirect(url);
      }
    }
    // Restoran subdomain'leri
    else if (subdomain !== 'www') {
      if (!url.pathname.startsWith('/business') && !url.pathname.startsWith('/kitchen')) {
        url.pathname = '/business/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
import { NextRequest, NextResponse } from 'next/server';

// Admin paneli güvenlik kontrolleri
export function adminSecurityMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Sadece admin subdomain'inden erişime izin ver
  const hostname = request.headers.get('host') || '';
  const isAdminSubdomain = hostname.startsWith('admin.');
  
  // Admin sayfalarına erişim kontrolü
  if (pathname.startsWith('/admin')) {
    // 1. Subdomain kontrolü (zaten middleware'de yapıldı, burada ek güvenlik)
    if (!isAdminSubdomain) {
      return NextResponse.redirect(new URL('https://admin.guzellestir.com' + pathname));
    }
    
    // 2. HTTPS zorunluluğu
    if (request.nextUrl.protocol !== 'https:') {
      return NextResponse.redirect(new URL(request.url).replace('http:', 'https:'));
    }
    
    // 3. Güvenlik header'ları ekle
    const response = NextResponse.next();
    
    // HSTS (HTTP Strict Transport Security)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // CSP (Content Security Policy)
    response.headers.set('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self'; " +
      "connect-src 'self'; " +
      "frame-ancestors 'none';"
    );
    
    // X-Frame-Options
    response.headers.set('X-Frame-Options', 'DENY');
    
    // X-Content-Type-Options
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy
    response.headers.set('Permissions-Policy', 
      'camera=(), microphone=(), geolocation=(), payment=()'
    );
    
    return response;
  }
  
  return NextResponse.next();
}

// Rate limiting için IP bazlı kontrol
export function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  
  // Şüpheli bot trafiğini engelle
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    );
  }
  
  return NextResponse.next();
}

import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const hostname = request.headers.get("host") || "";
  
  // Hostname'den subdomain'i çıkar
  const subdomain = hostname.split('.')[0];
  const baseDomain = hostname.split('.').slice(1).join('.');
  
  // Ana domain kontrolü
  if (hostname === "guzellestir.com" || hostname === "www.guzellestir.com") {
    return context.next();
  }
  
  // Admin subdomain kontrolü
  if (hostname === "admin.guzellestir.com") {
    return context.next();
  }
  
  // API subdomain kontrolü
  if (hostname === "api.guzellestir.com") {
    return context.next();
  }
  
  // Geçerli subdomain formatı kontrolü
  if (!subdomain || subdomain.length < 3 || subdomain.length > 20) {
    return new Response("Geçersiz subdomain", { status: 400 });
  }
  
  // Rezerve kelimeler kontrolü
  const reservedWords = ['www', 'mail', 'ftp', 'support', 'help', 'docs', 'blog', 'shop', 'store'];
  if (reservedWords.includes(subdomain.toLowerCase())) {
    return new Response("Bu subdomain rezerve edilmiş", { status: 403 });
  }
  
  // Subdomain'in veritabanında olup olmadığını kontrol et
  try {
    const subdomainResponse = await fetch(`${process.env.API_BASE_URL || 'https://api.guzellestir.com'}/api/subdomains/validate/${subdomain}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Netlify-Edge-Function'
      }
    });
    
    if (!subdomainResponse.ok) {
      return new Response("Subdomain bulunamadı", { status: 404 });
    }
    
    const subdomainData = await subdomainResponse.json();
    
    if (!subdomainData.exists || !subdomainData.active) {
      return new Response("Bu subdomain aktif değil", { status: 403 });
    }
    
    // Subdomain verilerini context'e ekle
    context.cookies.set('restaurant_id', subdomainData.restaurantId);
    context.cookies.set('restaurant_name', subdomainData.restaurantName);
    context.cookies.set('subdomain', subdomain);
    
    // Restoran sayfasına yönlendir
    const restaurantUrl = new URL('/restaurant', request.url);
    restaurantUrl.searchParams.set('subdomain', subdomain);
    restaurantUrl.searchParams.set('restaurant_id', subdomainData.restaurantId);
    
    // Eğer root path ise restaurant sayfasına yönlendir
    if (url.pathname === "/" || url.pathname === "") {
      return Response.redirect(restaurantUrl, 302);
    }
    
    // Diğer path'ler için context'i güncelle
    return context.next();
    
  } catch (error) {
    console.error('Subdomain validation error:', error);
    return new Response("Subdomain doğrulama hatası", { status: 500 });
  }
};

export const config = {
  path: "/*"
};

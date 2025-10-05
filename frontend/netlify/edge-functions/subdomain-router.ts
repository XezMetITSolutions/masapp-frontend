import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const hostname = request.headers.get("host") || "";
  
  // Ana domain kontrolü
  if (hostname === "guzellestir.com" || hostname === "www.guzellestir.com") {
    // Ana domain'den gelen istekler - normal sayfa yönlendirme
    return context.next();
  }
  
  // Subdomain kontrolü (örn: restoran-adi.guzellestir.com)
  const subdomainMatch = hostname.match(/^(.+)\.guzellestir\.com$/);
  
  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    
    // Admin subdomain'i hariç tut (artık yok ama güvenlik için)
    if (subdomain === "admin") {
      return context.next();
    }
    
    // Subdomain validasyonu - gerçek uygulamada API'den kontrol edilecek
    const validSubdomains = [
      "lezzet-duragi",
      "cafe-corner", 
      "bistro-34",
      "demo",
      "example",
      "test"
    ];
    
    // Geçerli subdomain kontrolü
    if (!validSubdomains.includes(subdomain)) {
      // Geçersiz subdomain için 404 sayfası
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Restoran Bulunamadı</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #e74c3c; }
            .home-link { color: #3498db; text-decoration: none; }
          </style>
        </head>
        <body>
          <h1 class="error">Restoran Bulunamadı</h1>
          <p>${subdomain}.guzellestir.com adresinde bir restoran bulunamadı.</p>
          <a href="https://guzellestir.com" class="home-link">Ana Sayfaya Dön</a>
        </body>
        </html>`,
        {
          status: 404,
          headers: { "Content-Type": "text/html" }
        }
      );
    }
    
    // Subdomain için restoran menü sayfasına yönlendir
    // URL'deki path'i koruyarak restoran sayfasına yönlendir
    const restaurantUrl = new URL(url.pathname, request.url);
    restaurantUrl.hostname = "guzellestir.com";
    restaurantUrl.pathname = `/restaurant/${subdomain}${url.pathname}`;
    
    return Response.redirect(restaurantUrl.toString(), 302);
  }
  
  // Diğer durumlar için normal işlem
  return context.next();
};

export const config = {
  path: "/*"
};
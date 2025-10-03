import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const hostname = request.headers.get("host") || "";
  
  // Admin subdomain kontrolü
  if (hostname === "admin.guzellestir.com") {
    // Admin subdomain'inden gelen istekler
    if (url.pathname === "/" || url.pathname === "") {
      return Response.redirect(new URL("/admin/login", request.url), 302);
    }
    
    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      return Response.redirect(new URL("/admin/login", request.url), 302);
    }
    
    // Diğer admin sayfaları için normal response
    return context.next();
  }
  
  // Ana domain'den admin erişimini engelle
  if (hostname === "guzellestir.com" && url.pathname.startsWith("/admin")) {
    return Response.redirect(
      new URL(`https://admin.guzellestir.com${url.pathname}`, request.url),
      301
    );
  }
  
  return context.next();
};

export const config = {
  path: "/*"
};

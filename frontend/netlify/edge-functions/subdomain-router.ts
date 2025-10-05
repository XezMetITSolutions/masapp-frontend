import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const hostname = request.headers.get("host") || "";
  const mainDomain = "guzellestir.com";

  // Ana domain kontrolü
  if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
    return context.next();
  }

  // Subdomain kontrolü
  const subdomainMatch = hostname.match(new RegExp(`^(.+)\\.${mainDomain.replace('.', '\\\\.')}$`));

  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];

    // Admin subdomain'i hariç tut
    if (subdomain === "admin") {
      return context.next();
    }

    // Geçerli subdomain listesi
    const validSubdomains = [
      "lezzet-duragi",
      "cafe-corner",
      "bistro-34",
      "demo",
      "example",
      "test",
      "pizzapalace",
      "burgerking",
      "sushimaster",
      "coffeecorner",
      "steakhouse",
      "kardesler"
    ];

    // Geçerli subdomain kontrolü
    if (!validSubdomains.includes(subdomain.toLowerCase())) {
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
          <p>${subdomain}.${mainDomain} adresinde bir restoran bulunamadı.</p>
          <a href="https://${mainDomain}" class="home-link">Ana Sayfaya Dön</a>
        </body>
        </html>`,
        {
          status: 404,
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // Redirect kullanarak yönlendirme yap (rewrite yerine)
    // /admin path'i için işletme admin paneline yönlendir
    if (url.pathname.startsWith('/admin')) {
      const redirectUrl = `https://${mainDomain}/restaurant-admin?subdomain=${subdomain}`;
      return Response.redirect(redirectUrl, 302);
    } else {
      // Modern menü sayfasına yönlendir
      const redirectUrl = `https://${mainDomain}/menu${url.pathname}`;
      return Response.redirect(redirectUrl, 302);
    }
  }

  return context.next();
};

export const config = {
  path: "/*"
};
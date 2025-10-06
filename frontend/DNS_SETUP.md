# DNS Ayarları - Subdomain Routing

## Netlify'da Wildcard Subdomain Kurulumu

### 1. Domain Ayarları

Netlify dashboard'da:
1. **Site Settings** → **Domain management**
2. **Add custom domain**: `masapp.com`
3. **Add domain alias**: `*.masapp.com` (wildcard)

### 2. DNS Kayıtları (Domain Provider'da)

Domain sağlayıcınızda (GoDaddy, Namecheap, vs.) şu kayıtları ekleyin:

```
Type    Name    Value                          TTL
A       @       75.2.60.5                      3600
A       *       75.2.60.5                      3600
CNAME   www     guzellestir.netlify.app        3600
CNAME   *       guzellestir.netlify.app        3600
```

### 3. Netlify Redirect Kuralları

`netlify.toml` dosyasında:

```toml
# Wildcard subdomain routing
[[redirects]]
  from = "https://*.masapp.com/*"
  to = "https://guzellestir.com/:splat"
  status = 200
  force = true
  headers = {X-Subdomain = ":subdomain"}
```

### 4. Test URL'leri

Kurulum tamamlandıktan sonra test edin:

```
https://lezzet.masapp.com/mutfak
https://pizza.masapp.com/garson
https://cafe.masapp.com/kasa
```

### 5. Propagation Süresi

- DNS değişiklikleri **2-48 saat** sürebilir
- `nslookup lezzet.masapp.com` ile kontrol edin
- Online DNS checker araçları kullanın

### 6. SSL Sertifikası

Netlify otomatik olarak Let's Encrypt SSL sertifikası oluşturacak:
- Ana domain: `masapp.com`
- Wildcard: `*.masapp.com`

### 7. Alternatif Çözüm (Geçici)

DNS ayarları tamamlanana kadar:

```javascript
// middleware.ts'de geçici çözüm
const hostname = request.headers.get('host') || '';
if (hostname.includes('guzellestir.com')) {
  // URL'den subdomain bilgisini al
  const url = new URL(request.url);
  const subdomain = url.searchParams.get('subdomain');
  
  if (subdomain) {
    // Subdomain routing mantığını uygula
  }
}
```

Test URL'leri:
```
https://guzellestir.com/mutfak?subdomain=lezzet
https://guzellestir.com/garson?subdomain=pizza
```

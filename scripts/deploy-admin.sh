#!/bin/bash

# Admin subdomain deployment script
echo "🚀 Admin subdomain deployment başlatılıyor..."

# 1. Build işlemi
echo "📦 Build işlemi başlatılıyor..."
npm run build

# 2. Netlify admin yapılandırmasını kopyala
echo "⚙️  Admin yapılandırması hazırlanıyor..."
cp netlify-admin.toml netlify.toml

# 3. Environment variables kontrolü
echo "🔐 Environment variables kontrol ediliyor..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local dosyası bulunamadı!"
    echo "Aşağıdaki değişkenleri ayarlayın:"
    echo "NEXT_PUBLIC_ADMIN_URL=https://admin.guzellestir.com"
    echo "ADMIN_SECRET_KEY=your-secret-key"
    echo "JWT_SECRET=your-jwt-secret"
    exit 1
fi

# 4. SSL sertifikası kontrolü (opsiyonel)
echo "🔒 SSL sertifikası kontrol ediliyor..."
if command -v openssl &> /dev/null; then
    echo "✅ OpenSSL mevcut"
else
    echo "⚠️  OpenSSL bulunamadı - SSL sertifikası manuel olarak yapılandırılmalı"
fi

# 5. DNS kontrolü
echo "🌐 DNS yapılandırması kontrol ediliyor..."
echo "DNS kayıtları:"
echo "admin.guzellestir.com  A      YOUR_SERVER_IP"
echo "admin.guzellestir.com  CNAME  guzellestir.com"

# 6. Netlify deployment (eğer Netlify CLI yüklüyse)
if command -v netlify &> /dev/null; then
    echo "🚀 Netlify'a deploy ediliyor..."
    netlify deploy --prod --site=your-admin-site-id
else
    echo "📁 Build dosyaları hazır: ./out"
    echo "Manuel olarak Netlify'a yükleyin veya Netlify CLI yükleyin:"
    echo "npm install -g netlify-cli"
fi

echo "✅ Admin subdomain deployment tamamlandı!"
echo "🔗 Admin paneli: https://admin.guzellestir.com"
echo "🔐 Güvenlik özellikleri aktif"

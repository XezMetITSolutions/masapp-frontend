import { NextRequest, NextResponse } from 'next/server';

// Bu veritabanından kontrol edilecek - şimdilik mock data
const existingSubdomains = [
  'demo',
  'test',
  'admin',
  'api',
  'www',
  'mail',
  'ftp',
  'support',
  'help',
  'docs'
];

export async function POST(request: NextRequest) {
  try {
    const { subdomain } = await request.json();

    if (!subdomain) {
      return NextResponse.json({ 
        success: false, 
        message: 'Subdomain gerekli' 
      });
    }

    // Subdomain format kontrolü
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json({ 
        success: false, 
        available: false,
        message: 'Subdomain sadece küçük harf, rakam ve tire içerebilir' 
      });
    }

    // Minimum uzunluk kontrolü
    if (subdomain.length < 3) {
      return NextResponse.json({ 
        success: false, 
        available: false,
        message: 'Subdomain en az 3 karakter olmalı' 
      });
    }

    // Maksimum uzunluk kontrolü
    if (subdomain.length > 20) {
      return NextResponse.json({ 
        success: false, 
        available: false,
        message: 'Subdomain en fazla 20 karakter olabilir' 
      });
    }

    // Rezerve kelimeler kontrolü
    const reservedWords = [
      'admin', 'api', 'www', 'mail', 'ftp', 'support', 'help', 'docs',
      'blog', 'shop', 'store', 'app', 'mobile', 'web', 'dev', 'test',
      'staging', 'prod', 'production', 'demo', 'example', 'sample'
    ];

    if (reservedWords.includes(subdomain.toLowerCase())) {
      return NextResponse.json({ 
        success: false, 
        available: false,
        message: 'Bu subdomain rezerve edilmiş' 
      });
    }

    // Mevcut subdomain kontrolü
    const isAvailable = !existingSubdomains.includes(subdomain.toLowerCase());

    return NextResponse.json({ 
      success: true, 
      available: isAvailable,
      message: isAvailable ? 'Subdomain kullanılabilir' : 'Bu subdomain zaten kullanılıyor'
    });

  } catch (error) {
    console.error('Subdomain check error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Subdomain kontrol edilemedi' 
    }, { status: 500 });
  }
}


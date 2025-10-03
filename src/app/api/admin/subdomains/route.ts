import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Super admin yetkisi kontrolü
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Token bulunamadı' }, { status: 401 });
    }

    const payload = verifyToken(accessToken);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    // Demo subdomain listesi - gerçek uygulamada veritabanından çekilecek
    const subdomains = [
      {
        id: 'sub-1',
        subdomain: 'kardesler',
        restaurantName: 'Kardeşler Restoran',
        restaurantId: 'rest-1',
        status: 'active',
        plan: 'premium',
        ownerName: 'Ahmet Yılmaz',
        ownerEmail: 'info@kardesler.com',
        createdAt: '2024-03-15T08:00:00Z',
        lastActivity: '2024-03-15T10:30:00Z',
        dnsStatus: 'active',
        totalVisits: 1250,
        monthlyRevenue: 45000
      },
      {
        id: 'sub-2',
        subdomain: 'pizza-palace',
        restaurantName: 'Pizza Palace',
        restaurantId: 'rest-2',
        status: 'pending',
        plan: 'basic',
        ownerName: 'Ayşe Demir',
        ownerEmail: 'info@pizzapalace.com',
        createdAt: '2024-03-20T10:30:00Z',
        lastActivity: '2024-03-20T10:30:00Z',
        dnsStatus: 'pending',
        totalVisits: 0,
        monthlyRevenue: 0
      },
      {
        id: 'sub-3',
        subdomain: 'sushi-master',
        restaurantName: 'Sushi Master',
        restaurantId: 'rest-3',
        status: 'active',
        plan: 'pro',
        ownerName: 'Mehmet Kaya',
        ownerEmail: 'info@sushimaster.com',
        createdAt: '2024-03-10T14:30:00Z',
        lastActivity: '2024-03-15T09:15:00Z',
        dnsStatus: 'active',
        totalVisits: 890,
        monthlyRevenue: 32000
      }
    ];

    return NextResponse.json({
      success: true,
      data: subdomains,
      total: subdomains.length
    });

  } catch (error) {
    console.error('Subdomains list error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Super admin yetkisi kontrolü
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Token bulunamadı' }, { status: 401 });
    }

    const payload = verifyToken(accessToken);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const subdomainData = await request.json();

    // Validasyon
    if (!subdomainData.subdomain || !subdomainData.restaurantName || !subdomainData.ownerEmail) {
      return NextResponse.json({ 
        error: 'Gerekli alanlar eksik' 
      }, { status: 400 });
    }

    // Subdomain format kontrolü
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomainData.subdomain)) {
      return NextResponse.json({ 
        error: 'Geçersiz subdomain formatı' 
      }, { status: 400 });
    }

    // Rezerve kelimeler kontrolü
    const reservedWords = ['admin', 'api', 'www', 'mail', 'ftp', 'support', 'help', 'docs'];
    if (reservedWords.includes(subdomainData.subdomain.toLowerCase())) {
      return NextResponse.json({ 
        error: 'Bu subdomain rezerve edilmiş' 
      }, { status: 400 });
    }

    // Yeni subdomain oluştur
    const newSubdomain = {
      id: `sub-${Date.now()}`,
      subdomain: subdomainData.subdomain,
      restaurantName: subdomainData.restaurantName,
      restaurantId: `rest-${Date.now()}`,
      status: 'pending',
      plan: subdomainData.plan || 'basic',
      ownerName: subdomainData.ownerName,
      ownerEmail: subdomainData.ownerEmail,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      dnsStatus: 'pending',
      totalVisits: 0,
      monthlyRevenue: 0
    };

    // Demo: Subdomain oluşturma başarılı
    console.log('Yeni subdomain oluşturuldu:', newSubdomain);

    return NextResponse.json({
      success: true,
      message: 'Subdomain başarıyla oluşturuldu',
      data: newSubdomain
    });

  } catch (error) {
    console.error('Subdomain creation error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

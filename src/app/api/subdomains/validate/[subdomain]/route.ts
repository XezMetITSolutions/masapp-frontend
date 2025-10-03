import { NextRequest, NextResponse } from 'next/server';

// Demo subdomain veritabanı - gerçek uygulamada veritabanından çekilecek
const subdomains = [
  {
    subdomain: 'kardesler',
    restaurantId: 'rest-1',
    restaurantName: 'Kardeşler Restoran',
    active: true,
    createdAt: '2024-03-15T08:00:00Z',
    plan: 'premium',
    ownerEmail: 'info@kardesler.com'
  },
  {
    subdomain: 'pizza-palace',
    restaurantId: 'rest-2',
    restaurantName: 'Pizza Palace',
    active: false,
    createdAt: '2024-03-20T10:30:00Z',
    plan: 'basic',
    ownerEmail: 'info@pizzapalace.com'
  },
  {
    subdomain: 'sushi-master',
    restaurantId: 'rest-3',
    restaurantName: 'Sushi Master',
    active: true,
    createdAt: '2024-03-10T14:30:00Z',
    plan: 'pro',
    ownerEmail: 'info@sushimaster.com'
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    const { subdomain } = params;

    if (!subdomain) {
      return NextResponse.json({ 
        exists: false,
        message: 'Subdomain gerekli' 
      }, { status: 400 });
    }

    // Subdomain format kontrolü
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json({ 
        exists: false,
        message: 'Geçersiz subdomain formatı' 
      }, { status: 400 });
    }

    // Subdomain'i bul
    const subdomainData = subdomains.find(s => s.subdomain === subdomain);

    if (!subdomainData) {
      return NextResponse.json({ 
        exists: false,
        message: 'Subdomain bulunamadı' 
      }, { status: 404 });
    }

    return NextResponse.json({
      exists: true,
      active: subdomainData.active,
      subdomain: subdomainData.subdomain,
      restaurantId: subdomainData.restaurantId,
      restaurantName: subdomainData.restaurantName,
      plan: subdomainData.plan,
      createdAt: subdomainData.createdAt,
      ownerEmail: subdomainData.ownerEmail
    });

  } catch (error) {
    console.error('Subdomain validation error:', error);
    return NextResponse.json({ 
      exists: false,
      message: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

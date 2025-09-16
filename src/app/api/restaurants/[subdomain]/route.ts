import { NextRequest, NextResponse } from 'next/server';

// Mock restaurant data - gerçek uygulamada veritabanından gelecek
const mockRestaurants = [
  {
    id: '1',
    name: 'Lezzet Durağı',
    subdomain: 'lezzet-duragi',
    description: 'Geleneksel Türk mutfağının en lezzetli örneklerini sunuyoruz.',
    cuisine: 'Türk Mutfağı',
    address: 'Atatürk Caddesi No:123',
    city: 'İstanbul',
    phone: '+90 212 555 0123',
    website: 'https://lezzetduragi.com',
    instagram: 'lezzetduragi',
    facebook: 'lezzetduragi',
    openingTime: '09:00',
    closingTime: '22:00',
    status: 'active'
  },
  {
    id: '2',
    name: 'Pizza Palace',
    subdomain: 'pizza-palace',
    description: 'İtalyan mutfağının en güzel örnekleri burada.',
    cuisine: 'İtalyan',
    address: 'Cumhuriyet Caddesi No:456',
    city: 'Ankara',
    phone: '+90 312 555 0456',
    website: 'https://pizzapalace.com',
    instagram: 'pizzapalace',
    facebook: 'pizzapalace',
    openingTime: '10:00',
    closingTime: '23:00',
    status: 'active'
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
        success: false, 
        message: 'Subdomain gerekli' 
      }, { status: 400 });
    }

    // Restoranı bul
    const restaurant = mockRestaurants.find(r => r.subdomain === subdomain);

    if (!restaurant) {
      return NextResponse.json({ 
        success: false, 
        message: 'Restoran bulunamadı' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      restaurant 
    });

  } catch (error) {
    console.error('Restaurant fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Restoran bilgileri alınamadı' 
    }, { status: 500 });
  }
}


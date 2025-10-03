import { NextRequest, NextResponse } from 'next/server';
import { subdomainManager, SubdomainConfig } from '@/lib/subdomain-manager';

export async function POST(request: NextRequest) {
  try {
    const restaurantData = await request.json();

    // Validasyon
    if (!restaurantData.name || !restaurantData.subdomain || !restaurantData.ownerEmail) {
      return NextResponse.json({ 
        success: false, 
        message: 'Gerekli alanlar eksik' 
      });
    }

    // Subdomain kontrolü
    const existingSubdomains = ['demo', 'test', 'admin', 'api', 'www'];
    if (existingSubdomains.includes(restaurantData.subdomain.toLowerCase())) {
      return NextResponse.json({ 
        success: false, 
        message: 'Bu subdomain zaten kullanılıyor' 
      });
    }

    // Subdomain kurulum konfigürasyonu
    const subdomainConfig: SubdomainConfig = {
      subdomain: restaurantData.subdomain,
      restaurantId: Date.now().toString(),
      restaurantName: restaurantData.name,
      ownerEmail: restaurantData.ownerEmail,
      plan: restaurantData.plan || 'basic',
      status: 'pending'
    };

    // Otomatik subdomain ve FTP kurulumu
    console.log('Subdomain kurulumu başlatılıyor:', subdomainConfig.subdomain);
    const setupResult = await subdomainManager.createSubdomain(subdomainConfig);

    if (!setupResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: `Subdomain kurulumu başarısız: ${setupResult.error}` 
      });
    }

    // Restoran verilerini hazırla
    const restaurant = {
      id: subdomainConfig.restaurantId,
      ...restaurantData,
      createdAt: new Date().toISOString(),
      subdomainUrl: setupResult.subdomainUrl,
      status: setupResult.dnsStatus === 'active' ? 'active' : 'pending',
      ftpConfig: setupResult.ftpConfig
    };

    // Veritabanına kaydetme (gerçek implementasyonda)
    console.log('Restaurant created:', restaurant);

    return NextResponse.json({ 
      success: true, 
      message: 'Restoran ve subdomain başarıyla oluşturuldu',
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        subdomain: restaurant.subdomain,
        subdomainUrl: restaurant.subdomainUrl,
        status: restaurant.status,
        ftpConfig: restaurant.ftpConfig
      },
      setupDetails: {
        dnsStatus: setupResult.dnsStatus,
        ftpCreated: !!setupResult.ftpConfig,
        panelCreated: true
      }
    });

  } catch (error) {
    console.error('Restaurant creation error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Restoran oluşturulurken hata oluştu' 
    }, { status: 500 });
  }
}

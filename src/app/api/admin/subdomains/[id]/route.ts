import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Demo subdomain detayları - gerçek uygulamada veritabanından çekilecek
    const subdomainDetails = {
      id: id,
      subdomain: 'kardesler',
      restaurantName: 'Kardeşler Restoran',
      restaurantId: 'rest-1',
      status: 'active',
      plan: 'premium',
      ownerName: 'Ahmet Yılmaz',
      ownerEmail: 'info@kardesler.com',
      ownerPhone: '+90 555 123 4567',
      address: 'Kadıköy, İstanbul',
      createdAt: '2024-03-15T08:00:00Z',
      lastActivity: '2024-03-15T10:30:00Z',
      dnsStatus: 'active',
      totalVisits: 1250,
      monthlyRevenue: 45000,
      subdomainUrl: 'https://kardesler.guzellestir.com',
      analytics: {
        dailyVisits: 45,
        weeklyVisits: 315,
        monthlyVisits: 1250,
        averageSessionDuration: '3:24',
        bounceRate: 25.5
      },
      settings: {
        customDomain: false,
        sslEnabled: true,
        cdnEnabled: true,
        backupEnabled: true
      }
    };

    return NextResponse.json({
      success: true,
      data: subdomainDetails
    });

  } catch (error) {
    console.error('Subdomain details error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const updateData = await request.json();

    // Demo: Subdomain güncelleme başarılı
    console.log(`Subdomain ${id} güncelleniyor:`, updateData);

    const updatedSubdomain = {
      id: id,
      ...updateData,
      updatedAt: new Date().toISOString(),
      updatedBy: payload.email
    };

    return NextResponse.json({
      success: true,
      message: 'Subdomain başarıyla güncellendi',
      data: updatedSubdomain
    });

  } catch (error) {
    console.error('Subdomain update error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Demo: Subdomain silme başarılı
    console.log(`Subdomain ${id} siliniyor`);

    return NextResponse.json({
      success: true,
      message: 'Subdomain başarıyla silindi'
    });

  } catch (error) {
    console.error('Subdomain deletion error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { dnsManager } from '@/lib/dns-manager';

export async function POST(
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
    const { action, provider = 'cloudflare', targetIp = '104.21.0.0' } = await request.json();

    if (!action) {
      return NextResponse.json({ 
        error: 'Aksiyon belirtilmelidir' 
      }, { status: 400 });
    }

    // Subdomain bilgilerini al (demo)
    const subdomainData = {
      id: id,
      subdomain: 'kardesler',
      restaurantName: 'Kardeşler Restoran'
    };

    let result;

    switch (action) {
      case 'create':
        result = await dnsManager.createSubdomainRecord(
          subdomainData.subdomain,
          targetIp,
          provider
        );
        break;

      case 'delete':
        const { recordId } = await request.json();
        if (!recordId) {
          return NextResponse.json({ 
            error: 'Record ID gerekli' 
          }, { status: 400 });
        }
        result = await dnsManager.deleteDNSRecord(recordId, provider);
        break;

      case 'check':
        result = await dnsManager.checkDNSPropagation(subdomainData.subdomain);
        break;

      default:
        return NextResponse.json({ 
          error: 'Geçersiz aksiyon' 
        }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'DNS işlemi başarılı',
      data: result
    });

  } catch (error) {
    console.error('DNS management error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

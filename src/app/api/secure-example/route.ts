import { NextRequest, NextResponse } from 'next/server';

// Demo güvenli API endpoint örneği
export async function POST(request: NextRequest) {
  try {
    // Demo authentication kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Demo token kontrolü
    if (token !== 'demo-admin-token' && token !== 'demo-access-token') {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Demo input validasyonu
    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Demo başarılı response
    return NextResponse.json({
      success: true,
      message: 'Secure operation completed successfully',
      data: {
        id: Math.random().toString(36).substring(2, 15),
        email: body.email,
        name: body.name,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Secure API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
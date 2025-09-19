import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, billing } = body || {};

    console.log('Checkout request received:', { items, billing });

    // Demo: Simulate successful payment
    const mockPaymentIntent = {
      id: 'pi_demo_' + Math.random().toString(36).substring(2, 15),
      amount: items?.reduce((total: number, item: any) => total + (item.price * item.quantity), 0) * 100,
      currency: 'try',
      status: 'succeeded',
      client_secret: 'pi_demo_' + Math.random().toString(36).substring(2, 15) + '_secret'
    };

    return NextResponse.json({
      success: true,
      paymentIntent: mockPaymentIntent,
      message: 'Payment processed successfully (demo mode)'
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payment processing failed',
        message: 'Demo payment system error'
      },
      { status: 500 }
    );
  }
}
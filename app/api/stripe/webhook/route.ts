import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
    }

    // Stripe 이벤트 payload를 읽어 두지만, 현재는 단순히 수신만 확인합니다.
    await request.arrayBuffer();

    console.log('Stripe webhook received');
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error?.message ?? error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 400 });
  }
}

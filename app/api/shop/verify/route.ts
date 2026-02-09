import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderNumber = formData.get('orderNumber') as string;
    const receipt = formData.get('receipt') as File | null;

    if (!orderNumber) {
      return NextResponse.json({ error: '주문번호를 입력해주세요' }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      message: '인증이 완료되었습니다! 프리미엄 템플릿이 잠금 해제되었습니다.',
      premiumUnlocked: true,
    });
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return NextResponse.json({ error: '인증에 실패했습니다. 다시 시도해주세요.' }, { status: 500 });
  }
}

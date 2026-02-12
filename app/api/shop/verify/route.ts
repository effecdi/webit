import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { purchaseVerifications } from '@/db/schema';
import { eq, and, inArray, desc } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;

  try {
    const formData = await request.formData();
    const orderNumber = formData.get('orderNumber') as string;

    if (!orderNumber?.trim()) {
      return NextResponse.json({ error: '주문번호를 입력해주세요' }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(purchaseVerifications)
      .where(and(
        eq(purchaseVerifications.userId, auth.userId),
        inArray(purchaseVerifications.status, ['pending', 'approved'])
      ))
      .limit(1);

    if (existing.length > 0) {
      const status = existing[0].status;
      if (status === 'approved') {
        return NextResponse.json({ error: '이미 인증이 완료되었습니다.' }, { status: 400 });
      }
      return NextResponse.json({ error: '이미 인증 요청이 접수되었습니다. 관리자 승인을 기다려주세요.' }, { status: 400 });
    }

    await db.insert(purchaseVerifications).values({
      userId: auth.userId,
      orderNumber: orderNumber.trim(),
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: '인증 요청이 접수되었습니다. 관리자 확인 후 승인됩니다.',
      status: 'pending',
    });
  } catch (error) {
    console.error('Error submitting verification:', error);
    return NextResponse.json({ error: '인증 요청에 실패했습니다.' }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;

  try {
    const records = await db
      .select()
      .from(purchaseVerifications)
      .where(eq(purchaseVerifications.userId, auth.userId))
      .orderBy(desc(purchaseVerifications.createdAt));

    const approved = records.some(r => r.status === 'approved');
    const pending = records.some(r => r.status === 'pending');
    const rejected = records.filter(r => r.status === 'rejected');

    return NextResponse.json({
      premiumUnlocked: approved,
      hasPending: pending,
      rejectedNote: rejected.length > 0 ? rejected[rejected.length - 1].adminNote : null,
    });
  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json({ error: '상태 확인에 실패했습니다.' }, { status: 500 });
  }
}

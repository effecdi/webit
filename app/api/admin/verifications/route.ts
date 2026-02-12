import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { purchaseVerifications, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

const ADMIN_IDS = process.env.ADMIN_USER_IDS?.split(',').map(s => s.trim()) || [];

async function requireAdmin() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  if (!ADMIN_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  }
  return auth;
}

function isError(result: { userId: string } | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}

export async function GET() {
  const auth = await requireAdmin();
  if (isError(auth)) return auth;

  try {
    const verifications = await db
      .select({
        id: purchaseVerifications.id,
        userId: purchaseVerifications.userId,
        orderNumber: purchaseVerifications.orderNumber,
        receiptUrl: purchaseVerifications.receiptUrl,
        status: purchaseVerifications.status,
        adminNote: purchaseVerifications.adminNote,
        reviewedAt: purchaseVerifications.reviewedAt,
        createdAt: purchaseVerifications.createdAt,
        userEmail: users.email,
        userFirstName: users.firstName,
        userLastName: users.lastName,
      })
      .from(purchaseVerifications)
      .leftJoin(users, eq(purchaseVerifications.userId, users.id))
      .orderBy(desc(purchaseVerifications.createdAt));

    return NextResponse.json({ verifications });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json({ error: '목록 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (isError(auth)) return auth;

  try {
    const body = await request.json();
    const { id, status, adminNote } = body;

    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(purchaseVerifications)
      .where(eq(purchaseVerifications.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: '해당 인증 요청을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (existing.status !== 'pending') {
      return NextResponse.json({ error: '이미 처리된 요청입니다.' }, { status: 400 });
    }

    await db
      .update(purchaseVerifications)
      .set({
        status,
        adminNote: adminNote || null,
        reviewedAt: new Date(),
      })
      .where(eq(purchaseVerifications.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating verification:', error);
    return NextResponse.json({ error: '처리에 실패했습니다.' }, { status: 500 });
  }
}

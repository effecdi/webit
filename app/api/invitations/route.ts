import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invitations } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getCoupleUserIds } from '@/lib/couple-utils';
import crypto from 'crypto';

const FREE_INVITATION_LIMIT = 2;

function generateShareId(): string {
  return crypto.randomBytes(8).toString('hex');
}

export async function GET() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const coupleUserIds = await getCoupleUserIds(userId);

  try {
    const result = await db.select().from(invitations)
      .where(inArray(invitations.userId, coupleUserIds))
      .orderBy(desc(invitations.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const coupleUserIds = await getCoupleUserIds(userId);

    const existing = await db.select().from(invitations)
      .where(inArray(invitations.userId, coupleUserIds));

    if (existing.length >= FREE_INVITATION_LIMIT) {
      return NextResponse.json(
        { error: 'LIMIT_REACHED', message: '무료 청첩장 개수를 초과했습니다. 추가 청첩장을 만들려면 결제가 필요합니다.' },
        { status: 403 }
      );
    }

    const { templateId, title, invitationData } = body;

    const [created] = await db.insert(invitations).values({
      userId,
      templateId: templateId || 'modern',
      title: title || null,
      shareId: generateShareId(),
      invitationData: invitationData || null,
    }).returning();

    return NextResponse.json(created);
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
  }
}

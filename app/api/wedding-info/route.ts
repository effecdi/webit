import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { weddingInfo } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getCoupleUserIds } from '@/lib/couple-utils';

export async function GET() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const coupleUserIds = await getCoupleUserIds(userId);

  try {
    const result = await db.select().from(weddingInfo).where(inArray(weddingInfo.userId, coupleUserIds));
    if (result.length > 0) {
      return NextResponse.json(result[0]);
    }
    return NextResponse.json(null);
  } catch (error) {
    console.error('Error fetching wedding info:', error);
    return NextResponse.json(null, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const coupleUserIds = await getCoupleUserIds(userId);
    const { weddingDate, weddingTime, venue, expectedGuests, groomGuests, brideGuests, mealCostAdult, mealCostChild } = body;

    const existing = await db.select().from(weddingInfo).where(inArray(weddingInfo.userId, coupleUserIds));
    
    if (existing.length > 0) {
      const [updated] = await db.update(weddingInfo)
        .set({ weddingDate, weddingTime, venue, expectedGuests, groomGuests, brideGuests, mealCostAdult, mealCostChild })
        .where(eq(weddingInfo.id, existing[0].id))
        .returning();
      return NextResponse.json(updated);
    }

    const [newInfo] = await db.insert(weddingInfo).values({
      userId, weddingDate, weddingTime, venue, expectedGuests, groomGuests, brideGuests, mealCostAdult, mealCostChild
    }).returning();

    return NextResponse.json(newInfo);
  } catch (error) {
    console.error('Error saving wedding info:', error);
    return NextResponse.json({ error: 'Failed to save wedding info' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const coupleUserIds = await getCoupleUserIds(userId);
    const { userId: _uid, incrementInvitationCount, ...updates } = body;

    const existing = await db.select().from(weddingInfo).where(inArray(weddingInfo.userId, coupleUserIds));

    if (existing.length === 0) {
      const initialValues: any = { userId, ...updates };
      if (incrementInvitationCount) {
        initialValues.invitationCount = incrementInvitationCount;
      }
      const [created] = await db.insert(weddingInfo).values(initialValues).returning();
      return NextResponse.json(created);
    }

    if (incrementInvitationCount) {
      const currentCount = existing[0].invitationCount || 0;
      updates.invitationCount = currentCount + incrementInvitationCount;
    }

    const [updated] = await db.update(weddingInfo)
      .set(updates)
      .where(eq(weddingInfo.id, existing[0].id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating wedding info:', error);
    return NextResponse.json({ error: 'Failed to update wedding info' }, { status: 500 });
  }
}

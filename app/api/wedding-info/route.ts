import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { weddingInfo } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

export async function GET() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;

  try {
    const result = await db.select().from(weddingInfo).where(eq(weddingInfo.userId, userId));
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
    const { weddingDate, weddingTime, venue, expectedGuests, groomGuests, brideGuests, mealCostAdult, mealCostChild } = body;

    const existing = await db.select().from(weddingInfo).where(eq(weddingInfo.userId, userId));
    
    if (existing.length > 0) {
      const [updated] = await db.update(weddingInfo)
        .set({ weddingDate, weddingTime, venue, expectedGuests, groomGuests, brideGuests, mealCostAdult, mealCostChild })
        .where(eq(weddingInfo.userId, userId))
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
    const { userId: _uid, ...updates } = body;

    const existing = await db.select().from(weddingInfo).where(eq(weddingInfo.userId, userId));

    if (existing.length === 0) {
      const [created] = await db.insert(weddingInfo).values({ userId, ...updates }).returning();
      return NextResponse.json(created);
    }

    const [updated] = await db.update(weddingInfo)
      .set(updates)
      .where(eq(weddingInfo.userId, userId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating wedding info:', error);
    return NextResponse.json({ error: 'Failed to update wedding info' }, { status: 500 });
  }
}

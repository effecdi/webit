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
    const result = await db.select().from(weddingInfo)
      .where(eq(weddingInfo.userId, userId))
      .limit(1);

    if (result.length === 0 || !result[0].invitationData) {
      return NextResponse.json(null);
    }

    return NextResponse.json(result[0].invitationData);
  } catch (error) {
    console.error('Error fetching invitation data:', error);
    return NextResponse.json(null);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const { invitationData } = body;

    const existing = await db.select().from(weddingInfo)
      .where(eq(weddingInfo.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db.update(weddingInfo)
        .set({ invitationData })
        .where(eq(weddingInfo.userId, userId))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db.insert(weddingInfo).values({
        userId,
        invitationData,
      }).returning();
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error('Error saving invitation data:', error);
    return NextResponse.json({ error: 'Failed to save invitation data' }, { status: 500 });
  }
}

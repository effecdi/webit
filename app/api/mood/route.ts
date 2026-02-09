import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getPartnerId } from '@/lib/couple-utils';

export async function GET() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;

  try {
    const [myProfile] = await db.select({
      myMood: profiles.myMood,
    }).from(profiles).where(eq(profiles.userId, userId));

    const partnerId = await getPartnerId(userId);
    let partnerMood = 'heart';

    if (partnerId) {
      const [partnerProfile] = await db.select({
        myMood: profiles.myMood,
      }).from(profiles).where(eq(profiles.userId, partnerId));
      partnerMood = partnerProfile?.myMood || 'heart';
    }

    return NextResponse.json({
      myMood: myProfile?.myMood || 'heart',
      partnerMood,
    });
  } catch (error) {
    console.error('Error fetching mood:', error);
    return NextResponse.json({ error: 'Failed to fetch mood' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const { mood } = body;

    if (!mood) {
      return NextResponse.json({ error: 'mood is required' }, { status: 400 });
    }

    const existing = await db.select().from(profiles).where(eq(profiles.userId, userId));

    if (existing.length > 0) {
      await db.update(profiles)
        .set({ myMood: mood })
        .where(eq(profiles.userId, userId));
    } else {
      await db.insert(profiles).values({
        userId,
        myMood: mood,
      });
    }

    const partnerId = await getPartnerId(userId);
    let partnerMood = 'heart';
    if (partnerId) {
      const [partnerProfile] = await db.select({
        myMood: profiles.myMood,
      }).from(profiles).where(eq(profiles.userId, partnerId));
      partnerMood = partnerProfile?.myMood || 'heart';
    }

    return NextResponse.json({
      myMood: mood,
      partnerMood,
    });
  } catch (error) {
    console.error('Error updating mood:', error);
    return NextResponse.json({ error: 'Failed to update mood' }, { status: 500 });
  }
}

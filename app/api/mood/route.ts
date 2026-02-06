import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'default';

  try {
    const [profile] = await db.select({
      myMood: profiles.myMood,
      partnerMood: profiles.partnerMood,
    }).from(profiles).where(eq(profiles.userId, userId));

    if (!profile) {
      return NextResponse.json({ myMood: 'heart', partnerMood: 'heart' });
    }

    return NextResponse.json({
      myMood: profile.myMood || 'heart',
      partnerMood: profile.partnerMood || 'heart',
    });
  } catch (error) {
    console.error('Error fetching mood:', error);
    return NextResponse.json({ error: 'Failed to fetch mood' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', role, mood } = body;

    if (!role || !mood) {
      return NextResponse.json({ error: 'role and mood are required' }, { status: 400 });
    }

    const existing = await db.select().from(profiles).where(eq(profiles.userId, userId));

    const updateField = role === 'me' ? { myMood: mood } : { partnerMood: mood };

    if (existing.length > 0) {
      const [updated] = await db.update(profiles)
        .set(updateField)
        .where(eq(profiles.userId, userId))
        .returning({ myMood: profiles.myMood, partnerMood: profiles.partnerMood });
      return NextResponse.json(updated);
    }

    const [newProfile] = await db.insert(profiles).values({
      userId,
      ...updateField,
    }).returning({ myMood: profiles.myMood, partnerMood: profiles.partnerMood });

    return NextResponse.json(newProfile);
  } catch (error) {
    console.error('Error updating mood:', error);
    return NextResponse.json({ error: 'Failed to update mood' }, { status: 500 });
  }
}

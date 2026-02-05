import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'default';

  try {
    const [profile] = await db.select().from(profiles)
      .where(eq(profiles.userId, userId));

    if (!profile) {
      return NextResponse.json({
        userId,
        username: "",
        partnerName: "",
        firstMeetDate: null,
        coupleIntro: "",
        isMembershipActive: false,
        membershipTier: "free",
        currentMode: "love",
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', username, partnerName, firstMeetDate, coupleIntro, currentMode } = body;

    const existing = await db.select().from(profiles)
      .where(eq(profiles.userId, userId));

    if (existing.length > 0) {
      const [updated] = await db.update(profiles)
        .set({ 
          username, 
          partnerName, 
          firstMeetDate: firstMeetDate ? new Date(firstMeetDate) : null, 
          coupleIntro,
          currentMode 
        })
        .where(eq(profiles.userId, userId))
        .returning();
      return NextResponse.json(updated);
    }

    const [newProfile] = await db.insert(profiles).values({
      userId,
      username,
      partnerName,
      firstMeetDate: firstMeetDate ? new Date(firstMeetDate) : null,
      coupleIntro,
      currentMode,
    }).returning();

    return NextResponse.json(newProfile);
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', ...updates } = body;

    if (updates.firstMeetDate) {
      updates.firstMeetDate = new Date(updates.firstMeetDate);
    }

    const [updated] = await db.update(profiles)
      .set(updates)
      .where(eq(profiles.userId, userId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

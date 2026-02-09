import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { travels, travelSchedules } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getCoupleUserIds } from '@/lib/couple-utils';

export async function GET() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const coupleUserIds = await getCoupleUserIds(userId);

  try {
    const result = await db.select().from(travels)
      .where(inArray(travels.userId, coupleUserIds))
      .orderBy(desc(travels.startDate));

    const travelsWithSchedules = await Promise.all(
      result.map(async (travel) => {
        const schedules = await db.select().from(travelSchedules)
          .where(eq(travelSchedules.travelId, travel.id))
          .orderBy(travelSchedules.day, travelSchedules.time);
        return { ...travel, schedules };
      })
    );

    return NextResponse.json(travelsWithSchedules);
  } catch (error) {
    console.error('Error fetching travels:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const { title, destination, startDate, endDate, thumbnail } = body;

    const [newTravel] = await db.insert(travels).values({
      userId,
      title,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      thumbnail,
    }).returning();

    return NextResponse.json({ ...newTravel, schedules: [] });
  } catch (error) {
    console.error('Error creating travel:', error);
    return NextResponse.json({ error: 'Failed to create travel' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await db.delete(travelSchedules).where(eq(travelSchedules.travelId, parseInt(id)));
    await db.delete(travels).where(eq(travels.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting travel:', error);
    return NextResponse.json({ error: 'Failed to delete travel' }, { status: 500 });
  }
}

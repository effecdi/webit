import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { events } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'dating';

  try {
    const result = await db.select().from(events)
      .where(and(eq(events.userId, userId), eq(events.mode, mode)))
      .orderBy(desc(events.date));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const { title, description, date, time, location, category, mode = 'dating' } = body;

    const [newEvent] = await db.insert(events).values({
      userId,
      title,
      description,
      date: new Date(date),
      time,
      location,
      category,
      mode,
    }).returning();

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await db.delete(events).where(eq(events.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { guests } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'default';

  try {
    const result = await db.select().from(guests)
      .where(eq(guests.userId, userId))
      .orderBy(desc(guests.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', name, side, relationship, attendance, invitationSent, mealType, giftAmount, memo, phone } = body;

    const [newGuest] = await db.insert(guests).values({
      userId, name, side, relationship, attendance, invitationSent, mealType, giftAmount, memo, phone
    }).returning();

    return NextResponse.json(newGuest);
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Guest id required' }, { status: 400 });
    }

    const [updated] = await db.update(guests)
      .set(updates)
      .where(eq(guests.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Guest id required' }, { status: 400 });
  }

  try {
    await db.delete(guests).where(eq(guests.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}

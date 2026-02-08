import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { guests, weddingInfo } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, side, attendance, mealType, guestCount, phone, memo } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const allWeddings = await db.select().from(weddingInfo).limit(1);
    if (allWeddings.length === 0) {
      return NextResponse.json({ error: 'No wedding found' }, { status: 404 });
    }

    const ownerUserId = allWeddings[0].userId;
    const count = Math.max(1, Math.min(10, guestCount || 1));

    const memoText = [
      count > 1 ? `총 ${count}명 참석` : null,
      memo || null,
    ].filter(Boolean).join(' / ');

    const [newGuest] = await db.insert(guests).values({
      userId: ownerUserId,
      name: name.trim(),
      side: side || 'groom',
      relationship: '청첩장',
      attendance: attendance || 'confirmed',
      invitationSent: true,
      mealType: mealType || 'adult',
      giftAmount: 0,
      memo: memoText || null,
      phone: phone || null,
    }).returning();

    return NextResponse.json({ success: true, guest: newGuest });
  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
  }
}

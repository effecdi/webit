import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { weddingInfo } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { getCoupleUserIds } from '@/lib/couple-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'default';
  const coupleUserIds = await getCoupleUserIds(userId);

  try {
    const result = await db.select().from(weddingInfo)
      .where(inArray(weddingInfo.userId, coupleUserIds))
      .limit(1);

    if (result.length === 0 || !result[0].invitationData) {
      return NextResponse.json([]);
    }

    const data = result[0].invitationData as Record<string, unknown>;
    return NextResponse.json(data.guestbookEntries || []);
  } catch (error) {
    console.error('Error fetching guestbook:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', entry } = body;
    const coupleUserIds = await getCoupleUserIds(userId);

    const result = await db.select().from(weddingInfo)
      .where(inArray(weddingInfo.userId, coupleUserIds))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: 'No invitation found' }, { status: 404 });
    }

    const currentData = (result[0].invitationData as Record<string, unknown>) || {};
    const entries = Array.isArray(currentData.guestbookEntries) ? currentData.guestbookEntries : [];
    entries.unshift(entry);

    await db.update(weddingInfo)
      .set({
        invitationData: { ...currentData, guestbookEntries: entries },
      })
      .where(eq(weddingInfo.id, result[0].id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving guestbook entry:', error);
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
  }
}

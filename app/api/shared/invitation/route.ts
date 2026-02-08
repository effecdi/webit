import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invitations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get('id');

  if (!shareId) {
    return NextResponse.json({ error: 'Missing share ID' }, { status: 400 });
  }

  try {
    const result = await db.select().from(invitations)
      .where(eq(invitations.shareId, shareId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json(result[0].invitationData);
  } catch (error) {
    console.error('Error fetching shared invitation:', error);
    return NextResponse.json({ error: 'Failed to fetch invitation' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invitations } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getCoupleUserIds } from '@/lib/couple-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const coupleUserIds = await getCoupleUserIds(userId);
  const { id } = await params;

  try {
    const result = await db.select().from(invitations)
      .where(and(eq(invitations.id, parseInt(id)), inArray(invitations.userId, coupleUserIds)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json({ error: 'Failed to fetch invitation' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const coupleUserIds = await getCoupleUserIds(userId);
    const { id } = await params;

    const { invitationData, templateId, title } = body;

    const updates: any = { updatedAt: new Date() };
    if (invitationData !== undefined) updates.invitationData = invitationData;
    if (templateId !== undefined) updates.templateId = templateId;
    if (title !== undefined) updates.title = title;

    const [updated] = await db.update(invitations)
      .set(updates)
      .where(and(eq(invitations.id, parseInt(id)), inArray(invitations.userId, coupleUserIds)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating invitation:', error);
    return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const coupleUserIds = await getCoupleUserIds(userId);
  const { id } = await params;

  try {
    const [deleted] = await db.delete(invitations)
      .where(and(eq(invitations.id, parseInt(id)), inArray(invitations.userId, coupleUserIds)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json({ error: 'Failed to delete invitation' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'dating';

  try {
    const result = await db.select().from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.mode, mode)))
      .orderBy(desc(notifications.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const { type, title, message, mode = 'dating' } = body;

    const [newNotification] = await db.insert(notifications).values({
      userId,
      type,
      title,
      message,
      mode,
      isRead: false,
    }).returning();

    return NextResponse.json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isRead } = body;

    const [updated] = await db.update(notifications)
      .set({ isRead })
      .where(eq(notifications.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await db.delete(notifications).where(eq(notifications.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { checklistItems } from '@/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getCoupleUserIds } from '@/lib/couple-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'wedding';

  const auth = await requireAuth();
  let userId: string;
  let coupleUserIds: string[];

  if (isUnauthorized(auth)) {
    if (mode !== 'wedding') return auth;
    userId = 'guest-wedding';
    coupleUserIds = [userId];
  } else {
    userId = auth.userId;
    coupleUserIds = await getCoupleUserIds(userId);
  }

  try {
    const result = await db.select().from(checklistItems)
      .where(and(inArray(checklistItems.userId, coupleUserIds), eq(checklistItems.mode, mode)))
      .orderBy(desc(checklistItems.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching checklist:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, title, dueDate, priority = 'medium', mode = 'wedding' } = body;

    const auth = await requireAuth();
    let userId: string;

    if (isUnauthorized(auth)) {
      if (mode !== 'wedding') return auth;
      userId = 'guest-wedding';
    } else {
      userId = auth.userId;
    }

    const [newItem] = await db.insert(checklistItems).values({
      userId,
      category,
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      mode,
      completed: false,
    }).returning();

    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error creating checklist item:', error);
    return NextResponse.json({ error: 'Failed to create checklist item' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, completed, title, category, priority, dueDate } = body;

    const updates: Record<string, unknown> = {};
    if (completed !== undefined) updates.completed = completed;
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null;

    const [updated] = await db.update(checklistItems)
      .set(updates)
      .where(eq(checklistItems.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating checklist item:', error);
    return NextResponse.json({ error: 'Failed to update checklist item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await db.delete(checklistItems).where(eq(checklistItems.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    return NextResponse.json({ error: 'Failed to delete checklist item' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses } from '@/db/schema';
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
    const result = await db.select().from(expenses)
      .where(and(inArray(expenses.userId, coupleUserIds), eq(expenses.mode, mode)))
      .orderBy(desc(expenses.date));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, amount, category, date, isPaid = false, memo, mode = 'wedding', vendorId, vendorName } = body;

    if (!title || amount === undefined || amount === null || !category || !date) {
      return NextResponse.json({ error: 'Missing required fields: title, amount, category, date' }, { status: 400 });
    }

    const auth = await requireAuth();
    let userId: string;

    if (isUnauthorized(auth)) {
      if (mode !== 'wedding') return auth;
      userId = 'guest-wedding';
    } else {
      userId = auth.userId;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const [newExpense] = await db.insert(expenses).values({
      userId,
      title,
      amount: String(amount),
      category,
      vendorId: vendorId || null,
      vendorName: vendorName || null,
      date: parsedDate,
      isPaid,
      memo: memo || null,
      mode,
    }).returning();

    return NextResponse.json(newExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isPaid, amount, title, category, memo } = body;

    if (id === undefined || id === null) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (isPaid !== undefined) updates.isPaid = isPaid;
    if (amount !== undefined) updates.amount = String(amount);
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (memo !== undefined) updates.memo = memo;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const [updated] = await db.update(expenses)
      .set(updates)
      .where(eq(expenses.id, numericId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await db.delete(expenses).where(eq(expenses.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}

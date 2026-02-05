import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'default';
  const mode = searchParams.get('mode') || 'wedding';

  try {
    const result = await db.select().from(expenses)
      .where(and(eq(expenses.userId, userId), eq(expenses.mode, mode)))
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
    const { userId = 'default', title, amount, category, date, isPaid = false, memo, mode = 'wedding' } = body;

    const [newExpense] = await db.insert(expenses).values({
      userId,
      title,
      amount: amount.toString(),
      category,
      date: new Date(date),
      isPaid,
      memo,
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

    const updates: Record<string, unknown> = {};
    if (isPaid !== undefined) updates.isPaid = isPaid;
    if (amount !== undefined) updates.amount = amount.toString();
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (memo !== undefined) updates.memo = memo;

    const [updated] = await db.update(expenses)
      .set(updates)
      .where(eq(expenses.id, id))
      .returning();

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

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { todos, todoComments } from '@/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getCoupleUserIds } from '@/lib/couple-utils';

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const coupleUserIds = await getCoupleUserIds(userId);
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'dating';

  try {
    const modeFilter = mode === 'family'
      ? inArray(todos.mode, ['dating', 'wedding', 'family'])
      : eq(todos.mode, mode);

    const result = await db.select().from(todos)
      .where(and(inArray(todos.userId, coupleUserIds), modeFilter))
      .orderBy(desc(todos.createdAt));

    const todosWithComments = await Promise.all(
      result.map(async (todo) => {
        const comments = await db.select().from(todoComments)
          .where(eq(todoComments.todoId, todo.id))
          .orderBy(todoComments.createdAt);
        return { ...todo, comments };
      })
    );

    return NextResponse.json(todosWithComments);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const { text, assignee = 'we', mode = 'dating' } = body;

    const [newTodo] = await db.insert(todos).values({
      userId,
      text,
      assignee,
      mode,
      completed: false,
    }).returning();

    return NextResponse.json({ ...newTodo, comments: [] });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, completed, text, assignee } = body;

    const updates: Record<string, unknown> = {};
    if (completed !== undefined) updates.completed = completed;
    if (text !== undefined) updates.text = text;
    if (assignee !== undefined) updates.assignee = assignee;

    const [updated] = await db.update(todos)
      .set(updates)
      .where(eq(todos.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await db.delete(todoComments).where(eq(todoComments.todoId, parseInt(id)));
    await db.delete(todos).where(eq(todos.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}

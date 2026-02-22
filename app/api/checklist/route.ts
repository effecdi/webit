import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { checklistItems } from '@/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getCoupleUserIds } from '@/lib/couple-utils';

const defaultWeddingItems = [
  { category: "웨딩홀", title: "예식장 투어 일정 잡기", priority: "high" },
  { category: "웨딩홀", title: "예식장 계약 확정", priority: "high" },
  { category: "스튜디오", title: "스튜디오 업체 선택", priority: "medium" },
  { category: "스튜디오", title: "스튜디오 촬영 예약", priority: "medium" },
  { category: "드레스", title: "드레스 투어 및 피팅 예약", priority: "medium" },
  { category: "드레스", title: "본식 드레스 선택", priority: "medium" },
  { category: "2부드레스", title: "2부 드레스 선택", priority: "low" },
  { category: "메이크업", title: "본식 메이크업 샵 예약", priority: "medium" },
  { category: "예복", title: "신랑 예복 맞춤/대여", priority: "medium" },
  { category: "예물", title: "예물 커플링 선택", priority: "medium" },
  { category: "본식스냅", title: "본식 스냅 업체 선택", priority: "medium" },
  { category: "DVD", title: "DVD 업체 선택", priority: "low" },
  { category: "식전영상", title: "식전 영상 제작 업체 선택", priority: "low" },
  { category: "식중영상", title: "식중 영상 업체 선택", priority: "low" },
  { category: "청첩장", title: "청첩장 디자인 선택", priority: "medium" },
  { category: "청첩장", title: "청첩장 주문 및 수령", priority: "low" },
  { category: "사회자", title: "사회자 섭외", priority: "medium" },
  { category: "기타", title: "축가 섭외", priority: "low" },
];

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

    if (result.length === 0 && mode === 'wedding') {
      const seeded = await db.insert(checklistItems).values(
        defaultWeddingItems.map(item => ({
          userId,
          category: item.category,
          title: item.title,
          priority: item.priority,
          mode: 'wedding' as const,
          completed: false,
        }))
      ).returning();

      return NextResponse.json(seeded);
    }

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

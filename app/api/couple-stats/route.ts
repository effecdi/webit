import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { db } from "@/db";
import { photos, events, todos, albums, expenses, travels } from "@/db/schema";
import { and, eq, inArray, count, sql } from "drizzle-orm";
import { getCoupleUserIds } from "@/lib/couple-utils";

export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupleUserIds = await getCoupleUserIds(userId);

    const [photoStats] = await db
      .select({ total: count() })
      .from(photos)
      .where(inArray(photos.userId, coupleUserIds));

    const [eventStats] = await db
      .select({ total: count() })
      .from(events)
      .where(inArray(events.userId, coupleUserIds));

    const [todoStats] = await db
      .select({ total: count() })
      .from(todos)
      .where(inArray(todos.userId, coupleUserIds));

    const [completedTodoStats] = await db
      .select({ total: count() })
      .from(todos)
      .where(and(inArray(todos.userId, coupleUserIds), eq(todos.completed, true)));

    const [albumStats] = await db
      .select({ total: count() })
      .from(albums)
      .where(inArray(albums.userId, coupleUserIds));

    const [travelStats] = await db
      .select({ total: count() })
      .from(travels)
      .where(inArray(travels.userId, coupleUserIds));

    const expenseRows = await db
      .select({ amount: expenses.amount, category: expenses.category })
      .from(expenses)
      .where(inArray(expenses.userId, coupleUserIds));

    const totalExpense = expenseRows.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const categoryMap: Record<string, number> = {};
    for (const e of expenseRows) {
      const cat = e.category || "기타";
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
    }
    const topCategories = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    const monthlyPhotoRows = await db
      .select({
        month: sql<string>`to_char(${photos.createdAt}, 'YYYY-MM')`,
        total: count(),
      })
      .from(photos)
      .where(inArray(photos.userId, coupleUserIds))
      .groupBy(sql`to_char(${photos.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${photos.createdAt}, 'YYYY-MM')`)
      .limit(12);

    const monthlyEventRows = await db
      .select({
        month: sql<string>`to_char(${events.date}, 'YYYY-MM')`,
        total: count(),
      })
      .from(events)
      .where(inArray(events.userId, coupleUserIds))
      .groupBy(sql`to_char(${events.date}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${events.date}, 'YYYY-MM')`)
      .limit(12);

    let daysTogether = 0;
    const firstEvent = await db
      .select({ date: events.date })
      .from(events)
      .where(inArray(events.userId, coupleUserIds))
      .orderBy(events.date)
      .limit(1);

    if (firstEvent.length > 0 && firstEvent[0].date) {
      const first = new Date(firstEvent[0].date);
      const now = new Date();
      daysTogether = Math.floor((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
    }

    return NextResponse.json({
      stats: {
        photos: photoStats.total,
        events: eventStats.total,
        todos: todoStats.total,
        completedTodos: completedTodoStats.total,
        albums: albumStats.total,
        travels: travelStats.total,
        totalExpense,
        daysTogether,
      },
      topExpenseCategories: topCategories,
      monthlyPhotos: monthlyPhotoRows,
      monthlyEvents: monthlyEventRows,
    });
  } catch (error) {
    console.error("Couple stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

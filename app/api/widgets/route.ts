import { NextRequest, NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth"
import { db } from "@/db"
import { widgets } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET() {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userWidgets = await db.select().from(widgets).where(eq(widgets.userId, userId))
    return NextResponse.json({ widgets: userWidgets })
  } catch (error) {
    console.error("Error fetching widgets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, isEnabled } = await request.json()

    if (!type) {
      return NextResponse.json({ error: "Widget type is required" }, { status: 400 })
    }

    const existing = await db.select().from(widgets).where(
      and(eq(widgets.userId, userId), eq(widgets.type, type))
    )

    if (existing.length > 0) {
      await db.update(widgets)
        .set({ isEnabled })
        .where(and(eq(widgets.userId, userId), eq(widgets.type, type)))
    } else {
      await db.insert(widgets).values({
        userId,
        type,
        isEnabled,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating widget:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let body: { userId?: string; firstName?: string; lastName?: string; email?: string } = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const userId = body.userId || "dev-user-001";
    const firstName = body.firstName || "위브";
    const lastName = body.lastName || "사용자";
    const email = body.email || `${userId}@weve.app`;

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Dev login error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

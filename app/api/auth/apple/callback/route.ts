import { handleAppleCallback } from "@/lib/social-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:5000";

  try {
    const formData = await request.formData();
    const result = await handleAppleCallback(formData);

    if (result.success) {
      return NextResponse.redirect(new URL("/splash", baseUrl), { status: 303 });
    } else {
      console.error("Apple callback failed:", result.error);
      return NextResponse.redirect(new URL("/login?error=apple_callback_failed", baseUrl), { status: 303 });
    }
  } catch (error) {
    console.error("Apple callback error:", error);
    return NextResponse.redirect(new URL("/login?error=apple_error", baseUrl), { status: 303 });
  }
}

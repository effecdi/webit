import { handleKakaoCallback } from "@/lib/social-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:5000";

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      return NextResponse.redirect(new URL("/login?error=missing_params", baseUrl));
    }

    const result = await handleKakaoCallback(code, state);

    if (result.success) {
      return NextResponse.redirect(new URL("/splash", baseUrl));
    } else {
      console.error("Kakao callback failed:", result.error);
      return NextResponse.redirect(new URL("/login?error=kakao_callback_failed", baseUrl));
    }
  } catch (error) {
    console.error("Kakao callback error:", error);
    return NextResponse.redirect(new URL("/login?error=kakao_error", baseUrl));
  }
}

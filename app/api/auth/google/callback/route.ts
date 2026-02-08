import { handleGoogleCallback } from "@/lib/social-auth";
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

    const result = await handleGoogleCallback(code, state);

    if (result.success) {
      return NextResponse.redirect(new URL("/splash", baseUrl));
    } else {
      console.error("Google callback failed:", result.error);
      return NextResponse.redirect(new URL("/login?error=google_callback_failed", baseUrl));
    }
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(new URL("/login?error=google_error", baseUrl));
  }
}

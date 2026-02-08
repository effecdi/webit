import { startGoogleLogin } from "@/lib/social-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authUrl = await startGoogleLogin();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google login error:", error);
    const baseUrl = process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
      : "http://localhost:5000";
    return NextResponse.redirect(new URL("/login?error=google_failed", baseUrl));
  }
}

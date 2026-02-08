import { startAppleLogin } from "@/lib/social-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authUrl = await startAppleLogin();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Apple login error:", error);
    const baseUrl = process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
      : "http://localhost:5000";
    return NextResponse.redirect(new URL("/login?error=apple_failed", baseUrl));
  }
}

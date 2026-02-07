import { startLogin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authUrl = await startLogin();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}` : "http://localhost:5000"));
  }
}

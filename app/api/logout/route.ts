import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:5000";

  try {
    await logout();
  } catch (error) {
    console.error("Logout error:", error);
  }

  return NextResponse.redirect(new URL("/login", baseUrl));
}

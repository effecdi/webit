import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:5000";
  return NextResponse.redirect(new URL("/login", baseUrl));
}

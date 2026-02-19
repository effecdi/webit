import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await logout();
  } catch (error) {
    console.error("Logout error:", error);
  }

  return NextResponse.redirect("/login");
}

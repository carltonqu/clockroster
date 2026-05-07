import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    note: "Use NextAuth /api/auth/signout to destroy active session.",
  });
}

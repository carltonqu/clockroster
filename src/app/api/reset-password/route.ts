import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST() {
  try {
    const hashedPassword = await hash("admin123", 10);
    
    // Update admin password
    await prisma.$executeRaw`
      UPDATE "User" 
      SET password = ${hashedPassword}
      WHERE email = 'admin@clockroster.com'
    `;

    return NextResponse.json({
      message: "Password reset successfully",
      email: "admin@clockroster.com",
      password: "admin123"
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json(
      { 
        error: "Failed to reset password", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST() {
  try {
    // Check if admin already exists (using raw query to avoid schema issues)
    const existingAdmins = await prisma.$queryRaw`
      SELECT email FROM "User" WHERE role = 'ADMIN' LIMIT 1
    `;

    if (Array.isArray(existingAdmins) && existingAdmins.length > 0) {
      return NextResponse.json(
        { message: "Admin user already exists", email: existingAdmins[0].email },
        { status: 200 }
      );
    }

    // Create admin user using raw query to handle schema mismatches
    const hashedPassword = await hash("admin123", 10);
    
    await prisma.$executeRaw`
      INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, 'admin@clockroster.com', 'Admin User', ${hashedPassword}, 'ADMIN', NOW(), NOW())
    `;

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        email: "admin@clockroster.com",
        password: "admin123",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { 
        error: "Failed to create admin user", 
        details: error instanceof Error ? error.message : String(error),
        code: error instanceof Error && 'code' in error ? (error as any).code : undefined
      },
      { status: 500 }
    );
  }
}
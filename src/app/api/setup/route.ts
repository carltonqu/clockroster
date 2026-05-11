import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST() {
  try {
    // Delete existing admin and create new one with known password
    const hashedPassword = await hash("admin123", 10);
    
    // First, delete any existing admin
    await prisma.$executeRaw`DELETE FROM "User" WHERE role = 'ADMIN'`;
    
    // Create new admin user - only use columns that exist in the database
    // Using DEFAULT for missing columns
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
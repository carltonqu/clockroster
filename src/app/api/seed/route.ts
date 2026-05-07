import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

// This endpoint seeds the database with default data
// Should be called manually after deployment
export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@clockroster.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin user already exists",
        email: "admin@clockroster.com",
        password: "admin123"
      });
    }

    // Create admin user
    const password = await hash("admin123", 10);

    await prisma.user.create({
      data: {
        name: "System Admin",
        email: "admin@clockroster.com",
        password,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      message: "Database seeded successfully",
      credentials: {
        email: "admin@clockroster.com",
        password: "admin123",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}

// GET to check if seeding is needed
export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({
      seeded: count > 0,
      userCount: count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database not connected", details: String(error) },
      { status: 500 }
    );
  }
}

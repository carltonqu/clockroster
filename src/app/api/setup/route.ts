import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin user already exists", email: existingAdmin.email },
        { status: 200 }
      );
    }

    // Create admin user
    const hashedPassword = await hash("admin123", 10);
    
    const admin = await prisma.user.create({
      data: {
        email: "admin@clockroster.com",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        email: admin.email,
        password: "admin123",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
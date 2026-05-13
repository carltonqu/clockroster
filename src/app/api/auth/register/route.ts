import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const lowerEmail = email.toLowerCase();

    // Check if email exists using raw query
    const existingUsers = await prisma.$queryRaw`
      SELECT id FROM "User" WHERE email = ${lowerEmail} LIMIT 1
    `;

    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user with raw SQL - handle schema variations
    let result;
    try {
      // Try without organizationId first
      result = await prisma.$queryRaw`
        INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${name}, ${lowerEmail}, ${hashedPassword}, 'ADMIN', NOW(), NOW())
        RETURNING id, name, email, role
      `;
    } catch (insertError: any) {
      // If column 'organizationId' is required, try with it
      if (insertError.message?.includes('organizationId') || insertError.message?.includes('column') || insertError.code === 'P2011') {
        result = await prisma.$queryRaw`
          INSERT INTO "User" (id, name, email, password, role, "organizationId", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${name}, ${lowerEmail}, ${hashedPassword}, 'ADMIN', gen_random_uuid(), NOW(), NOW())
          RETURNING id, name, email, role
        `;
      } else {
        throw insertError;
      }
    }

    const user = (result as any[])[0];

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);
    return NextResponse.json(
      { 
        error: "Failed to create account", 
        details: error.message,
        code: error.code,
        meta: error.meta 
      },
      { status: 500 }
    );
  }
}

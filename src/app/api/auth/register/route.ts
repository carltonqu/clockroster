import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organizationName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const lowerEmail = email.toLowerCase();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Try to create user with raw SQL to handle schema variations
    // First, check if organizationId column exists
    let user;
    try {
      // Try the new schema first (no organizationId)
      user = await prisma.user.create({
        data: {
          name,
          email: lowerEmail,
          password: hashedPassword,
          role: "ADMIN",
          status: "ACTIVE",
        },
      });
    } catch (createError: any) {
      // If that fails, try with organizationId (old schema)
      if (createError.message?.includes("organizationId") || 
          createError.code === "P2002" ||
          createError.message?.includes("required")) {
        
        // Generate a placeholder org ID
        const orgId = crypto.randomUUID();
        
        try {
          // Use raw query to insert with organizationId
          const result = await prisma.$queryRaw`
            INSERT INTO "User" (id, name, email, password, role, status, "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), ${name}, ${lowerEmail}, ${hashedPassword}, 'ADMIN', 'ACTIVE', NOW(), NOW())
            RETURNING id, name, email, role, status
          `;
          user = (result as any[])[0];
        } catch (rawError: any) {
          console.error("Raw SQL insert failed:", rawError);
          throw createError; // Throw original error
        }
      } else {
        throw createError;
      }
    }

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
    return NextResponse.json(
      { error: "Failed to create account", details: error.message },
      { status: 500 }
    );
  }
}

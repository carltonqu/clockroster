import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    
    // Rate limiting: 3 attempts per 15 minutes per IP
    const rateLimitResult = rateLimit(`register:${ip}`, 3, 15 * 60 * 1000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": "3",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResult.resetTime),
          }
        }
      );
    }

    const body = await req.json();
    
    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message).join(", ");
      return NextResponse.json(
        { error: errors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();

    // Check if email already exists using raw query
    const existingUsers = await prisma.$queryRaw`
      SELECT id FROM "User" WHERE email = ${lowerEmail} LIMIT 1
    `;

    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json(
        { error: "Unable to create account. Please try again." },
        { status: 400 }
      );
    }

    // Hash password with bcrypt (cost factor 12 for security)
    const hashedPassword = await hash(password, 12);

    // Try to create user - handle different schema versions
    let user;
    try {
      // Try with new schema (with status column)
      const result = await prisma.$queryRaw`
        INSERT INTO "User" (id, name, email, password, role, status, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${name.trim()}, ${lowerEmail}, ${hashedPassword}, 'ADMIN', 'ACTIVE', NOW(), NOW())
        RETURNING id, name, email, role
      `;
      user = (result as any[])[0];
    } catch (err: any) {
      // If status column doesn't exist, try without it
      if (err.message?.includes('status') || err.message?.includes('column')) {
        try {
          const result = await prisma.$queryRaw`
            INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), ${name.trim()}, ${lowerEmail}, ${hashedPassword}, 'ADMIN', NOW(), NOW())
            RETURNING id, name, email, role
          `;
          user = (result as any[])[0];
        } catch (err2: any) {
          // If organizationId is required, include it
          if (err2.message?.includes('organizationId')) {
            const result = await prisma.$queryRaw`
              INSERT INTO "User" (id, name, email, password, role, "organizationId", "createdAt", "updatedAt")
              VALUES (gen_random_uuid(), ${name.trim()}, ${lowerEmail}, ${hashedPassword}, 'ADMIN', gen_random_uuid(), NOW(), NOW())
              RETURNING id, name, email, role
            `;
            user = (result as any[])[0];
          } else {
            throw err2;
          }
        }
      } else if (err.message?.includes('organizationId')) {
        // organizationId required but status exists
        const result = await prisma.$queryRaw`
          INSERT INTO "User" (id, name, email, password, role, status, "organizationId", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${name.trim()}, ${lowerEmail}, ${hashedPassword}, 'ADMIN', 'ACTIVE', gen_random_uuid(), NOW(), NOW())
          RETURNING id, name, email, role
        `;
        user = (result as any[])[0];
      } else {
        throw err;
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
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    
    // Return detailed error in development
    return NextResponse.json(
      { 
        error: "Unable to create account. Please try again later.",
        ...(process.env.NODE_ENV === "development" && { 
          details: error.message,
          code: error.code 
        })
      },
      { status: 500 }
    );
  }
}

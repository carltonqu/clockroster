import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    },
    tests: [],
  };

  try {
    // Test 1: Database connection
    try {
      await prisma.$connect();
      results.tests.push({ name: "Database connection", status: "PASS" });
    } catch (e: any) {
      results.tests.push({ name: "Database connection", status: "FAIL", error: e.message });
      throw e;
    }

    // Test 2: Query User table
    try {
      const count = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "User"`;
      results.tests.push({ name: "User table query", status: "PASS", count: Number((count as any[])[0].count) });
    } catch (e: any) {
      results.tests.push({ name: "User table query", status: "FAIL", error: e.message });
    }

    // Test 3: Check enum types
    try {
      const enums = await prisma.$queryRaw`
        SELECT typname, enumlabel 
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid 
        WHERE typname IN ('UserRole', 'UserStatus')
        ORDER BY typname, enumsortorder
      `;
      results.tests.push({ name: "Enum types", status: "PASS", enums });
    } catch (e: any) {
      results.tests.push({ name: "Enum types", status: "FAIL", error: e.message });
    }

    // Test 4: Try actual insert (will rollback)
    try {
      const hashedPassword = await hash("Test123!@#", 12);
      const email = `debug_${Date.now()}@test.com`;
      
      const insertResult = await prisma.$queryRaw`
        INSERT INTO "User" (id, name, email, password, role, status, "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(), 
          'Debug Test', 
          ${email}, 
          ${hashedPassword}, 
          'ADMIN'::"UserRole", 
          'ACTIVE'::"UserStatus", 
          NOW(), 
          NOW()
        )
        RETURNING id, email
      `;
      
      results.tests.push({ name: "Insert user", status: "PASS", user: (insertResult as any[])[0] });
      
      // Cleanup
      await prisma.$queryRaw`DELETE FROM "User" WHERE email = ${email}`;
      results.tests.push({ name: "Cleanup", status: "PASS" });
    } catch (e: any) {
      results.tests.push({ name: "Insert user", status: "FAIL", error: e.message, code: e.code });
    }

    await prisma.$disconnect();
    
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({
      ...results,
      fatalError: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

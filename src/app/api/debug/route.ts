import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get column information for User table
    const userColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position
    `;
    
    // Get column information for Organization table
    const orgColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Organization' 
      ORDER BY ordinal_position
    `;
    
    // Count users - cast BigInt to Number
    const userCountResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "User"`;
    const userCount = Number((userCountResult as any)[0].count);
    
    return NextResponse.json({
      userColumns,
      orgColumns,
      userCount,
      databaseUrl: process.env.DATABASE_URL ? "Set (hidden)" : "Not set"
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to get debug info",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

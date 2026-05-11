import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get column information for User table
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position
    `;
    
    // Count users
    const userCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "User"`;
    
    return NextResponse.json({
      columns,
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

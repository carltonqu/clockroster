import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check User table columns
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'User'
      ORDER BY ordinal_position
    `;

    // Check if there are any constraints
    const constraints = await prisma.$queryRaw`
      SELECT column_name, constraint_name 
      FROM information_schema.constraint_column_usage 
      WHERE table_name = 'User'
    `;

    // Try to count users (handle BigInt)
    const userCountResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "User"`;
    const userCount = Number((userCountResult as any[])[0]?.count || 0);

    return NextResponse.json({
      columns,
      constraints,
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

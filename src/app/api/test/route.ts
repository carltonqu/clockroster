import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Simple test - just check if we can query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    return NextResponse.json({ 
      status: "ok", 
      test: result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "error", 
      message: error.message,
      code: error.code 
    }, { status: 500 });
  }
}

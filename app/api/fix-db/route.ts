import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Try to run a simple migration to add missing columns
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "User"
        ADD COLUMN IF NOT EXISTS "phone" TEXT,
        ADD COLUMN IF NOT EXISTS "bio" TEXT,
        ADD COLUMN IF NOT EXISTS "profileImageUrl" TEXT,
        ADD COLUMN IF NOT EXISTS "passwordChangedAt" TIMESTAMP(3)
      `);

      return NextResponse.json({
        ok: true,
        message: 'Database columns added successfully'
      });
    } catch (dbError: any) {
      return NextResponse.json({
        ok: false,
        message: 'Could not add columns',
        error: dbError.message
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message
    });
  }
}
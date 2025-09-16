import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Check for migration key
    const { key } = await request.json();

    if (key !== 'migrate-kbk-2024') {
      return NextResponse.json({ error: 'Invalid migration key' }, { status: 401 });
    }

    // Run raw SQL migrations
    const migrations = [
      // Add new columns to User table
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileImageUrl" TEXT`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordChangedAt" TIMESTAMP(3)`,

      // Create LoginHistory table
      `CREATE TABLE IF NOT EXISTS "LoginHistory" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL,
        "device" TEXT,
        "ip" TEXT,
        "location" TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )`,

      // Create ActiveDevice table
      `CREATE TABLE IF NOT EXISTS "ActiveDevice" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL,
        "deviceName" TEXT NOT NULL,
        "deviceType" TEXT,
        "os" TEXT,
        "browser" TEXT,
        "ip" TEXT,
        "location" TEXT,
        "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )`,

      // Create UserSettings table
      `CREATE TABLE IF NOT EXISTS "UserSettings" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL UNIQUE,
        "biometricEnabled" BOOLEAN NOT NULL DEFAULT false,
        "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )`,

      // Add foreign key constraints
      `DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'LoginHistory_userId_fkey'
        ) THEN
          ALTER TABLE "LoginHistory"
          ADD CONSTRAINT "LoginHistory_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
        END IF;
      END $$`,

      `DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'ActiveDevice_userId_fkey'
        ) THEN
          ALTER TABLE "ActiveDevice"
          ADD CONSTRAINT "ActiveDevice_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
        END IF;
      END $$`,

      `DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'UserSettings_userId_fkey'
        ) THEN
          ALTER TABLE "UserSettings"
          ADD CONSTRAINT "UserSettings_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
        END IF;
      END $$`
    ];

    // Execute migrations
    const results = [];
    for (const migration of migrations) {
      try {
        await prisma.$executeRawUnsafe(migration);
        results.push({ success: true, query: migration.substring(0, 50) + '...' });
      } catch (error: any) {
        results.push({
          success: false,
          query: migration.substring(0, 50) + '...',
          error: error.message
        });
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'Migrations completed',
      results
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error },
      { status: 500 }
    );
  }
}
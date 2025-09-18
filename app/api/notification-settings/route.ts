import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const notificationSettingsSchema = z.object({
  membershipExpiry: z.boolean().optional(),
  trainingReminder: z.boolean().optional(),
  promotions: z.boolean().optional(),
  arrivalConfirmation: z.boolean().optional()
});

// GET - Dobavi trenutna podešavanja
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Niste autentifikovani' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify JWT token
    let decoded: { userId: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch {
      return NextResponse.json(
        { error: 'Nevažeći token' },
        { status: 401 }
      );
    }

    // Get or create notification settings
    let settings = await prisma.notificationSettings.findUnique({
      where: { userId: decoded.userId }
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.notificationSettings.create({
        data: {
          userId: decoded.userId,
          membershipExpiry: true,
          trainingReminder: true,
          promotions: true,
          arrivalConfirmation: true
        }
      });
    }

    return NextResponse.json({
      ok: true,
      settings: {
        membershipExpiry: settings.membershipExpiry,
        trainingReminder: settings.trainingReminder,
        promotions: settings.promotions,
        arrivalConfirmation: settings.arrivalConfirmation
      }
    });

  } catch (error) {
    console.error('Get notification settings error:', error);
    return NextResponse.json(
      { error: 'Greška pri učitavanju podešavanja' },
      { status: 500 }
    );
  }
}

// PUT - Ažuriraj podešavanja
export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Niste autentifikovani' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify JWT token
    let decoded: { userId: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch {
      return NextResponse.json(
        { error: 'Nevažeći token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const settingsData = notificationSettingsSchema.parse(body);

    // Update or create settings
    const settings = await prisma.notificationSettings.upsert({
      where: { userId: decoded.userId },
      update: settingsData,
      create: {
        userId: decoded.userId,
        ...settingsData
      }
    });

    return NextResponse.json({
      ok: true,
      message: 'Podešavanja su uspešno ažurirana',
      settings: {
        membershipExpiry: settings.membershipExpiry,
        trainingReminder: settings.trainingReminder,
        promotions: settings.promotions,
        arrivalConfirmation: settings.arrivalConfirmation
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Neispravni podaci', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update notification settings error:', error);
    return NextResponse.json(
      { error: 'Greška pri ažuriranju podešavanja' },
      { status: 500 }
    );
  }
}
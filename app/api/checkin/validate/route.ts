import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qrCode = searchParams.get('code');

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR kod je obavezan' },
        { status: 400 }
      );
    }

    // Decode QR code to get user ID
    // QR code format: "kbkprincip:user:{userId}"
    const qrParts = qrCode.split(':');
    if (qrParts.length !== 3 || qrParts[0] !== 'kbkprincip' || qrParts[1] !== 'user') {
      return NextResponse.json(
        { error: 'Nevažeći QR kod' },
        { status: 400 }
      );
    }

    const userId = qrParts[2];

    // Find user with membership
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        membership: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Korisnik nije pronađen' },
        { status: 404 }
      );
    }

    // Check if membership is active
    const now = new Date();
    const membershipActive = user.membership &&
                            user.membership.active &&
                            user.membership.expiresAt &&
                            user.membership.expiresAt > now;

    // Check if user already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingCheckin = await prisma.checkin.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // If no checkin today and membership is active, create one
    let checkedInToday = false;
    if (!existingCheckin && membershipActive) {
      await prisma.checkin.create({
        data: {
          userId: user.id,
          via: 'QR_SCAN'
        }
      });
      checkedInToday = true;
    }

    // Get total checkins for this month
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyCheckins = await prisma.checkin.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    });

    // Generate temporary token for attendance recording
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '5m' } // Short-lived token for attendance recording
    );

    return NextResponse.json({
      id: user.id,
      name: user.name || user.email.split('@')[0],
      email: user.email,
      membershipActive,
      membershipType: user.membership?.type || null,
      membershipExpiresAt: user.membership?.expiresAt || null,
      monthlyCheckins,
      checkedInToday,
      alreadyCheckedIn: !!existingCheckin,
      token // Token for attendance recording
    });

  } catch (error) {
    console.error('QR validation error:', error);
    return NextResponse.json(
      { error: 'Greška pri validaciji QR koda' },
      { status: 500 }
    );
  }
}
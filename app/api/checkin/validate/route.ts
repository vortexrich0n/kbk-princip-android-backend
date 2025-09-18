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

    // Check for recent checkin with 4-hour cooldown
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);

    const recentCheckin = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        checkInTime: {
          gte: fourHoursAgo
        }
      },
      orderBy: {
        checkInTime: 'desc'
      }
    });

    // Create new checkin if no recent one exists (4-hour cooldown) and membership is active
    let checkedInNow = false;
    let cooldownRemaining = null;

    if (!recentCheckin && membershipActive) {
      await prisma.attendance.create({
        data: {
          userId: user.id,
          qrCode: qrCode
        }
      });
      checkedInNow = true;
    } else if (recentCheckin && membershipActive) {
      // Calculate remaining cooldown time
      const timeSinceLastCheckin = now.getTime() - new Date(recentCheckin.checkInTime).getTime();
      const fourHoursInMs = 4 * 60 * 60 * 1000;
      const remainingMs = fourHoursInMs - timeSinceLastCheckin;

      if (remainingMs > 0) {
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        cooldownRemaining = `${hours}h ${minutes}min`;
      }
    }

    // Get total checkins for this month
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyCheckins = await prisma.attendance.count({
      where: {
        userId: user.id,
        checkInTime: {
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
      checkedInNow,
      hasRecentCheckin: !!recentCheckin,
      cooldownRemaining,
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
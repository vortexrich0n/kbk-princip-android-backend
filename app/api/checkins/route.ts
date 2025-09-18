import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify token
    let userId: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get all checkins for the user
    const attendances = await prisma.attendance.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        checkInTime: 'desc'
      }
    });

    // Transform attendance records to match Checkin model expected by Android app
    const checkins = attendances.map(attendance => ({
      id: attendance.id,
      userId: attendance.userId,
      createdAt: attendance.checkInTime,
      via: attendance.qrCode ? 'QR_SCAN' : 'MANUAL'
    }));

    // Return just the array of checkins (not an object)
    // Android app expects Response<List<Checkin>>
    return NextResponse.json(checkins);

  } catch (error) {
    console.error('Get checkins error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch checkins' },
      { status: 500 }
    );
  }
}
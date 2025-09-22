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
    let userRole: string | undefined;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role?: string };
      userId = decoded.userId;
      userRole = decoded.role;
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isAdminRequest = searchParams.get('admin') === 'true';
    const dateParam = searchParams.get('date');

    // For admin requests, return all check-ins with user information
    if (isAdminRequest && userRole === 'ADMIN') {
      let whereClause: { checkInTime?: { gte: Date; lte: Date } } = {};

      // If date is provided, filter by that date
      if (dateParam) {
        const targetDate = new Date(dateParam);
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        whereClause = {
          checkInTime: {
            gte: startOfDay,
            lte: endOfDay
          }
        };
      }

      const attendances = await prisma.attendance.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          checkInTime: 'desc'
        }
      });

      // Group check-ins by user and count
      interface GroupedUser {
        user: { id: string; name: string | null; email: string };
        checkins: Array<{ id: string; checkInTime: Date; qrCode: string | null }>;
        count: number;
        firstCheckIn: Date;
        lastCheckIn: Date;
      }
      const groupedByUser = attendances.reduce<Record<string, GroupedUser>>((acc, attendance) => {
        const userId = attendance.userId;
        if (!acc[userId]) {
          acc[userId] = {
            user: attendance.user,
            checkins: [],
            count: 0,
            firstCheckIn: attendance.checkInTime,
            lastCheckIn: attendance.checkInTime
          };
        }
        acc[userId].checkins.push({
          id: attendance.id,
          checkInTime: attendance.checkInTime,
          qrCode: attendance.qrCode
        });
        acc[userId].count++;
        // Update first and last check-in times
        if (attendance.checkInTime < acc[userId].firstCheckIn) {
          acc[userId].firstCheckIn = attendance.checkInTime;
        }
        if (attendance.checkInTime > acc[userId].lastCheckIn) {
          acc[userId].lastCheckIn = attendance.checkInTime;
        }
        return acc;
      }, {});

      return NextResponse.json({
        attendances: attendances,
        groupedByUser: groupedByUser,
        totalCheckins: attendances.length,
        uniqueUsers: Object.keys(groupedByUser).length,
        date: dateParam || 'all'
      });
    }

    // For regular users or Android app, return user's check-ins
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
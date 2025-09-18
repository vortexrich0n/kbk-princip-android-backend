import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const attendanceSchema = z.object({
  qrCode: z.string().optional()
});

// POST - Evidentiraj dolazak
export async function POST(request: NextRequest) {
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
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Nevažeći token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { qrCode } = attendanceSchema.parse(body);

    // Check if user has active membership
    const membership = await prisma.membership.findUnique({
      where: { userId: decoded.userId }
    });

    if (!membership || !membership.active) {
      return NextResponse.json(
        { error: 'Nemate aktivnu članarinu' },
        { status: 403 }
      );
    }

    // Check membership expiry
    if (membership.expiresAt && new Date(membership.expiresAt) < new Date()) {
      // Update membership status to inactive
      await prisma.membership.update({
        where: { userId: decoded.userId },
        data: { active: false }
      });

      return NextResponse.json(
        { error: 'Vaša članarina je istekla' },
        { status: 403 }
      );
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId: decoded.userId,
        checkInTime: new Date(),
        qrCode: qrCode || null
      }
    });

    // Count total attendances this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyAttendances = await prisma.attendance.count({
      where: {
        userId: decoded.userId,
        checkInTime: {
          gte: startOfMonth
        }
      }
    });

    return NextResponse.json({
      ok: true,
      message: 'Dolazak je uspešno evidentiran',
      attendance: {
        id: attendance.id,
        checkInTime: attendance.checkInTime,
        monthlyTotal: monthlyAttendances
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Neispravni podaci', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Attendance error:', error);
    return NextResponse.json(
      { error: 'Greška pri evidentiranju dolaska' },
      { status: 500 }
    );
  }
}

// GET - Dobavi istoriju dolazaka
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
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Nevažeći token' },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');
    const month = searchParams.get('month'); // Format: YYYY-MM

    // Build filter
    const where: any = { userId: decoded.userId };

    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59);

      where.checkInTime = {
        gte: startDate,
        lte: endDate
      };
    }

    // Get attendances
    const attendances = await prisma.attendance.findMany({
      where,
      orderBy: { checkInTime: 'desc' },
      take: limit,
      skip: offset
    });

    // Count total attendances
    const total = await prisma.attendance.count({ where });

    // Calculate statistics for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyCount = await prisma.attendance.count({
      where: {
        userId: decoded.userId,
        checkInTime: {
          gte: startOfMonth
        }
      }
    });

    return NextResponse.json({
      ok: true,
      attendances: attendances.map(a => ({
        id: a.id,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        qrCode: a.qrCode
      })),
      total,
      monthlyCount,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Get attendances error:', error);
    return NextResponse.json(
      { error: 'Greška pri učitavanju dolazaka' },
      { status: 500 }
    );
  }
}
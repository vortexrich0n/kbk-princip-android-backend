import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-helper';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get login history for the user
    const loginHistory = await prisma.loginHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        device: true,
        ip: true,
        location: true,
        userAgent: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      ok: true,
      loginHistory
    });

  } catch (error) {
    console.error('Login history error:', error);
    return NextResponse.json(
      { error: 'Failed to get login history' },
      { status: 500 }
    );
  }
}
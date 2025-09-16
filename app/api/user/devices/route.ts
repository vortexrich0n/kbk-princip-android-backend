import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-helper';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get active devices for the user
    const devices = await prisma.activeDevice.findMany({
      where: { userId: user.id },
      orderBy: { lastActive: 'desc' },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        os: true,
        browser: true,
        ip: true,
        location: true,
        lastActive: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      ok: true,
      devices
    });

  } catch (error) {
    console.error('Devices error:', error);
    return NextResponse.json(
      { error: 'Failed to get devices' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deviceId } = await request.json();

    // Remove device
    await prisma.activeDevice.delete({
      where: {
        id: deviceId,
        userId: user.id
      }
    });

    return NextResponse.json({
      ok: true,
      message: 'Device removed successfully'
    });

  } catch (error) {
    console.error('Remove device error:', error);
    return NextResponse.json(
      { error: 'Failed to remove device' },
      { status: 500 }
    );
  }
}
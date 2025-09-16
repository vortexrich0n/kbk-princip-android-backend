import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-helper';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get biometric settings
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: {
        biometricEnabled: true
      }
    });

    return NextResponse.json({
      ok: true,
      biometricEnabled: settings?.biometricEnabled || false
    });

  } catch (error) {
    console.error('Biometric settings error:', error);
    return NextResponse.json(
      { error: 'Failed to get biometric settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabled } = await request.json();

    // Update biometric settings
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        biometricEnabled: enabled
      },
      create: {
        userId: user.id,
        biometricEnabled: enabled
      }
    });

    return NextResponse.json({
      ok: true,
      message: enabled ? 'Biometric authentication enabled' : 'Biometric authentication disabled'
    });

  } catch (error) {
    console.error('Update biometric error:', error);
    return NextResponse.json(
      { error: 'Failed to update biometric settings' },
      { status: 500 }
    );
  }
}
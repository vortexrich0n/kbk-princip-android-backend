import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This is a temporary endpoint to make principkbk@gmail.com an admin
// DELETE THIS FILE AFTER USE!

export async function GET(request: NextRequest) {
  try {
    // Security: Only allow this specific email
    const email = 'principkbk@gmail.com';

    // Check secret key from URL
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== 'kbkprincip2024admin') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // Update user to admin
    const user = await prisma.user.update({
      where: { email },
      data: {
        role: 'ADMIN',
        emailVerified: true
      }
    });

    return NextResponse.json({
      message: 'User updated to admin successfully',
      user: {
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token i nova lozinka su obavezni' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Lozinka mora imati najmanje 6 karaktera' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Nevažeći ili istekli reset token' },
        { status: 400 }
      );
    }

    if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      return NextResponse.json(
        { error: 'Reset token je istekao' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Lozinka je uspešno resetovana'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Greška pri resetovanju lozinke' },
      { status: 500 }
    );
  }
}
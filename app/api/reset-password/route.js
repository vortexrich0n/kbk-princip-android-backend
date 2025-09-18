import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    console.log('Reset password request for token:', token?.substring(0, 10) + '...');

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token i lozinka su obavezni' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Lozinka mora imati najmanje 6 karaktera' },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      console.log('Invalid or expired reset token');
      return NextResponse.json(
        { error: 'Nevažeći ili istekao token za resetovanje. Molimo zatražite novi.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    console.log('Password reset successful for user:', updatedUser.email);

    return NextResponse.json({
      ok: true,
      message: 'Lozinka je uspešno resetovana',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name
      }
    });

  } catch (error) {
    console.error('Password reset error:', error);

    return NextResponse.json(
      { error: 'Greška pri resetovanju lozinke. Pokušajte ponovo.' },
      { status: 500 }
    );
  }
}
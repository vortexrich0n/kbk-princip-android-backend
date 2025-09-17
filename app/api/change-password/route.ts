import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);

    if (!payload) {
      return NextResponse.json(
        { error: 'Nemate dozvolu za ovu akciju' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Trenutna i nova lozinka su obavezne' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Nova lozinka mora imati najmanje 6 karaktera' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Korisnik nije pronađen' },
        { status: 404 }
      );
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Trenutna lozinka nije tačna' },
        { status: 400 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: payload.userId },
      data: { passwordHash: newPasswordHash }
    });

    return NextResponse.json({
      success: true,
      message: 'Lozinka je uspešno promenjena'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Greška pri promeni lozinke' },
      { status: 500 }
    );
  }
}
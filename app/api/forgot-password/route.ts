import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { sendPasswordResetEmail } from '../../../lib/gmail-service';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresa je obavezna' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Ako postoji nalog sa tom email adresom, poslali smo link za reset lozinke.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires
      }
    });

    const emailResult = await sendPasswordResetEmail(user.email, resetToken);

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      return NextResponse.json(
        { error: 'Greška pri slanju emaila. Pokušajte ponovo.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ako postoji nalog sa tom email adresom, poslali smo link za reset lozinke.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Greška pri procesiranju zahteva' },
      { status: 500 }
    );
  }
}
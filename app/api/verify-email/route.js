import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    console.log('Verify email request for token:', token?.substring(0, 10) + '...');

    if (!token) {
      return NextResponse.json({
        ok: false,
        error: 'Token za verifikaciju je obavezan'
      }, { status: 400 });
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token
      }
    });

    if (!user) {
      console.log('User not found with verification token');
      return NextResponse.json({
        ok: false,
        error: 'Nevažeći ili istekao token za verifikaciju. Molimo zatražite novi.'
      }, { status: 400 });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        ok: true,
        message: 'Email je već verifikovan.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: true
        }
      });
    }

    // Update user to be verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null
      }
    });

    console.log('Email verified successfully for user:', updatedUser.email);

    return NextResponse.json({
      ok: true,
      message: 'Email je uspešno verifikovan! Sada možete da se ulogujete u aplikaciju.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);

    return NextResponse.json({
      ok: false,
      error: 'Greška pri verifikaciji email-a. Pokušajte ponovo.'
    }, { status: 500 });
  }
}
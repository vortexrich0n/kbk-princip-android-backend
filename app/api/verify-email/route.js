import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifyUser } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({
        ok: false,
        error: 'Verification token is required'
      }, { status: 400 });
    }

    // Verify the user
    const user = await verifyUser(token);

    // JWT token generation removed - not needed for web-based verification

    // Mark user as verified and return success
    return NextResponse.json({
      ok: true,
      message: 'Email verified successfully! You can now log in to the app.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);

    if (error.message === 'Invalid or expired verification token') {
      return NextResponse.json({
        ok: false,
        error: 'Invalid or expired verification token. Please request a new one.'
      }, { status: 400 });
    }

    return NextResponse.json({
      ok: false,
      error: 'Email verification failed. Please try again.'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return NextResponse.json({
        ok: false,
        error: 'Verification token is required'
      }, { status: 400 });
    }

    // Verify the user
    const user = await verifyUser(token);

    // JWT token generation removed - not needed for web-based verification

    return NextResponse.json({
      ok: true,
      message: 'Email verified successfully',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);

    if (error.message === 'Invalid or expired verification token') {
      return NextResponse.json({
        ok: false,
        error: 'Invalid or expired verification token. Please request a new one.'
      }, { status: 400 });
    }

    return NextResponse.json({
      ok: false,
      error: 'Email verification failed. Please try again.'
    }, { status: 500 });
  }
}
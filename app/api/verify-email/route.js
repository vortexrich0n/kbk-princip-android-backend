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

    // Generate JWT token for auto-login
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: user.role || 'USER'
      },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '7d' }
    );

    // Return JSON response instead of redirect
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

    // Generate JWT token for auto-login
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: user.role || 'USER'
      },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '7d' }
    );

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
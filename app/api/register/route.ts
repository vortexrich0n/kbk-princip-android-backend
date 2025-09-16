import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
// import { sendVerificationEmail } from '@/lib/mailersend-service';
import { sendVerificationEmail } from '@/lib/resend-service';
import crypto from 'crypto';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const { email, password, name } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'USER',
        emailVerified: false,
        verificationToken,
        verificationExpires,
      },
      include: {
        membership: true,
      },
    });

    // Send verification email using MailerSend (faster than Brevo)
    const emailResult = await sendVerificationEmail(email, name || null, verificationToken);
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Continue registration even if email fails
    } else {
      console.log('✅ MailerSend: Verification email sent successfully to:', email);
    }

    // Create JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token (excluding password hash)
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      ok: true,
      token,
      user: userWithoutPassword,
      message: 'Registration successful. Please check your email to verify your account.',
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
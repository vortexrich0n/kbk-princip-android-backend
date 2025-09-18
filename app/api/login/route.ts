import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const { email, password } = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        membership: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Pogrešna email adresa ili lozinka' },
        { status: 401 }
      );
    }

    // SAMO admin@kbkprincip.rs može da se uloguje bez verifikacije
    // SVI OSTALI moraju da verifikuju email
    const isAdmin = email === 'admin@kbkprincip.rs';

    // Proveri email verifikaciju za sve korisnike osim admin-a
    if (!isAdmin && !user.emailVerified) {
      return NextResponse.json(
        { error: 'Molimo verifikujte vaš email pre prijave. Proverite vašu email poštu.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Pogrešna email adresa ili lozinka' },
        { status: 401 }
      );
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
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      membership: user.membership
    };

    return NextResponse.json({
      ok: true,
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
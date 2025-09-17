import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user to mark email as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        membership: {
          select: {
            active: true,
            type: true,
            expiresAt: true,
          },
        },
      },
    });

    // Generate JWT token for auto-login with full user data
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production-123456789';
    const autoLoginToken = jwt.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name || updatedUser.email.split('@')[0]
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Generated auto-login token for email verification:', {
      token: autoLoginToken,
      email: updatedUser.email,
      userId: updatedUser.id
    });

    // Return HTML response that redirects to app or shows success message
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Email Verified - KBK Princip</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background: linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%);
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 20px;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
              max-width: 90%;
            }
            .logo {
              font-size: 64px;
              margin-bottom: 20px;
            }
            h1 {
              color: #DC2626;
              font-size: 32px;
              margin-bottom: 10px;
            }
            .success-icon {
              font-size: 80px;
              color: #22C55E;
              margin: 20px 0;
            }
            p {
              font-size: 18px;
              color: #ccc;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 15px 40px;
              background-color: #DC2626;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-size: 18px;
              font-weight: bold;
              margin-top: 20px;
              transition: background-color 0.3s;
            }
            .button:hover {
              background-color: #991B1B;
            }
            #mobile-redirect {
              display: none;
              margin-top: 20px;
              padding: 20px;
              background: rgba(220, 38, 38, 0.1);
              border: 1px solid #DC2626;
              border-radius: 8px;
            }
          </style>
          <script>
            // Detektuj mobilni uređaj i preusmeri na app
            window.onload = function() {
              const userAgent = navigator.userAgent.toLowerCase();
              const isAndroid = userAgent.includes('android');
              const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');

              if (isAndroid || isIOS) {
                // Pokušaj da otvori app sa auto-login tokenom
                const appScheme = 'kbkprincip://verify-email?token=' + encodeURIComponent('${autoLoginToken}') + '&email=' + encodeURIComponent('${updatedUser.email}');
                window.location.href = appScheme;

                // Prikaži fallback poruku
                setTimeout(function() {
                  document.getElementById('mobile-redirect').style.display = 'block';
                }, 2000);
              }
            }
          </script>
        </head>
        <body>
          <div class="container">
            <div class="logo">🥊</div>
            <h1>KBK PRINCIP</h1>
            <div class="success-icon">✓</div>
            <h2>Email uspešno verifikovan!</h2>
            <p>Vaš nalog je sada aktiviran. Možete se prijaviti u aplikaciju.</p>

            <div id="mobile-redirect">
              <p style="font-size: 16px;">Aplikacija bi trebalo da se otvori automatski.</p>
              <a href="kbkprincip://verify-email?token=${encodeURIComponent(autoLoginToken)}&email=${encodeURIComponent(updatedUser.email)}" class="button">Otvori aplikaciju</a>
              <p style="font-size: 14px; color: #999; margin-top: 20px;">
                Ako aplikacija nije otvorena, instalirajte KBK Princip aplikaciju iz Play Store ili App Store.
              </p>
            </div>

            <p style="font-size: 14px; color: #999;">Možete zatvoriti ovu stranicu.</p>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      const body = await request.json();
      const { token: bodyToken } = body;

      if (!bodyToken) {
        return NextResponse.json(
          { error: 'Verification token is required' },
          { status: 400 }
        );
      }

      // Find user with this verification token
      const user = await prisma.user.findUnique({
        where: { verificationToken: bodyToken },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid verification token' },
          { status: 400 }
        );
      }

      // Check if token has expired
      if (user.verificationExpires && user.verificationExpires < new Date()) {
        return NextResponse.json(
          { error: 'Verification token has expired' },
          { status: 400 }
        );
      }

      // Update user to mark email as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationToken: null,
          verificationExpires: null,
        },
      });

      return NextResponse.json({
        ok: true,
        message: 'Email successfully verified',
      });
    }

    // Handle token from query params (same as GET)
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: 'Email successfully verified',
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/gmail-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Test token
    const testToken = 'test-token-' + Date.now();

    // Send test email using Gmail SMTP
    const result = await sendVerificationEmail(email, testToken);

    return NextResponse.json({
      ok: result.success,
      message: result.success ? 'Test email sent successfully' : 'Failed to send test email',
      error: result.error,
      apiKeyPresent: !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD,
      gmailUser: process.env.GMAIL_USER ? process.env.GMAIL_USER.substring(0, 3) + '***' : 'Not set',
      provider: 'Gmail SMTP'
    });

  } catch (error) {
    console.error('Test Gmail SMTP error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: (error as Error).message,
        apiKeyPresent: !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD,
        gmailUser: process.env.GMAIL_USER ? process.env.GMAIL_USER.substring(0, 3) + '***' : 'Not set'
      },
      { status: 500 }
    );
  }
}
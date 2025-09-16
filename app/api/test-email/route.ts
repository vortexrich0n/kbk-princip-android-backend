import { NextRequest, NextResponse } from 'next/server';
// import { sendVerificationEmail } from '@/lib/mailersend-service';
import { sendVerificationEmail } from '@/lib/resend-service';

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

    // Send test email using MailerSend
    const result = await sendVerificationEmail(email, 'Test User', testToken);

    return NextResponse.json({
      ok: result.success,
      message: result.success ? 'Test email sent successfully' : 'Failed to send test email',
      error: result.error,
      apiKeyPresent: !!process.env.MAILERSEND_API_KEY,
      apiKeyLength: process.env.MAILERSEND_API_KEY?.length || 0,
      provider: 'Resend'
    });

  } catch (error) {
    console.error('Test Brevo error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: (error as Error).message,
        apiKeyPresent: !!process.env.BREVO_API_KEY,
        apiKeyLength: process.env.BREVO_API_KEY?.length || 0
      },
      { status: 500 }
    );
  }
}
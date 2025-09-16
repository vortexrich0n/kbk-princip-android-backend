// Gmail SMTP Service for KBK Princip
// FREE: 500 emails/day, works with ALL email addresses!
// Fast delivery and excellent reliability

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Create reusable transporter using Gmail SMTP
const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'zgffitudok@gmail.com', // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD || 'qafqgahcklnafkeu' // Your Gmail App Password (16 characters)
    }
  });
};

// Verify transporter configuration
export async function verifyGmailConnection(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified');
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP connection failed:', error);
    return false;
  }
}

export async function sendVerificationEmail(
  toEmail: string,
  token: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'https://kbk-princip-android-backend.vercel.app'}/api/verify-email?token=${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .wrapper {
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #333;
            font-size: 22px;
            margin-bottom: 20px;
          }
          .content p {
            color: #666;
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 20px;
          }
          .button-wrapper {
            text-align: center;
            margin: 35px 0;
          }
          .button {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          .link-text {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            word-break: break-all;
            color: #667eea;
            font-size: 14px;
            font-family: monospace;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 30px;
            background: #fafafa;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #eee;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>🏋️ KBK Princip</h1>
            </div>
            <div class="content">
              <h2>Dobrodošli! 👋</h2>

              <p>Hvala što ste se registrovali na KBK Princip platformu!</p>

              <p>Da biste završili proces registracije i aktivirali svoj nalog, molimo vas da verifikujete vašu email adresu klikom na dugme ispod:</p>

              <div class="button-wrapper">
                <a href="${verificationUrl}" class="button">✓ Verifikuj Email Adresu</a>
              </div>

              <p style="color: #999; font-size: 14px; text-align: center;">
                Ako dugme ne radi, kopirajte link ispod:
              </p>

              <div class="link-text">
                ${verificationUrl}
              </div>

              <div class="warning">
                ⏰ <strong>Važno:</strong> Ovaj link je važeći 24 sata.
              </div>

              <p style="color: #999; font-size: 14px;">
                Ako niste vi kreirali ovaj nalog, možete ignorisati ovaj email.
              </p>
            </div>
            <div class="footer">
              <p><strong>KBK Princip</strong></p>
              <p>© 2025 Sva prava zadržana</p>
              <p style="font-size: 12px;">
                Ovaj email je poslat sa ${process.env.GMAIL_USER || 'zgffitudok@gmail.com'}
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"KBK Princip" <${process.env.GMAIL_USER || 'zgffitudok@gmail.com'}>`,
      to: toEmail,
      subject: '✉️ Verifikujte vašu email adresu - KBK Princip',
      html: htmlContent,
      text: `
Dobrodošli u KBK Princip!

Hvala što ste se registrovali. Da biste aktivirali svoj nalog, molimo verifikujete vašu email adresu na sledećem linku:

${verificationUrl}

Ovaj link je važeći 24 sata.

Ako niste vi kreirali ovaj nalog, možete ignorisati ovaj email.

Srdačan pozdrav,
KBK Princip Tim
      `.trim()
    });

    console.log('✅ Gmail: Email sent successfully to:', toEmail);
    console.log('Message ID:', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Gmail SMTP error:', error);

    return {
      success: false,
      error: (error as Error).message || 'Failed to send email'
    };
  }
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.NEXTAUTH_URL || 'https://kbk-princip-android-backend.vercel.app'}/reset-password?token=${resetToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .content {
            padding: 40px;
          }
          .button {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            padding: 30px;
            background: #fafafa;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Lozinke</h1>
          </div>
          <div class="content">
            <h2>Zahtev za reset lozinke</h2>
            <p>Primili smo zahtev za reset vaše lozinke za KBK Princip nalog.</p>
            <p>Kliknite na dugme ispod da kreirate novu lozinku:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Lozinke</a>
            </div>

            <p style="color: #999; font-size: 14px;">
              Ili kopirajte ovaj link: <br>
              <span style="color: #e74c3c;">${resetUrl}</span>
            </p>

            <p style="color: #999;">
              Link je važeći 1 sat. Ako niste zatražili reset, ignorišite ovaj email.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 KBK Princip</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"KBK Princip" <${process.env.GMAIL_USER || 'zgffitudok@gmail.com'}>`,
      to: toEmail,
      subject: '🔐 Reset lozinke - KBK Princip',
      html: htmlContent,
      text: `
Reset lozinke za KBK Princip

Primili smo zahtev za reset vaše lozinke.

Kliknite na sledeći link da kreirate novu lozinku:
${resetUrl}

Link je važeći 1 sat.

Ako niste zatražili reset, ignorišite ovaj email.

KBK Princip Tim
      `.trim()
    });

    console.log('✅ Gmail: Password reset email sent to:', toEmail);
    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Gmail SMTP error:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

// Test function
export async function testGmailSMTP(testEmail: string): Promise<boolean> {
  try {
    console.log('🧪 Testing Gmail SMTP...');

    // First verify connection
    const connected = await verifyGmailConnection();
    if (!connected) {
      console.error('❌ Cannot connect to Gmail SMTP');
      return false;
    }

    // Send test email
    const result = await sendVerificationEmail(testEmail, 'test-token-123');

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('Check inbox for:', testEmail);
      return true;
    } else {
      console.error('❌ Test failed:', result.error);
      return false;
    }

  } catch (error) {
    console.error('❌ Test error:', error);
    return false;
  }
}
// MailerSend Email Service for KBK Princip
// Fast and reliable email delivery

import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

// Initialize MailerSend client
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "mlsn.20c61de7c5b99f2dd76a5d4d993e9f91e9702433a3260baf02e478c65ec7d0e3",
});

export async function sendVerificationEmail(
  toEmail: string,
  userName: string | null,
  verificationToken: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'https://kbk-princip-android-backend.vercel.app'}/api/verify-email?token=${verificationToken}`;

    // Configure sender - MUST match your MailerSend verified domain!
    const sentFrom = new Sender(
      process.env.MAILERSEND_FROM_EMAIL || "noreply@test-68zxl27v7634j905.mlsender.net",
      "KBK Princip"
    );

    // Configure recipient
    const recipients = [
      new Recipient(toEmail, userName || "Korisnik")
    ];

    // HTML email template
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
              <h2>Dobrodošli, ${userName || 'dragi korisniče'}! 👋</h2>

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
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textContent = `
Dobrodošli u KBK Princip!

Pozdrav ${userName || 'dragi korisniče'},

Hvala što ste se registrovali na KBK Princip platformu!

Da biste završili proces registracije, molimo vas da verifikujete vašu email adresu na sledećem linku:

${verificationUrl}

Ovaj link je važeći 24 sata.

Ako niste vi kreirali ovaj nalog, možete ignorisati ovaj email.

Srdačan pozdrav,
KBK Princip Tim
    `.trim();

    // Create email params
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("✉️ Verifikujte vašu email adresu - KBK Princip")
      .setHtml(htmlContent)
      .setText(textContent);

    // Send email
    const response = await mailerSend.email.send(emailParams);

    console.log('✅ MailerSend: Email sent successfully to:', toEmail);

    return {
      success: true,
      messageId: response.headers?.['x-message-id'] || 'sent'
    };

  } catch (error) {
    console.error('❌ MailerSend error:', error);

    return {
      success: false,
      error: (error as Error).message || 'Failed to send email'
    };
  }
}

export async function sendPasswordResetEmail(
  toEmail: string,
  userName: string | null,
  resetToken: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'https://kbk-princip-android-backend.vercel.app'}/reset-password?token=${resetToken}`;

    const sentFrom = new Sender(
      process.env.MAILERSEND_FROM_EMAIL || "noreply@test-68zxl27v7634j905.mlsender.net",
      "KBK Princip"
    );

    const recipients = [
      new Recipient(toEmail, userName || "Korisnik")
    ];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; }
          .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 40px; text-align: center; }
          .content { padding: 40px; }
          .button { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; text-decoration: none; border-radius: 50px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Lozinke</h1>
          </div>
          <div class="content">
            <h2>Pozdrav ${userName || 'korisniče'},</h2>
            <p>Primili smo zahtev za reset vaše lozinke.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Lozinke</a>
            </div>
            <p>Link: ${resetUrl}</p>
            <p>Link je važeći 1 sat.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("🔐 Reset lozinke - KBK Princip")
      .setHtml(htmlContent)
      .setText(`Reset lozinke: ${resetUrl}`);

    const response = await mailerSend.email.send(emailParams);

    return {
      success: true,
      messageId: response.headers?.['x-message-id'] || 'sent'
    };

  } catch (error) {
    console.error('❌ MailerSend error:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}
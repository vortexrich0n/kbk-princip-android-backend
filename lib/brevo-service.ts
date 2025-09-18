// Brevo (SendinBlue) Email Service
// The ONLY service that works with ALL emails on FREE plan!
// 300 emails/month FREE

import * as SibApiV3Sdk from '@sendinblue/client';

// Configure API key
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'https://kbk-princip-android-backend.vercel.app'}/verify-email?token=${token}`;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "✉️ Verifikujte vašu email adresu - KBK Princip";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏋️ KBK Princip</h1>
        </div>
        <div class="content">
          <h2>Dobrodošli!</h2>
          <p>Hvala što ste se registrovali na KBK Princip platformu!</p>
          <p>Da biste završili registraciju, molimo verifikujte vašu email adresu:</p>

          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">✓ Verifikuj Email</a>
          </div>

          <p style="font-size: 12px; color: #999;">
            Ako dugme ne radi, kopirajte ovaj link:<br>
            <span style="color: #667eea;">${verificationUrl}</span>
          </p>

          <p style="color: #999; font-size: 14px;">
            Link je važeći 24 sata. Ako niste vi kreirali nalog, ignorišite ovaj email.
          </p>
        </div>
        <div class="footer">
          <p>© 2025 KBK Princip. Sva prava zadržana.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  sendSmtpEmail.sender = {
    name: "KBK Princip",
    email: "noreply@kbkprincip.com"
  };

  sendSmtpEmail.to = [{
    email: email
  }];

  sendSmtpEmail.replyTo = {
    email: "support@kbkprincip.com",
    name: "KBK Princip Support"
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Brevo: Email sent successfully to:', email);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Brevo error:', error);
    return {
      success: false,
      error: (error as unknown as {response?: {body?: {message?: string}}}).response?.body?.message || (error as Error).message || 'Failed to send email'
    };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'https://kbk-princip-android-backend.vercel.app'}/reset-password?token=${token}`;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "🔐 Reset lozinke - KBK Princip";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Lozinke</h1>
        </div>
        <div class="content">
          <p>Primili smo zahtev za reset lozinke.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset Lozinke</a>
          </div>
          <p style="color: #999;">Link je važeći 1 sat.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  sendSmtpEmail.sender = {
    name: "KBK Princip",
    email: "noreply@kbkprincip.com"
  };

  sendSmtpEmail.to = [{
    email: email
  }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Password reset email sent to:', email);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return {
      success: false,
      error: (error as unknown as {response?: {body?: {message?: string}}}).response?.body?.message || (error as Error).message || 'Failed to send email'
    };
  }
}
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.APP_URL || 'https://kbk-princip-android-backend.vercel.app'}/api/verify-email?token=${token}`;

  // TEMPORARY: Resend is in test mode and can only send to account owner
  // TODO: Remove this when domain is verified on Resend
  const recipientEmail = 'zgffitudok@gmail.com';

  console.log(`Sending verification email to: ${recipientEmail} (requested for: ${email})`);

  try {
    const { data, error } = await resend.emails.send({
      from: 'KBK Princip <onboarding@resend.dev>',
      to: recipientEmail,
      subject: 'Verifikujte vašu email adresu - KBK Princip',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
                color: white;
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
              }
              .content {
                padding: 40px 30px;
                color: #333333;
              }
              .content h2 {
                color: #DC2626;
                font-size: 22px;
                margin-bottom: 20px;
              }
              .content p {
                line-height: 1.6;
                margin-bottom: 20px;
                font-size: 16px;
              }
              .button-container {
                text-align: center;
                margin: 30px 0;
              }
              .verify-button {
                display: inline-block;
                padding: 15px 40px;
                background-color: #DC2626;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                transition: background-color 0.3s;
              }
              .verify-button:hover {
                background-color: #991B1B;
              }
              .divider {
                height: 1px;
                background-color: #e0e0e0;
                margin: 30px 0;
              }
              .alternative {
                color: #666666;
                font-size: 14px;
                word-break: break-all;
              }
              .footer {
                background-color: #f8f8f8;
                padding: 20px;
                text-align: center;
                color: #666666;
                font-size: 14px;
              }
              .logo {
                font-size: 48px;
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🥊</div>
                <h1>KBK PRINCIP</h1>
              </div>

              <div class="content">
                <h2>Dobrodošli u KBK Princip!</h2>

                <p>Zdravo,</p>

                <p>Hvala vam što ste se registrovali za KBK Princip aplikaciju. Da biste završili proces registracije i aktivirali vaš nalog, molimo vas da verifikujete vašu email adresu klikom na dugme ispod:</p>

                <div class="button-container">
                  <a href="${verificationUrl}" class="verify-button">
                    Verifikuj Email Adresu
                  </a>
                </div>

                <div class="divider"></div>

                <div class="alternative">
                  <p><strong>Ili kopirajte ovaj link u vaš browser:</strong></p>
                  <p>${verificationUrl}</p>
                </div>

                <p style="margin-top: 30px;">Link za verifikaciju je valjan 24 sata. Ako niste zatražili ovaj email, slobodno ga ignorišite.</p>

                <p>Vidimo se na treningu! 💪</p>

                <p><strong>Tim KBK Princip</strong></p>
              </div>

              <div class="footer">
                <p>© 2024 KBK Princip. Sva prava zadržana.</p>
                <p>Ova poruka je poslata na ${email}</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Dobrodošli u KBK Princip!

        Zdravo,

        Hvala vam što ste se registrovali za KBK Princip aplikaciju. Da biste završili proces registracije i aktivirali vaš nalog, molimo vas da verifikujete vašu email adresu na sledećem linku:

        ${verificationUrl}

        Link za verifikaciju je valjan 24 sata. Ako niste zatražili ovaj email, slobodno ga ignorišite.

        Vidimo se na treningu!

        Tim KBK Princip
      `
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.APP_URL || 'https://kbk-princip-android-backend.vercel.app'}/api/reset-password?token=${token}`;

  // TEMPORARY: Resend is in test mode and can only send to account owner
  const recipientEmail = 'zgffitudok@gmail.com';

  try {
    const { data, error } = await resend.emails.send({
      from: 'KBK Princip <onboarding@resend.dev>',
      to: recipientEmail,
      subject: 'Resetovanje lozinke - KBK Princip',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
                color: white;
                padding: 30px;
                text-align: center;
              }
              .content {
                padding: 40px 30px;
                color: #333333;
              }
              .verify-button {
                display: inline-block;
                padding: 15px 40px;
                background-color: #DC2626;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
              }
              .footer {
                background-color: #f8f8f8;
                padding: 20px;
                text-align: center;
                color: #666666;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🥊 KBK PRINCIP</h1>
              </div>

              <div class="content">
                <h2>Resetovanje lozinke</h2>

                <p>Primili smo zahtev za resetovanje vaše lozinke. Kliknite na dugme ispod da biste postavili novu lozinku:</p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" class="verify-button">
                    Resetuj Lozinku
                  </a>
                </div>

                <p>Ovaj link je valjan 1 sat. Ako niste zatražili resetovanje lozinke, ignorišite ovaj email.</p>
              </div>

              <div class="footer">
                <p>© 2024 KBK Princip. Sva prava zadržana.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
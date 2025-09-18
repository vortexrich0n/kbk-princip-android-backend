import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/resend-service';

// Ova funkcija se poziva svaki dan preko cron job-a
export async function GET(request: NextRequest) {
  try {
    // Proveri API key za bezbednost
    const authHeader = request.headers.get('authorization');
    const CRON_SECRET = process.env.CRON_SECRET || 'your-cron-secret-key';

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Nađi sve članarine koje ističu za 3 dana
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const startOfDay = new Date(threeDaysFromNow);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(threeDaysFromNow);
    endOfDay.setHours(23, 59, 59, 999);

    const expiringMemberships = await prisma.membership.findMany({
      where: {
        active: true,
        expiresAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        user: {
          include: {
            notificationSettings: true
          }
        }
      }
    });

    let emailsSent = 0;
    const errors: string[] = [];

    // Pošalji email za svaku članarinu koja ističe
    for (const membership of expiringMemberships) {
      // Proveri da li korisnik želi da prima ovu notifikaciju
      if (membership.user.notificationSettings?.membershipExpiry === false) {
        continue;
      }

      try {
        // Koristi postojeću email funkciju
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; }
              .header { background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 40px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { padding: 40px; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; border-radius: 4px; }
              .button { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Podsetnik o isteku članarine</h1>
              </div>
              <div class="content">
                <h2>Poštovani ${membership.user.name || membership.user.email},</h2>

                <div class="warning">
                  <strong>⚠️ Vaša članarina ističe za 3 dana!</strong>
                  <p>Datum isteka: ${membership.expiresAt?.toLocaleDateString('sr-RS')}</p>
                  <p>Tip članarine: ${membership.type || 'Basic'}</p>
                </div>

                <p>Da biste nastavili da koristite sve benefite KBK Princip kluba, molimo vas da obnovite članarinu na vreme.</p>

                <p style="text-align: center; margin: 30px 0;">
                  <a href="kbkprincip://membership" class="button">Obnovi članarinu</a>
                </p>

                <p style="color: #666; font-size: 14px;">
                  Ako imate bilo kakvih pitanja, slobodno nas kontaktirajte.
                </p>
              </div>
              <div style="padding: 20px; background: #f5f5f5; text-align: center; border-radius: 0 0 12px 12px;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  KBK Princip - Vaš partner u sportu 🥊
                </p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Direktno pošalji email
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER || 'principkbk@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD || 'nzehwrtrdzcxskst'
          }
        });

        await transporter.sendMail({
          from: 'KBK Princip <principkbk@gmail.com>',
          to: membership.user.email,
          subject: '⏰ Vaša članarina ističe za 3 dana - KBK Princip',
          html: htmlContent
        });

        emailsSent++;
      } catch (error) {
        console.error(`Failed to send email to ${membership.user.email}:`, error);
        errors.push(membership.user.email);
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Membership expiry notifications sent`,
      stats: {
        totalExpiring: expiringMemberships.length,
        emailsSent,
        failed: errors.length,
        errors
      }
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to process membership expiry notifications' },
      { status: 500 }
    );
  }
}
import * as nodemailer from 'nodemailer';

async function testNewGmail() {
  console.log('🧪 Testing new Gmail: principkbk@gmail.com\n');

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'principkbk@gmail.com',
      pass: 'utdngopjbmhopmyj' // App password without spaces
    }
  });

  try {
    console.log('1. Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection successful!\n');

    console.log('2. Sending test email...');
    const info = await transporter.sendMail({
      from: '"KBK Princip" <principkbk@gmail.com>',
      to: 'principkbk@gmail.com',
      subject: '✅ Test - KBK Princip Backend RADI!',
      text: 'Gmail SMTP uspešno podešen!',
      html: '<h2>✅ Email verifikacija RADI!</h2>'
    });

    console.log('✅ EMAIL POSLAT!');
    console.log('Message ID:', info.messageId);
    console.log('\n🎉 principkbk@gmail.com RADI PERFEKTNO!');
    return true;

  } catch (error: any) {
    console.error('❌ GREŠKA:', error.message);
    return false;
  }
}

testNewGmail();
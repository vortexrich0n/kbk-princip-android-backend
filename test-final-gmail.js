const nodemailer = require('nodemailer');

async function testFinalGmail() {
  console.log('🧪 Testing Gmail with NEW App Password');
  console.log('Email: principkbk@gmail.com');
  console.log('App Password: nzehwrtrdzcxskst\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'principkbk@gmail.com',
      pass: 'nzehwrtrdzcxskst'
    }
  });

  try {
    console.log('1. Verifying connection...');
    await transporter.verify();
    console.log('✅ CONNECTION SUCCESSFUL!\n');

    console.log('2. Sending test email...');
    const info = await transporter.sendMail({
      from: '"KBK Princip" <principkbk@gmail.com>',
      to: 'principkbk@gmail.com',
      subject: '✅ KBK Princip - Email Verification WORKS!',
      text: 'Gmail SMTP is working perfectly!',
      html: `
        <div style="font-family: Arial; padding: 20px; background: #f0f0f0;">
          <div style="background: white; padding: 20px; border-radius: 10px;">
            <h1 style="color: #4CAF50;">✅ SUCCESS!</h1>
            <h2>Gmail SMTP is configured correctly!</h2>
            <p>Email verification for KBK Princip is now working.</p>
            <ul>
              <li>Email: principkbk@gmail.com</li>
              <li>Daily limit: 500 emails</li>
              <li>Works with ALL email addresses</li>
            </ul>
            <p style="color: green; font-weight: bold;">Ready for production!</p>
          </div>
        </div>
      `
    });

    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('\n🎉 GMAIL SMTP WORKS PERFECTLY!');
    console.log('Ready to deploy to Vercel!');
    return true;

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    return false;
  }
}

testFinalGmail();
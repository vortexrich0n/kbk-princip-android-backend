const nodemailer = require('nodemailer');

async function test() {
  console.log('Testing principkbk@gmail.com with correct method name');

  const transporter = nodemailer.createTransport({  // createTransport not createTransporter!
    service: 'gmail',
    auth: {
      user: 'principkbk@gmail.com',
      pass: 'utdngopjbmhopmyj'
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Gmail connection WORKS!');

    const info = await transporter.sendMail({
      from: '"KBK Princip" <principkbk@gmail.com>',
      to: 'principkbk@gmail.com',
      subject: '✅ KBK Princip - Email Verification Works!',
      text: 'Email verification system is working perfectly!',
      html: '<h1>✅ Success!</h1><p>Gmail SMTP is configured correctly for KBK Princip!</p>'
    });

    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

test();
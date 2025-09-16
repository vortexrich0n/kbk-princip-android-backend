import nodemailer from 'nodemailer';

async function testGmail() {
  console.log('Testing Gmail SMTP...');

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'zgffitudok@gmail.com',
      pass: 'qafqgahcklnafkeu'
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Gmail connection successful!');

    const info = await transporter.sendMail({
      from: '"KBK Princip Test" <zgffitudok@gmail.com>',
      to: 'zgffitudok@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email from KBK Princip backend'
    });

    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGmail();
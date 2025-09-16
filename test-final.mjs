import nodemailer from 'nodemailer';

console.log('Testing principkbk@gmail.com');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'principkbk@gmail.com',
    pass: 'utdngopjbmhopmyj'
  }
});

try {
  await transporter.verify();
  console.log('✅ Connection works!');

  const info = await transporter.sendMail({
    from: 'principkbk@gmail.com',
    to: 'principkbk@gmail.com',
    subject: 'Test',
    text: 'Works!'
  });

  console.log('✅ Email sent!', info.messageId);
} catch (error) {
  console.log('❌ Error:', error.message);
}
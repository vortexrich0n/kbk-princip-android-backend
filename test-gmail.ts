import nodemailer from 'nodemailer';

async function testGmail() {
  console.log('Testing Gmail SMTP with your credentials...');
  console.log('User: zgffitudok@gmail.com');
  console.log('Pass: qafqgahcklnafkeu');

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'zgffitudok@gmail.com',
      pass: 'qafqgahcklnafkeu'
    }
  });

  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Gmail connection successful!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: '"KBK Princip" <zgffitudok@gmail.com>',
      to: 'zgffitudok@gmail.com',
      subject: '✅ Test Email - KBK Princip',
      text: 'This is a test email from KBK Princip backend',
      html: '<h1>Test Email</h1><p>This is a test from KBK Princip backend</p>'
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('❌ Error:', error.message);

    if (error.message.includes('Username and Password not accepted')) {
      console.log('\n⚠️ Gmail Authentication Failed!');
      console.log('Possible reasons:');
      console.log('1. App Password is incorrect');
      console.log('2. 2FA is not enabled on the Gmail account');
      console.log('3. Less secure app access might be disabled');
      console.log('\nTo fix:');
      console.log('1. Go to: https://myaccount.google.com/security');
      console.log('2. Enable 2-Step Verification');
      console.log('3. Generate App Password: https://myaccount.google.com/apppasswords');
      console.log('4. Use the 16-character code WITHOUT spaces');
    }
    return false;
  }
}

testGmail().then(success => {
  process.exit(success ? 0 : 1);
});
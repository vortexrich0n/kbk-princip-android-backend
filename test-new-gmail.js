const nodemailer = require('nodemailer');

async function testNewGmail() {
  console.log('Testing new Gmail account: principkbk@gmail.com');
  console.log('App Password: utdngopjbmhopmyj (without spaces)\n');

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
      subject: '✅ Test Email - KBK Princip Backend',
      text: 'Email verifikacija radi!',
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>✅ Gmail SMTP Radi!</h2>
          <p>Email verifikacija za KBK Princip je uspešno podešena.</p>
          <ul>
            <li>Gmail: principkbk@gmail.com</li>
            <li>Limit: 500 emailova/dan</li>
            <li>Radi sa SVIM email adresama</li>
          </ul>
          <p style="color: green;">Sve je spremno za deploy!</p>
        </div>
      `
    });

    console.log('✅ EMAIL POSLAT USPEŠNO!');
    console.log('Message ID:', info.messageId);
    console.log('\n🎉 Novi Gmail nalog RADI PERFEKTNO!');
    return true;

  } catch (error) {
    console.error('❌ GREŠKA:', error.message);
    if (error.message.includes('Username and Password')) {
      console.log('\nMogući razlozi:');
      console.log('1. App Password nije ispravan');
      console.log('2. 2FA nije omogućen');
      console.log('3. Telefon nije verifikovan');
    }
    return false;
  }
}

testNewGmail();
const nodemailer = require('nodemailer');

async function test() {
  console.log('Testing Gmail with new App Password...');

  // Test both formats
  const passwords = [
    'nahbfvtbidldzpid',  // Without spaces
    'nahb fvtb idld zpid' // With spaces
  ];

  for (const pass of passwords) {
    console.log(`\nTrying password format: ${pass}`);

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'zgffitudok@gmail.com',
        pass: pass
      }
    });

    try {
      await transporter.verify();
      console.log(`✅ SUCCESS with password: ${pass}`);

      // Send test email
      const info = await transporter.sendMail({
        from: '"KBK Test" <zgffitudok@gmail.com>',
        to: 'zgffitudok@gmail.com',
        subject: 'Test - KBK Princip',
        text: 'Gmail SMTP works!'
      });

      console.log('Email sent:', info.messageId);
      return;
    } catch (error) {
      console.log(`❌ Failed with: ${error.message}`);
    }
  }
}

test();
const { Resend } = require('resend');

const resend = new Resend('re_jSzikyWY_AePEtpRWv3jVFiiS8K1CwTPj');

async function testEmail() {
  try {
    console.log('Testing Resend email sending...');

    const { data, error } = await resend.emails.send({
      from: 'KBK Princip <onboarding@resend.dev>',
      to: 'zgffitudok@gmail.com', // Your Resend account email
      subject: 'Test Email - KBK Princip',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #DC2626;">Test Email from KBK Princip</h1>
          <p>This is a test email to verify Resend is working correctly.</p>
          <p>If you receive this email, the email service is configured properly!</p>
        </div>
      `,
      text: 'Test email from KBK Princip. If you receive this, Resend is working!'
    });

    if (error) {
      console.error('Error sending email:', error);
      return;
    }

    console.log('Email sent successfully!');
    console.log('Response:', data);
  } catch (err) {
    console.error('Exception occurred:', err);
  }
}

testEmail();
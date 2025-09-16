const SibApiV3Sdk = require('@sendinblue/client');

// Configure API key
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
// Use environment variable or pass as argument
apiKey.apiKey = process.env.BREVO_API_KEY || process.argv[3];

async function testBrevoEmail() {
  try {
    console.log('Testing Brevo email sending...');

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = 'Test Email - KBK Princip';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #DC2626;">Test Email from KBK Princip</h1>
        <p>This is a test email to verify Brevo is working correctly.</p>
        <p>If you receive this email, the email service is configured properly!</p>
        <p>This email can be sent to ANY email address, not just zgffitudok@gmail.com!</p>
      </div>
    `;
    sendSmtpEmail.sender = {
      name: 'KBK Princip',
      email: 'noreply@kbkprincip.com'
    };

    // Test with a different email address
    const testEmail = process.argv[2] || 'test@example.com';
    sendSmtpEmail.to = [{ email: testEmail }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully!');
    console.log('Sent to:', testEmail);
    console.log('Message ID:', data.messageId);
  } catch (error) {
    console.error('Error sending email:', error.response?.body || error.message);
  }
}

// You can run this with: node scripts/test-brevo.js youremail@example.com
testBrevoEmail();
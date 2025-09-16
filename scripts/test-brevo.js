const { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } = require('@getbrevo/brevo');

// Initialize the API client
const apiInstance = new TransactionalEmailsApi();

// Use environment variable or pass as argument
const apiKey = process.env.BREVO_API_KEY || process.argv[3];
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

async function testBrevoEmail() {
  try {
    console.log('Testing Brevo email sending...');
    console.log('API Key present:', !!apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);

    const sendSmtpEmail = {
      subject: 'Test Email - KBK Princip',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #DC2626;">Test Email from KBK Princip</h1>
          <p>This is a test email to verify Brevo is working correctly.</p>
          <p>If you receive this email, the email service is configured properly!</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `,
      sender: {
        name: 'KBK Princip',
        email: 'zgffitudok@gmail.com'
      },
      to: [
        {
          email: process.argv[2] || 'zgffitudok@gmail.com',
          name: 'Test User'
        }
      ]
    };

    console.log('Sending to:', sendSmtpEmail.to[0].email);
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully!');
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response body:', error.response.body);
    }
  }
}

// You can run this with: node scripts/test-brevo.js youremail@example.com
testBrevoEmail();
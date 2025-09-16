// Direct test of MailerSend API
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

async function testDirect() {
  console.log('🔧 Testing MailerSend directly...\n');

  const mailerSend = new MailerSend({
    apiKey: "mlsn.20c61de7c5b99f2dd76a5d4d993e9f91e9702433a3260baf02e478c65ec7d0e3",
  });

  const sentFrom = new Sender(
    "noreply@test-68zxl27v7634j905.mlsender.net",
    "KBK Princip Test"
  );

  // Test to a real email that will show results
  const recipients = [
    new Recipient("test@mailinator.com", "Test User")
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Test Email - Direct MailerSend")
    .setHtml("<h1>Test Email</h1><p>This is a direct test of MailerSend API.</p>")
    .setText("Test Email - This is a direct test of MailerSend API.");

  try {
    console.log('📧 Sending to: test@mailinator.com');
    console.log('📤 From: noreply@test-68zxl27v7634j905.mlsender.net');
    console.log('🔑 API Key: mlsn.20c61d...', '\n');

    const response = await mailerSend.email.send(emailParams);

    console.log('✅ SUCCESS! Email sent!');
    console.log('Response headers:', response.headers);
    console.log('Message ID:', response.headers['x-message-id']);

    return response;

  } catch (error) {
    console.error('❌ ERROR:', error.message || error);
    console.error('Full error object:', error);

    if (error.response) {
      console.error('\n📋 Response details:');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Headers:', error.response.headers);

      if (error.response.data) {
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }
    }

    if (error.body) {
      console.error('Body:', error.body);
    }

    throw error;
  }
}

// Run test
console.log('===================================');
console.log('MailerSend Direct API Test');
console.log('===================================\n');

testDirect()
  .then(() => {
    console.log('\n✨ Test completed successfully!');
    console.log('Check https://app.mailersend.com/dashboard for email status');
  })
  .catch(() => {
    console.log('\n❌ Test failed. Check error details above.');
    process.exit(1);
  });
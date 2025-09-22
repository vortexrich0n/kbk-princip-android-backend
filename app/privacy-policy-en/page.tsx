export default function PrivacyPolicyEN() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KBK Princip - Privacy Policy</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #DC2626;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 3px solid #DC2626;
        }
        h2 {
            color: #1a1a1a;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-left: 10px;
            border-left: 4px solid #DC2626;
        }
        h3 {
            color: #444;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        p, li {
            margin-bottom: 10px;
            color: #555;
        }
        ul {
            margin-left: 30px;
            margin-bottom: 15px;
        }
        strong {
            color: #333;
        }
        .metadata {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .contact-box {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .important {
            background: #d1ecf1;
            border-left: 4px solid #0c5460;
            padding: 15px;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            .container { padding: 20px; }
            h1 { font-size: 24px; }
            h2 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Privacy Policy</h1>
        <h2>KBK Princip Application</h2>

        <div class="metadata">
            <strong>Last Updated:</strong> September 22, 2025<br>
            <strong>Version:</strong> 1.0
        </div>

        <h2>1. Introduction</h2>
        <p>Welcome to the KBK Princip application ("App"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our gym/club membership management app.</p>

        <h2>2. Data Controller and Contact</h2>
        <div class="contact-box">
            <strong>Developer:</strong> Borivoj Brankov<br>
            <strong>Email:</strong> bbrankov997@gmail.com
        </div>

        <h2>3. Data We Collect</h2>

        <h3>3.1 Data You Provide Directly:</h3>
        <ul>
            <li><strong>Email address</strong> - for account creation and authentication</li>
            <li><strong>Full name</strong> - for account personalization</li>
            <li><strong>Password</strong> - stored encrypted using bcrypt algorithm</li>
        </ul>

        <h3>3.2 Data We Collect Automatically:</h3>
        <ul>
            <li><strong>Check-in records</strong> - date and time when you scan QR codes</li>
            <li><strong>IP address</strong> - for security and abuse prevention</li>
            <li><strong>Device type and OS version</strong> - for technical support</li>
            <li><strong>Crash logs</strong> - anonymous app crash data</li>
        </ul>

        <h3>3.3 Permissions We Request:</h3>
        <ul>
            <li><strong>Camera</strong> - exclusively for QR code scanning at check-in</li>
            <li><strong>Internet</strong> - for server communication</li>
            <li><strong>Network status</strong> - for connection verification</li>
        </ul>

        <h2>4. How We Use Your Data</h2>
        <p>We use your data exclusively for:</p>
        <ul>
            <li>Creating and managing your account</li>
            <li>Membership verification and check-in recording</li>
            <li>Sending verification and password reset emails</li>
            <li>Improving app functionality</li>
            <li>Communication about your membership</li>
            <li>Preventing abuse and maintaining security</li>
        </ul>

        <h2>5. Legal Basis for Processing</h2>
        <p>We process your data based on:</p>
        <ul>
            <li><strong>Contract</strong> - to provide membership services</li>
            <li><strong>Legitimate interest</strong> - for security and service improvement</li>
            <li><strong>Legal obligations</strong> - when required by law</li>
        </ul>

        <h2>6. Data Storage and Security</h2>

        <h3>6.1 Security Measures:</h3>
        <ul>
            <li>All data transmitted via HTTPS connection</li>
            <li>Passwords stored using bcrypt hash algorithm</li>
            <li>Authentication tokens use JWT with limited validity</li>
            <li>Local data stored in EncryptedSharedPreferences</li>
            <li>Regular security reviews and updates</li>
        </ul>

        <h3>6.2 Data Location:</h3>
        <ul>
            <li><strong>Server:</strong> Vercel (EU region)</li>
            <li><strong>Database:</strong> Neon PostgreSQL (EU region)</li>
            <li><strong>Analytics:</strong> Firebase (Google Cloud, EU)</li>
        </ul>

        <h2>7. Data Retention</h2>
        <ul>
            <li><strong>Active accounts:</strong> Retained while you have active membership</li>
            <li><strong>Inactive accounts:</strong> Deleted after 2 years of inactivity</li>
            <li><strong>Check-in records:</strong> Retained for 1 year</li>
            <li><strong>Crash logs:</strong> 90 days</li>
        </ul>

        <h2>8. Data Sharing with Third Parties</h2>
        <div class="important">
            <strong>We do not sell or share your personal data</strong> with third parties, except:
            <ul>
                <li>When required by law</li>
                <li>With our technical providers (Vercel, Neon) bound by confidentiality agreements</li>
                <li>Firebase/Google for crash reporting (anonymized data)</li>
            </ul>
        </div>

        <h2>9. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
            <li><strong>Access</strong> your data</li>
            <li><strong>Correct</strong> inaccurate data</li>
            <li><strong>Delete</strong> your account</li>
            <li><strong>Restrict</strong> data processing</li>
            <li><strong>Port</strong> data to another service</li>
            <li><strong>Object</strong> to data processing</li>
        </ul>
        <p>To exercise these rights, contact us at: <strong>bbrankov997@gmail.com</strong></p>

        <h2>10. Children's Data</h2>
        <p>The app is not intended for persons under 16 years of age. We do not knowingly collect data from minors without parental consent.</p>

        <h2>11. Camera and QR Scanning</h2>
        <div class="important">
            <p>The camera is used <strong>exclusively</strong> for:</p>
            <ul>
                <li>Scanning QR codes for check-in recording</li>
                <li>We do not access your photo gallery</li>
                <li>We do not record or store photos or videos</li>
                <li>Camera activates only when you explicitly open the scanner</li>
            </ul>
        </div>

        <h2>12. Cookies and Tracking</h2>
        <p>The app <strong>does not use</strong> cookies or tracking tools for marketing purposes. We only use:</p>
        <ul>
            <li>Session tokens for authentication</li>
            <li>Firebase Analytics for basic usage statistics (anonymized)</li>
        </ul>

        <h2>13. Privacy Policy Changes</h2>
        <p>We reserve the right to modify this policy. Significant changes will be notified via:</p>
        <ul>
            <li>In-app notifications</li>
            <li>Email notifications</li>
            <li>Website announcements</li>
        </ul>

        <h2>14. Contact</h2>
        <div class="contact-box">
            <p>For all privacy-related questions, contact us:</p>
            <strong>Developer:</strong> Borivoj Brankov<br>
            <strong>Email:</strong> bbrankov997@gmail.com
        </div>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; color: #888;">
            <em>By using the KBK Princip app, you agree to this Privacy Policy.</em>
        </p>
    </div>
</body>
</html>` }} />
  );
}
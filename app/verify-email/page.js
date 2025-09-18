'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setError('Verification token is missing');
        return;
      }

      try {
        // Call the verify API
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok && data.token) {
          setStatus('success');

          // Try to open the app with deep link
          const deepLink = `kbkprincip://verify-email?token=${data.token}&email=${encodeURIComponent(data.user.email)}`;
          window.location.href = deepLink;

          // Fallback message after 2 seconds
          setTimeout(() => {
            setStatus('app-redirect');
          }, 2000);
        } else {
          setStatus('error');
          setError(data.error || 'Verification failed');
        }
      } catch (err) {
        setStatus('error');
        setError('Network error. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {status === 'verifying' && (
        <div>
          <h1>Verifying your email...</h1>
          <p>Please wait while we verify your account.</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <h1>✅ Email Verified Successfully!</h1>
          <p>Opening the app...</p>
        </div>
      )}

      {status === 'app-redirect' && (
        <div style={{ textAlign: 'center' }}>
          <h1>✅ Email Verified Successfully!</h1>
          <p>Your email has been verified.</p>
          <p style={{ marginTop: '20px' }}>
            <strong>Please open the KBK Princip app to continue.</strong>
          </p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            You have been automatically logged in.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div style={{ textAlign: 'center' }}>
          <h1>❌ Verification Failed</h1>
          <p>{error}</p>
          <p style={{ marginTop: '20px' }}>
            Please request a new verification email.
          </p>
        </div>
      )}
    </div>
  );
}
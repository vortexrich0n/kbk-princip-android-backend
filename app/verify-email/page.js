'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyEmailContent() {
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
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
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
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      {status === 'verifying' && (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳ Verifying your email...</h1>
          <p style={{ color: '#666' }}>Please wait while we verify your account.</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
          <h1 style={{ color: '#10B981', marginBottom: '20px' }}>Email Verified!</h1>
          <p style={{ marginBottom: '30px', color: '#666' }}>
            Your email has been successfully verified.
          </p>
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #3B82F6',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <h3 style={{ color: '#1E40AF', marginBottom: '10px' }}>Next Steps:</h3>
            <ol style={{ textAlign: 'left', color: '#64748B' }}>
              <li>Open the KBK Princip app</li>
              <li>Log in with your email and password</li>
              <li>Enjoy full access to all features!</li>
            </ol>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
          <h1 style={{ color: '#EF4444', marginBottom: '20px' }}>Verification Failed</h1>
          <p style={{ color: '#666' }}>{error}</p>
          <p style={{ marginTop: '20px', color: '#666' }}>
            Please request a new verification email from the app.
          </p>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h1>Loading...</h1>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
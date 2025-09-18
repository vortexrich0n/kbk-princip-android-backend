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

  const openApp = () => {
    // Simply try to open the app - NO automatic redirect
    window.location.href = 'kbkprincip://login';
  };

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
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
          <h1 style={{ color: '#10B981', marginBottom: '10px', fontSize: '2rem' }}>Success!</h1>
          {/* Force redeploy - no automatic redirect */}
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Your email has been verified</h2>
          <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
            Your account is now active. You can log in to the KBK Princip app with your email and password.
          </p>

          <button
            onClick={openApp}
            style={{
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '18px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%',
              marginBottom: '15px',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#B91C1C'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#DC2626'}
          >
            Open KBK Princip App
          </button>

          <p style={{ fontSize: '14px', color: '#999', marginTop: '20px' }}>
            Or open the app manually from your home screen
          </p>
        </div>
      )}

      {status === 'error' && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
          <h1 style={{ color: '#EF4444', marginBottom: '20px' }}>Verification Failed</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <p style={{ color: '#666' }}>
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
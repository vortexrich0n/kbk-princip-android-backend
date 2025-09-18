'use client';

import { useState, useEffect } from 'react';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('input'); // input, loading, success, error
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setStatus('error');
      setError('Reset token is missing');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Reset token is missing');
      setStatus('error');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  };

  const openApp = () => {
    // Simply try to open the app - NO automatic redirect
    window.location.href = 'kbkprincip://login';
  };

  // Don't render until client-side
  if (!mounted) {
    return null;
  }

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
      {status === 'input' && token && (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>Reset Your Password</h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Confirm new password"
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '10px',
                backgroundColor: '#FEE2E2',
                border: '1px solid #FECACA',
                borderRadius: '5px',
                color: '#991B1B',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#B91C1C'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#DC2626'}
            >
              Reset Password
            </button>
          </form>
        </div>
      )}

      {status === 'loading' && (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳ Resetting password...</h1>
          <p style={{ color: '#666' }}>Please wait...</p>
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
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Your password has been reset</h2>
          <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
            You can now log in to the KBK Princip app with your new password.
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
            Or open the app manually from your phone
          </p>

          <div style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '8px',
            padding: '15px',
            marginTop: '20px',
            textAlign: 'left'
          }}>
            <strong style={{ color: '#92400E' }}>Remember:</strong>
            <p style={{ margin: '5px 0', color: '#78350F', fontSize: '14px' }}>
              Keep your new password safe and secure!
            </p>
          </div>
        </div>
      )}

      {status === 'error' && !token && (
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
          <h1 style={{ color: '#EF4444', marginBottom: '20px' }}>Invalid Reset Link</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error || 'This password reset link is invalid or has expired.'}</p>
          <p style={{ color: '#666' }}>
            Please request a new password reset link from the app.
          </p>
        </div>
      )}
    </div>
  );
}
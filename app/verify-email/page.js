'use client';

import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const verifyEmail = async () => {
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setError('Token za verifikaciju nedostaje');
        return;
      }

      try {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        console.log('Verify response:', data); // Debug log

        if (response.ok || data.ok) {
          setStatus('success');
          if (data.user) {
            setUserInfo(data.user);
          }
        } else {
          setStatus('error');
          setError(data.error || 'Verifikacija nije uspela');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setError('Greška mreže. Pokušajte ponovo.');
      }
    };

    verifyEmail();
  }, []);

  const openApp = () => {
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {status === 'verifying' && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#2d3748' }}>
            Verifikacija u toku...
          </h1>
          <p style={{ color: '#718096' }}>Molimo sačekajte dok verifikujemo vaš nalog.</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '450px',
          width: '100%'
        }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '30px',
            animation: 'pulse 2s infinite'
          }}>
            ✅
          </div>
          <h1 style={{
            color: '#48bb78',
            marginBottom: '10px',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            Uspešno!
          </h1>
          <h2 style={{
            marginBottom: '20px',
            color: '#2d3748',
            fontSize: '20px'
          }}>
            Vaš email je verifikovan
          </h2>

          {userInfo && (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '30px'
            }}>
              <p style={{ margin: '5px 0', color: '#166534', fontSize: '15px' }}>
                <strong>Email:</strong> {userInfo.email}
              </p>
              {userInfo.name && (
                <p style={{ margin: '5px 0', color: '#166534', fontSize: '15px' }}>
                  <strong>Ime:</strong> {userInfo.name}
                </p>
              )}
            </div>
          )}

          <p style={{
            marginBottom: '40px',
            color: '#718096',
            lineHeight: '1.8',
            fontSize: '16px'
          }}>
            Vaš nalog je sada aktivan. Možete da se ulogujete u KBK Princip aplikaciju sa vašim email-om i lozinkom.
          </p>

          <button
            onClick={openApp}
            style={{
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              border: 'none',
              padding: '18px 40px',
              fontSize: '18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%',
              marginBottom: '20px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(72, 187, 120, 0.4)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.4)';
            }}
          >
            📱 Otvori KBK Princip Aplikaciju
          </button>

          <p style={{
            fontSize: '14px',
            color: '#a0aec0',
            marginTop: '20px'
          }}>
            Ili otvorite aplikaciju ručno sa početnog ekrana
          </p>

          <div style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '30px',
            textAlign: 'left'
          }}>
            <strong style={{ color: '#2d3748', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🥊</span>
              Dobrodošli u KBK Princip!
            </strong>
            <p style={{
              margin: '10px 0 0 0',
              color: '#4a5568',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              Vidimo se na treningu! Pripremite se za najbolje boks iskustvo.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '450px',
          width: '100%'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
          <h1 style={{
            color: '#e53e3e',
            marginBottom: '20px',
            fontSize: '28px'
          }}>
            Verifikacija Neuspešna
          </h1>
          <p style={{
            color: '#718096',
            marginBottom: '20px',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            {error}
          </p>
          <p style={{ color: '#718096' }}>
            Molimo zatražite novi email za verifikaciju iz aplikacije.
          </p>

          <div style={{
            backgroundColor: '#fff5f5',
            border: '1px solid #feb2b2',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '30px',
            textAlign: 'left'
          }}>
            <strong style={{ color: '#742a2a', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>💡</span>
              Potrebna pomoć?
            </strong>
            <p style={{
              margin: '10px 0 0 0',
              color: '#742a2a',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              Ako imate problema sa verifikacijom, kontaktirajte našu podršku.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
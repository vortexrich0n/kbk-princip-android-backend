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
      setError('Token za resetovanje lozinke nedostaje');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Token za resetovanje nedostaje');
      setStatus('error');
      return;
    }

    if (password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju');
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
        setStatus('input'); // Ostajemo na formi da korisnik može ponovo da pokuša
        setError(data.error || 'Greška pri resetovanju lozinke');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setStatus('input'); // Vratimo na input umesto error
      setError('Greška mreže. Pokušajte ponovo.');
    }
  };

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
      {status === 'input' && token && (
        <div style={{
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '450px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔐</div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2d3748',
              marginBottom: '10px'
            }}>
              Resetuj Lozinku
            </h1>
            <p style={{ color: '#718096', fontSize: '16px' }}>
              Unesite novu lozinku za vaš nalog
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#4a5568',
                fontWeight: '600',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Nova Lozinka
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                placeholder="Unesite novu lozinku"
                required
                minLength={6}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#4a5568',
                fontWeight: '600',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Potvrdite Lozinku
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                placeholder="Potvrdite novu lozinku"
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fed7d7',
                border: '1px solid #fc8181',
                borderRadius: '8px',
                color: '#742a2a',
                marginBottom: '20px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              Resetuj Lozinku
            </button>
          </form>
        </div>
      )}

      {status === 'loading' && (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#2d3748' }}>
            Resetovanje u toku...
          </h1>
          <p style={{ color: '#718096' }}>Molimo sačekajte...</p>
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
            Vaša lozinka je resetovana
          </h2>
          <p style={{
            marginBottom: '40px',
            color: '#718096',
            lineHeight: '1.8',
            fontSize: '16px'
          }}>
            Sada možete da se ulogujete u KBK Princip aplikaciju sa vašom novom lozinkom.
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
            Ili otvorite aplikaciju ručno sa vašeg telefona
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
              <span style={{ marginRight: '8px' }}>💡</span>
              Savet za bezbednost:
            </strong>
            <p style={{
              margin: '10px 0 0 0',
              color: '#4a5568',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              Čuvajte vašu novu lozinku na sigurnom mestu i ne delite je ni sa kim!
            </p>
          </div>
        </div>
      )}

      {status === 'error' && !token && (
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
            Nevažeći Link
          </h1>
          <p style={{
            color: '#718096',
            marginBottom: '20px',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            {error || 'Ovaj link za resetovanje lozinke je nevažeći ili je istekao.'}
          </p>
          <p style={{ color: '#718096' }}>
            Molimo vas zatražite novi link za resetovanje lozinke iz aplikacije.
          </p>
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
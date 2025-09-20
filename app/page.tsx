import './page.css';

export default function HomePage() {
  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)'
      }}>

        <h1 style={{
          fontSize: '4rem',
          fontWeight: 900,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #dc2626, #ef4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          KBK PRINCIP
        </h1>

        <p style={{
          fontSize: '1.5rem',
          color: '#888',
          marginBottom: '3rem'
        }}>
          Kickboxing Klub - Beograd
        </p>

        <div style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '4rem'
        }}>
          <a
            href="https://play.google.com/store/apps/details?id=com.kbkprincip.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
              style={{ height: '60px', width: 'auto' }}
            />
          </a>

          <a
            href="https://apps.apple.com/app/kbk-princip/id123456789"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              alt="Download on the App Store"
              style={{ height: '60px', width: 'auto' }}
            />
          </a>
        </div>

        <p style={{ color: '#888', fontSize: '1.1rem' }}>
          Preuzmite našu aplikaciju za praćenje treninga i članstva
        </p>
      </div>

      {/* Features Section */}
      <section style={{
        padding: '4rem 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '3rem',
          background: 'linear-gradient(135deg, #dc2626, #ef4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Zašto KBK Princip?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {[
            { icon: '🥊', title: 'Profesionalni Treneri', desc: 'Iskusni i sertifikovani treneri sa višegodišnjim iskustvom' },
            { icon: '💪', title: 'Personalizovani Programi', desc: 'Treninzi prilagođeni vašem nivou' },
            { icon: '🏆', title: 'Dokazani Rezultati', desc: 'Redovno osvajamo medalje na takmičenjima' },
            { icon: '👥', title: 'Zajednica', desc: 'Porodica koja vas motiviše i podržava' },
            { icon: '🏋️', title: 'Moderna Oprema', desc: 'Najsavremenija oprema za trening' },
            { icon: '📱', title: 'Digitalno Praćenje', desc: 'Pratite napredak kroz našu aplikaciju' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2rem',
              transition: 'transform 0.3s'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ef4444' }}>{item.title}</h3>
              <p style={{ color: '#ccc', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs Section */}
      <section style={{
        padding: '4rem 20px',
        background: 'rgba(220, 38, 38, 0.05)'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#ef4444'
        }}>
          Naši Programi
        </h2>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {[
            'Kickboxing za početnike',
            'Napredni kickboxing',
            'Kickboxing za decu',
            'Ženski kickboxing',
            'Takmičarski program',
            'Personalni treninzi'
          ].map((program, idx) => (
            <div key={idx} style={{
              background: '#111',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.3rem' }}>{program}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{
        padding: '4rem 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '2rem',
          color: '#ef4444'
        }}>
          Kontakt
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          fontSize: '1.2rem'
        }}>
          <div>📍 Bulevar Kralja Aleksandra 123, Beograd</div>
          <div>📞 +381 11 234 5678</div>
          <div>✉️ info@kbkprincip.rs</div>
          <div>🕐 Pon-Pet: 08:00 - 22:00, Sub: 09:00 - 20:00</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#666'
      }}>
        <p>© 2025 KBK Princip. Sva prava zadržana.</p>
      </footer>
    </div>
  );
}
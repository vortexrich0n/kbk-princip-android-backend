'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: i * 5,
      top: i * 5,
      width: (i % 3) + 1,
      height: (i % 3) + 1,
      speed: (i % 4) * 0.5 + 0.5,
      color: i % 2 === 0
    }))
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);

    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }

    // Loading animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);


  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #000 0%, #1a0000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '3rem',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <img
            src="/logo.png"
            alt="KBK Princip"
            style={{
              height: '60px',
              width: 'auto',
              filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.5))'
            }}
          />
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '2px'
          }}>KBK PRINCIP</span>
        </div>

        {/* Loading bar container */}
        <div style={{
          width: '200px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${loadingProgress}%`,
            background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
          }} />
        </div>

        {/* Loading text */}
        <p style={{
          marginTop: '1.5rem',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.9rem',
          letterSpacing: '1px'
        }}>UČITAVANJE...</p>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: ${darkMode ? '#000' : '#fff'};
          color: ${darkMode ? '#fff' : '#000'};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          transition: background 0.3s ease, color 0.3s ease;
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(-1deg);
          }
          66% {
            transform: translateY(10px) rotate(1deg);
          }
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .slide-in-left {
          animation: slideInFromLeft 0.8s ease-out;
        }

        .slide-in-right {
          animation: slideInFromRight 0.8s ease-out;
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        /* Hamburger Menu Animation */
        .hamburger-line {
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000);
          transform-origin: center;
        }

        .hamburger-open .hamburger-line:first-child {
          transform: translateY(6px) rotate(45deg);
        }

        .hamburger-open .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .hamburger-open .hamburger-line:last-child {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${darkMode ? 'rgba(0, 0, 0, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 999;
          display: flex;
          flex-direction: column;
          transform: translateY(-100%);
          transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);
          overflow-y: auto;
        }

        .mobile-menu.open {
          transform: translateY(0);
        }

        .mobile-menu-item {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInDown 0.5s ease forwards;
        }

        .mobile-menu.open .mobile-menu-item:nth-child(1) { animation-delay: 0.1s; }
        .mobile-menu.open .mobile-menu-item:nth-child(2) { animation-delay: 0.15s; }
        .mobile-menu.open .mobile-menu-item:nth-child(3) { animation-delay: 0.2s; }
        .mobile-menu.open .mobile-menu-item:nth-child(4) { animation-delay: 0.25s; }
        .mobile-menu.open .mobile-menu-item:nth-child(5) { animation-delay: 0.3s; }
        .mobile-menu.open .mobile-menu-item:nth-child(6) { animation-delay: 0.35s; }

        @keyframes fadeInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Particles */
        .particle {
          position: fixed;
          pointer-events: none;
          opacity: 0.3;
          animation: glow 4s ease-in-out infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr !important;
            text-align: center;
            padding: 0 1rem !important;
            gap: 1.5rem !important;
          }

          .hero-text {
            order: 2;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-text h1 {
            font-size: 2rem !important;
            margin-bottom: 0.5rem !important;
          }

          .hero-text p {
            font-size: 0.9rem !important;
            text-align: center;
          }

          .app-buttons {
            justify-content: center !important;
            width: 100%;
          }

          .stats-section {
            justify-content: space-around !important;
            gap: 1.5rem !important;
            width: 100%;
            margin-top: 2rem !important;
          }

          .stats-section > div {
            min-width: 80px !important;
          }

          .mockup-container {
            order: 1;
            margin: 0;
            padding: 0 !important;
            display: flex;
            justify-content: center !important;
            width: 100%;
          }

          .phone-mockup {
            max-width: 220px !important;
            height: auto !important;
            margin: 0 auto;
          }

          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            padding: 0 1rem !important;
            place-items: center !important;
          }

          .nav-links {
            display: none !important;
          }

          .logo-text {
            font-size: 0.9rem !important;
          }

          section {
            padding: 3.5rem 1rem !important;
            overflow-x: hidden;
          }

          section#početna {
            padding-top: 5rem !important;
            min-height: 100vh !important;
          }

          body {
            overflow-x: hidden !important;
          }
        }

        @media (min-width: 769px) {
          .hamburger {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .hero-text h1 {
            font-size: 1.75rem !important;
          }

          .hero-text p {
            font-size: 0.85rem !important;
            margin-bottom: 1.5rem !important;
          }

          .phone-mockup {
            max-width: 180px !important;
          }

          .hero-content {
            padding: 0 0.75rem !important;
            gap: 1rem !important;
          }

          section {
            padding: 3rem 0.75rem !important;
          }

          section#početna {
            padding: 4.5rem 0.75rem 2rem !important;
          }
        }
      `}</style>

      {/* Particles Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            data-speed={particle.speed}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              background: particle.color ? '#dc2626' : '#fff',
              borderRadius: '50%',
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '1rem 2rem',
        background: scrolled
          ? darkMode ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` : 'none',
        transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo.png" alt="KBK Princip" style={{ height: '40px', width: 'auto' }} />
            <span className="logo-text" style={{ fontSize: '1.2rem', fontWeight: 800, color: darkMode ? '#fff' : '#000' }}>KBK PRINCIP</span>
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-links" style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center'
          }}>
            {['Početna', 'O nama', 'Programi', 'Treneri', 'Kontakt'].map((item, idx) => (
              <li key={idx}>
                <a href={`#${item.toLowerCase().replace(' ', '-')}`}
                   style={{
                     color: darkMode ? '#fff' : '#000',
                     textDecoration: 'none',
                     fontSize: '0.95rem',
                     fontWeight: 500,
                     position: 'relative',
                     padding: '0.5rem 0',
                     transition: 'color 0.3s',
                     display: 'block'
                   }}
                   onMouseEnter={e => {
                     e.currentTarget.style.color = '#dc2626';
                     const underline = document.createElement('span');
                     underline.style.cssText = 'position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: #dc2626; transform: scaleX(0); transition: transform 0.3s;';
                     e.currentTarget.appendChild(underline);
                     setTimeout(() => underline.style.transform = 'scaleX(1)', 10);
                   }}
                   onMouseLeave={e => {
                     e.currentTarget.style.color = darkMode ? '#fff' : '#000';
                     const underline = e.currentTarget.querySelector('span');
                     if (underline) underline.remove();
                   }}>
                  {item}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: darkMode ? '#1a1a1a' : '#f3f3f3',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: '20px',
                  width: '70px',
                  height: '36px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  position: 'relative'
                }}
                aria-label="Toggle theme"
              >
                <span style={{
                  position: 'absolute',
                  left: darkMode ? 'calc(100% - 34px)' : '2px',
                  width: '32px',
                  height: '32px',
                  background: darkMode ? '#dc2626' : '#fff',
                  borderRadius: '50%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {darkMode ? (
                    <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="#333" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="12" y1="21" x2="12" y2="23" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="1" y1="12" x2="3" y2="12" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="21" y1="12" x2="23" y2="12" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </span>
              </button>
            </li>
          </ul>

          {/* Hamburger Menu */}
          <button
            className={`hamburger ${menuOpen ? 'hamburger-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 1001
            }}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: darkMode ? '#fff' : '#000',
              borderRadius: '2px'
            }} />
            <span className="hamburger-line" style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: darkMode ? '#fff' : '#000',
              borderRadius: '2px'
            }} />
            <span className="hamburger-line" style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: darkMode ? '#fff' : '#000',
              borderRadius: '2px'
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={{
        paddingTop: '4.5rem'
      }}>
        <nav style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem'
        }}>
          <div style={{ flex: 1 }}>
            {['Početna', 'O nama', 'Programi', 'Treneri', 'Kontakt'].map((item, idx) => (
              <a
                key={idx}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="mobile-menu-item"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: darkMode ? '#fff' : '#000',
                  fontSize: '1.5rem',
                  fontWeight: 300,
                  textDecoration: 'none',
                  padding: '1.25rem 0',
                  borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#dc2626';
                  e.currentTarget.style.paddingLeft = '1rem';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = darkMode ? '#fff' : '#000';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                {item}
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '1.2rem',
                  opacity: 0.3
                }}>›</span>
              </a>
            ))}
          </div>

          <div className="mobile-menu-item" style={{
            padding: '2rem 0 1rem',
            borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: darkMode ? '#1a1a1a' : '#f3f3f3',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: '25px',
                width: '80px',
                height: '40px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                padding: '3px',
                position: 'relative'
              }}
              aria-label="Toggle theme"
            >
              <span style={{
                position: 'absolute',
                left: darkMode ? 'calc(100% - 38px)' : '3px',
                width: '34px',
                height: '34px',
                background: darkMode ? '#dc2626' : '#fff',
                borderRadius: '50%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}>
                {darkMode ? (
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="#333" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="12" y1="21" x2="12" y2="23" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="1" y1="12" x2="3" y2="12" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="21" y1="12" x2="23" y2="12" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section id="početna" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '5.5rem 2rem 3rem',
        background: darkMode
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2000&auto=format&fit=crop') center/cover`
          : `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2000&auto=format&fit=crop') center/cover`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="hero-content" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '2rem',
          alignItems: 'center',
          width: '100%',
          zIndex: 2
        }}>
          <div className="hero-text fade-in-up">
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              marginBottom: '1rem',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              KBK PRINCIP
            </h1>

            <p style={{
              fontSize: '1.8rem',
              color: darkMode ? '#fff' : '#333',
              marginBottom: '1rem',
              fontWeight: 700
            }}>
              Kickboxing Klub
            </p>

            <p style={{
              fontSize: '1.2rem',
              color: darkMode ? '#ccc' : '#666',
              lineHeight: 1.6,
              marginBottom: '3rem',
              maxWidth: '500px'
            }}>
              Preuzmite aplikaciju na Google Play ili App Store.
              Skenirajte se pre svakog treninga za evidenciju prisustva
              i pratite svoj napredak kroz našu mobilnu aplikaciju.
            </p>

            <div className="app-buttons" style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3rem',
              alignItems: 'center'
            }}>
              <a href="https://play.google.com/store"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="app-button"
                 style={{
                   display: 'inline-block',
                   transition: 'all 0.3s',
                   textDecoration: 'none'
                 }}
                 onMouseEnter={e => {
                   e.currentTarget.style.transform = 'translateY(-3px)';
                   e.currentTarget.style.filter = 'brightness(1.1)';
                 }}
                 onMouseLeave={e => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.filter = 'brightness(1)';
                 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                     alt="Get it on Google Play"
                     style={{ height: '45px', width: 'auto' }} />
              </a>

              <a href="https://apps.apple.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="app-button"
                 style={{
                   display: 'inline-block',
                   transition: 'all 0.3s',
                   textDecoration: 'none'
                 }}
                 onMouseEnter={e => {
                   e.currentTarget.style.transform = 'translateY(-3px)';
                   e.currentTarget.style.filter = 'brightness(1.1)';
                 }}
                 onMouseLeave={e => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.filter = 'brightness(1)';
                 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                     alt="Download on App Store"
                     style={{ height: '45px', width: 'auto' }} />
              </a>
            </div>

            {/* Stats section */}
            <div className="stats-section" style={{
              display: 'flex',
              gap: '3rem',
              marginTop: '3rem',
              justifyContent: 'flex-start',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#dc2626' }}>500+</div>
                <div style={{ fontSize: '0.9rem', color: darkMode ? '#999' : '#666', marginTop: '0.25rem' }}>Aktivnih</div>
                <div style={{ fontSize: '0.9rem', color: darkMode ? '#999' : '#666' }}>članova</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#dc2626' }}>15+</div>
                <div style={{ fontSize: '0.9rem', color: darkMode ? '#999' : '#666', marginTop: '0.25rem' }}>Godina</div>
                <div style={{ fontSize: '0.9rem', color: darkMode ? '#999' : '#666' }}>iskustva</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#dc2626' }}>50+</div>
                <div style={{ fontSize: '0.9rem', color: darkMode ? '#999' : '#666', marginTop: '0.25rem' }}>Medalja</div>
              </div>
            </div>
          </div>

          <div className="mockup-container" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            paddingRight: '2rem'
          }}>
            <img
              src="/mockupPhone.png"
              alt="KBK Princip App"
              className="phone-mockup"
              style={{
                maxWidth: '380px',
                width: '90%',
                height: 'auto',
                filter: 'drop-shadow(0 20px 50px rgba(220,38,38,0.3))',
                objectFit: 'contain',
                display: 'block'
              }}
            />

            {/* Glow Effect Behind Phone */}
            <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 70%)',
              filter: 'blur(80px)',
              zIndex: -1,
              animation: 'glow 3s ease-in-out infinite'
            }} />
          </div>
        </div>

        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '-100px',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(45deg, #dc2626, #ef4444)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.2,
          animation: 'float 8s ease-in-out infinite'
        }} />

        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '-150px',
          width: '300px',
          height: '300px',
          background: 'linear-gradient(45deg, #dc2626, #ef4444)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          opacity: 0.15,
          animation: 'float 10s ease-in-out infinite reverse'
        }} />
      </section>

      {/* Features Section with Professional Animations */}
      <section id="o-nama" style={{
        padding: '5rem 2rem',
        background: darkMode ? '#0a0a0a' : '#fafafa',
        position: 'relative'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 300,
          textAlign: 'center',
          marginBottom: '1rem',
          color: darkMode ? '#fff' : '#000',
          letterSpacing: '-1px'
        }}>
          Zašto baš <span style={{ fontWeight: 700, color: '#dc2626' }}>KBK Princip?</span>
        </h2>
        <p style={{
          textAlign: 'center',
          color: darkMode ? '#888' : '#666',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          Postaćete deo elite kickboxing zajednice sa najmodernijom opremom i stručnim vođstvom
        </p>

        <div className="features-grid" style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          placeItems: 'center'
        }}>
          {[
            {
              imgUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
              title: 'Personalizovani treninzi',
              desc: 'Program prilagođen vašim ciljevima i fizičkoj spremnosti'
            },
            {
              imgUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400',
              title: 'Moderna oprema',
              desc: 'Profesionalna sala sa najnovijom opremom za trening'
            },
            {
              imgUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=400',
              title: 'QR pristup sistemu',
              desc: 'Automatska evidencija prisustva skeniranjem koda'
            },
            {
              imgUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=400',
              title: 'Bezbedno okruženje',
              desc: 'Sigurnost i zaštita na prvom mestu'
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="fade-in-up"
              style={{
                background: darkMode ? '#111' : '#fff',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                borderRadius: '16px',
                padding: '2rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '400px',
                animationDelay: `${idx * 0.1}s`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = darkMode ? '#1a1a1a' : '#f5f5f5';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#dc2626';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = darkMode ? '#111' : '#fff';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                width: '100%',
                height: '150px',
                marginBottom: '1.5rem',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: `url(${feature.imgUrl}) center/cover`,
                  filter: darkMode ? 'brightness(0.8)' : 'brightness(1)',
                  transition: 'transform 0.3s'
                }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: darkMode ? '#fff' : '#000', fontWeight: 600 }}>{feature.title}</h3>
              <p style={{ color: darkMode ? '#999' : '#666', lineHeight: 1.5, fontSize: '0.95rem' }}>{feature.desc}</p>

              {/* Hover Effect Gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.1), transparent)',
                transition: 'left 0.5s',
                pointerEvents: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.left = '100%'} />
            </div>
          ))}
        </div>
      </section>

      {/* Membership & Coach Section */}
      <section id="programi" style={{
        padding: '5rem 2rem',
        background: darkMode ? '#000' : '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>

        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 300,
          textAlign: 'center',
          marginBottom: '3rem',
          color: darkMode ? '#fff' : '#000'
        }}>
          <span style={{ fontWeight: 700, color: '#dc2626' }}>Pridružite</span> nam se
        </h2>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
          alignItems: 'stretch'
        }}>
          {/* Membership Card */}
          <div style={{
            background: darkMode ? '#111' : '#fafafa',
            borderRadius: '20px',
            padding: '3rem',
            border: `2px solid ${darkMode ? 'rgba(220,38,38,0.2)' : 'rgba(220,38,38,0.1)'}`,
            textAlign: 'center',
            transition: 'all 0.3s',
            cursor: 'pointer',
            animation: 'slideInLeft 0.8s ease-out',
            position: 'relative'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
            e.currentTarget.style.borderColor = '#dc2626';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.borderColor = darkMode ? 'rgba(220,38,38,0.2)' : 'rgba(220,38,38,0.1)';
          }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#dc2626',
              color: '#fff',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>POPULARNO</div>

            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #dc2626, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-7.5 13.5l-4.5-4.5 1.05-1.05L12 14.4l6.45-6.45L19.5 9z"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '1.8rem',
              color: darkMode ? '#fff' : '#000',
              marginBottom: '1rem'
            }}>Kickboxing Program</h3>
            <div style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: '#dc2626',
              marginBottom: '0.5rem'
            }}>2,500 RSD</div>
            <p style={{
              fontSize: '1rem',
              color: darkMode ? '#999' : '#666'
            }}>mesečno</p>
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderRadius: '12px'
            }}>
              <p style={{
                color: darkMode ? '#ccc' : '#555',
                fontSize: '0.95rem',
                lineHeight: 1.6
              }}>
                ✓ Neograničen broj treninga<br/>
                ✓ Personalizovan program<br/>
                ✓ Pristup aplikaciji<br/>
                ✓ Stručno vođstvo
              </p>
            </div>
          </div>

          {/* Coach Card */}
          <div style={{
            background: darkMode ? '#111' : '#fafafa',
            borderRadius: '20px',
            padding: '3rem',
            border: `2px solid ${darkMode ? 'rgba(220,38,38,0.2)' : 'rgba(220,38,38,0.1)'}`,
            textAlign: 'center',
            transition: 'all 0.3s',
            cursor: 'pointer',
            animation: 'slideInRight 0.8s ease-out'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
            e.currentTarget.style.borderColor = '#dc2626';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.borderColor = darkMode ? 'rgba(220,38,38,0.2)' : 'rgba(220,38,38,0.1)';
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              margin: '0 auto 2rem',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(220,38,38,0.3)',
              border: '3px solid #dc2626'
            }}>
              <img
                src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400"
                alt="Đorđe Vujaković"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: darkMode ? '#fff' : '#000',
              marginBottom: '0.5rem'
            }}>Đorđe Vujaković</h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#dc2626',
              marginBottom: '1.5rem'
            }}>Glavni trener i osnivač</p>
            <p style={{
              color: darkMode ? '#999' : '#666',
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}>
              Sa 5 godina profesionalnog iskustva, Đorđe je uspeo da osvoji brojne medalje
              na nacionalnim i međunarodnim takmičenjima. Kao bivši profesionalni borac,
              svoju strast i znanje sada prenosi novim generacijama.
            </p>
          </div>
        </div>
      </section>

      {/* About Kickboxing Section */}
      <section style={{
        padding: '5rem 2rem',
        background: darkMode ? '#111' : '#fff',
        position: 'relative'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 300,
          textAlign: 'center',
          marginBottom: '3rem',
          color: darkMode ? '#fff' : '#000'
        }}>
          Zašto <span style={{ fontWeight: 700, color: '#dc2626' }}>Kickboxing?</span>
        </h2>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              title: 'Fizička snaga',
              desc: 'Izgradite izdržljivost, snagu i koordinaciju kroz dinamične treninge',
              icon: 'M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'
            },
            {
              title: 'Mentalna disciplina',
              desc: 'Razvijte fokus, samopouzdanje i mentalnu čvrstinu',
              icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
            },
            {
              title: 'Samoodbrana',
              desc: 'Naučite praktične veštine za samozaštitu u realnim situacijama',
              icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'
            },
            {
              title: 'Zajednica',
              desc: 'Postanite deo tima koji vas motiviše i podržava',
              icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                textAlign: 'center',
                padding: '2rem',
                background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                borderRadius: '16px',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#dc2626';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                  <path d={item.icon}/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                marginBottom: '0.75rem',
                color: darkMode ? '#fff' : '#000',
                fontWeight: 600
              }}>{item.title}</h3>
              <p style={{
                color: darkMode ? '#999' : '#666',
                lineHeight: 1.6,
                fontSize: '0.9rem'
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" style={{
        padding: '5rem 2rem',
        background: darkMode
          ? 'linear-gradient(135deg, rgba(220,38,38,0.05) 0%, transparent 100%)'
          : 'linear-gradient(135deg, rgba(220,38,38,0.02) 0%, #f5f5f5 100%)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          marginBottom: '3rem',
          color: '#dc2626'
        }}>
          Kontaktiraj Nas
        </h2>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#dc2626' }}>📍 Lokacija</h3>
            <p style={{ color: darkMode ? '#ccc' : '#666' }}>Bulevar Kralja Aleksandra 123</p>
            <p style={{ color: darkMode ? '#ccc' : '#666' }}>11000 Beograd</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#dc2626' }}>📞 Telefon</h3>
            <p style={{ color: darkMode ? '#ccc' : '#666' }}>+381 11 234 5678</p>
            <p style={{ color: darkMode ? '#ccc' : '#666' }}>+381 69 876 5432</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#dc2626' }}>⏰ Radno vreme</h3>
            <p style={{ color: darkMode ? '#ccc' : '#666' }}>Pon-Pet: 08:00 - 22:00</p>
            <p style={{ color: darkMode ? '#ccc' : '#666' }}>Sub: 09:00 - 20:00</p>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#dc2626' }}>
            Preuzmi aplikaciju i kreni danas!
          </h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="https://play.google.com/store"
               style={{
                 display: 'inline-block',
                 background: '#dc2626',
                 padding: '1rem 2rem',
                 borderRadius: '12px',
                 color: '#fff',
                 textDecoration: 'none',
                 fontWeight: 600,
                 transition: 'all 0.3s'
               }}
               onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
               onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              Preuzmi za Android
            </a>
            <a href="https://apps.apple.com"
               style={{
                 display: 'inline-block',
                 background: '#111',
                 border: '1px solid #dc2626',
                 padding: '1rem 2rem',
                 borderRadius: '12px',
                 color: '#fff',
                 textDecoration: 'none',
                 fontWeight: 600,
                 transition: 'all 0.3s'
               }}
               onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
               onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              Preuzmi za iOS
            </a>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer style={{
        background: darkMode ? '#0a0a0a' : '#111',
        color: '#fff',
        padding: '4rem 2rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #dc2626, #ef4444, #dc2626)',
          backgroundSize: '200% 100%',
          animation: 'gradient 3s ease infinite'
        }} />


        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Logo & Description */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <img src="/logo.png" alt="KBK Princip" style={{ height: '40px', width: 'auto' }} />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>KBK PRINCIP</span>
            </div>
            <p style={{ color: '#999', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Elitni kickboxing klub u srcu Beograda. Pridružite se pobedničkom timu i ostvarite svoje ciljeve.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Brzi linkovi</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Početna', 'O nama', 'Programi', 'Treneri', 'Kontakt'].map(link => (
                <li key={link} style={{ marginBottom: '0.5rem' }}>
                  <a
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    style={{
                      color: '#999',
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                      fontSize: '0.95rem'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                    onMouseLeave={e => e.currentTarget.style.color = '#999'}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Kontakt</h4>
            <div style={{ color: '#999', fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>📍 Bulevar Kralja Aleksandra 123</p>
              <p style={{ marginBottom: '0.5rem' }}>📞 +381 11 234 5678</p>
              <p style={{ marginBottom: '0.5rem' }}>📧 info@kbkprincip.rs</p>
              <p>⏰ Pon-Pet: 08:00 - 22:00</p>
            </div>
          </div>

          {/* Download App */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Preuzmite aplikaciju</h4>
            <p style={{ color: '#999', marginBottom: '1rem', fontSize: '0.95rem' }}>
              Skenirajte QR kod i evidentirajte treninge
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="https://play.google.com/store"
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{
                   display: 'inline-block',
                   transition: 'all 0.3s',
                   textDecoration: 'none'
                 }}
                 onMouseEnter={e => {
                   e.currentTarget.style.transform = 'translateX(5px)';
                   e.currentTarget.style.filter = 'brightness(1.2)';
                 }}
                 onMouseLeave={e => {
                   e.currentTarget.style.transform = 'translateX(0)';
                   e.currentTarget.style.filter = 'brightness(1)';
                 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                     alt="Get it on Google Play"
                     style={{ height: '40px', width: 'auto' }} />
              </a>
              <a href="https://apps.apple.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{
                   display: 'inline-block',
                   transition: 'all 0.3s',
                   textDecoration: 'none'
                 }}
                 onMouseEnter={e => {
                   e.currentTarget.style.transform = 'translateX(5px)';
                   e.currentTarget.style.filter = 'brightness(1.2)';
                 }}
                 onMouseLeave={e => {
                   e.currentTarget.style.transform = 'translateX(0)';
                   e.currentTarget.style.filter = 'brightness(1)';
                 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                     alt="Download on App Store"
                     style={{ height: '40px', width: 'auto' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          textAlign: 'center',
          color: '#666'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            © 2025 KBK Princip. Sva prava zadržana. | Dizajn i razvoj sa ❤️
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            {/* Social Media Icons */}
            <a href="#" style={{ color: '#999', transition: 'color 0.3s' }}
               onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
               onMouseLeave={e => e.currentTarget.style.color = '#999'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" style={{ color: '#999', transition: 'color 0.3s' }}
               onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
               onMouseLeave={e => e.currentTarget.style.color = '#999'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
            </a>
            <a href="#" style={{ color: '#999', transition: 'color 0.3s' }}
               onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
               onMouseLeave={e => e.currentTarget.style.color = '#999'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
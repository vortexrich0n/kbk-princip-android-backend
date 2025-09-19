'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                KBK PRINCIP
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-red-500 transition-colors">Početna</a>
              <a href="#about" className="hover:text-red-500 transition-colors">O Nama</a>
              <a href="#programs" className="hover:text-red-500 transition-colors">Programi</a>
              <a href="#app" className="hover:text-red-500 transition-colors">Aplikacija</a>
              <a href="#contact" className="hover:text-red-500 transition-colors">Kontakt</a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="hover:text-red-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>Početna</a>
                <a href="#about" className="hover:text-red-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>O Nama</a>
                <a href="#programs" className="hover:text-red-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>Programi</a>
                <a href="#app" className="hover:text-red-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>Aplikacija</a>
                <a href="#contact" className="hover:text-red-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>Kontakt</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1920')"
          }}
        ></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              GDE SE KUJU
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              ŠAMPIONI
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Pridruži se elitnoj kickboxing zajednici. Profesionalni treninzi,
            moderna oprema i treneri sa međunarodnim iskustvom.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#app"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              Preuzmite Aplikaciju
            </a>
            <a
              href="#contact"
              className="border-2 border-white/50 hover:bg-white hover:text-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Kontaktirajte Nas
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Zašto <span className="text-red-500">KBK Princip?</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-black/30 rounded-xl border border-gray-800 hover:border-red-500 transition-colors">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3">Profesionalni Treneri</h3>
              <p className="text-gray-400">Treneri sa dugogodišnjim iskustvom i međunarodnim sertifikatima</p>
            </div>

            <div className="text-center p-6 bg-black/30 rounded-xl border border-gray-800 hover:border-red-500 transition-colors">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-xl font-bold mb-3">Moderna Oprema</h3>
              <p className="text-gray-400">Najnovija oprema za trening i potpuno opremljena sala</p>
            </div>

            <div className="text-center p-6 bg-black/30 rounded-xl border border-gray-800 hover:border-red-500 transition-colors">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-3">Digitalno Praćenje</h3>
              <p className="text-gray-400">Pratite napredak kroz našu mobilnu aplikaciju</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Naši <span className="text-red-500">Programi</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-red-400">Početnici</h3>
              <p className="text-gray-300 mb-4">Idealno za one koji tek počinju svoju kickboxing avanturu</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Osnove kickboxa</li>
                <li>✓ Kondicioni treninzi</li>
                <li>✓ 3x nedeljno</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-red-400">Napredni</h3>
              <p className="text-gray-300 mb-4">Za iskusne borce koji žele da usavrše tehniku</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Napredne tehnike</li>
                <li>✓ Sparing sesije</li>
                <li>✓ 5x nedeljno</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-red-400">Takmičari</h3>
              <p className="text-gray-300 mb-4">Priprema za profesionalna takmičenja</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Individualni pristup</li>
                <li>✓ Priprema za mečeve</li>
                <li>✓ 6x nedeljno</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-red-400">Deca</h3>
              <p className="text-gray-300 mb-4">Bezbedni treninzi prilagođeni deci od 7 godina</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Razvoj motorike</li>
                <li>✓ Disciplina i poštovanje</li>
                <li>✓ 2x nedeljno</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-red-400">Fitness Kickbox</h3>
              <p className="text-gray-300 mb-4">Kombinacija kickboxa i fitnes treninga</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Mršavljenje</li>
                <li>✓ Kardio trenizi</li>
                <li>✓ 3x nedeljno</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-red-400">Personal</h3>
              <p className="text-gray-300 mb-4">Individualni treninzi sa personalnim trenerom</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ 1 na 1 treninzi</li>
                <li>✓ Prilagođen program</li>
                <li>✓ Fleksibilno vreme</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section id="app" className="py-20 px-4 bg-gradient-to-r from-red-900/20 to-black/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Preuzmite Našu <span className="text-red-500">Aplikaciju</span>
          </h2>

          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Evidentirajte dolazke, pratite napredak i budite u toku sa svim novostima kluba.
            QR check-in sistem za brzu prijavu na treninge.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:scale-105 transition-transform"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-16 w-auto"
              />
            </a>

            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:scale-105 transition-transform"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                className="h-16 w-auto"
              />
            </a>
          </div>

          <div className="mt-12 p-6 bg-black/50 rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold mb-4">Funkcionalnosti Aplikacije:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <span className="text-gray-300">QR kod za brzu prijavu</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <span className="text-gray-300">Praćenje napretka</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <span className="text-gray-300">Raspored treninga</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <span className="text-gray-300">Lični rekordi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-red-500">10+</div>
              <div className="text-gray-400 mt-2">Godina Iskustva</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-red-500">500+</div>
              <div className="text-gray-400 mt-2">Aktivnih Članova</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-red-500">50+</div>
              <div className="text-gray-400 mt-2">Šampiona</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-red-500">1000+</div>
              <div className="text-gray-400 mt-2">Transformacija</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Kontaktirajte <span className="text-red-500">Nas</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold mb-2">Lokacija</h3>
              <p className="text-gray-400">Bulevar Oslobođenja 123<br />Novi Sad, Srbija</p>
            </div>

            <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-bold mb-2">Telefon</h3>
              <p className="text-gray-400">+381 21 123 456<br />+381 65 123 4567</p>
            </div>

            <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-gray-400">info@kbkprincip.rs<br />admin@kbkprincip.rs</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Prvi Trening je BESPLATAN!</h3>
            <p className="mb-6">Dođite i uverite se u kvalitet naših treninga</p>
            <a
              href="tel:+381211234567"
              className="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Pozovite Odmah
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-red-500">KBK PRINCIP</h3>
              <p className="text-gray-400 text-sm mt-1">Gde se kuju šampioni</p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© 2024 KBK Princip. Sva prava zadržana.</p>
              <div className="mt-2">
                <Link href="/admin-panel" className="text-gray-600 hover:text-gray-400 text-xs">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
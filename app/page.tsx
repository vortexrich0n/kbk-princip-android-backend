"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Users,
  Clock,
  Target,
  Dumbbell,
  Heart,
  Shield,
  Award,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Calendar,
  QrCode,
  Menu,
  X
} from "lucide-react";
import { useRef, useState } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="relative min-h-screen w-full" ref={containerRef}>
      {/* Navigation for desktop */}
      <nav className="fixed top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">
              KBK <span className="text-red-500">PRINCIP</span>
            </h1>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-white/80 hover:text-white transition-colors">Početna</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">O Nama</a>
              <a href="#programs" className="text-white/80 hover:text-white transition-colors">Programi</a>
              <a href="#stats" className="text-white/80 hover:text-white transition-colors">Rezultati</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Kontakt</a>
              <a href="#app" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
                Preuzmite Aplikaciju
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Početna</a>
                <a href="#about" className="text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(false)}>O Nama</a>
                <a href="#programs" className="text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Programi</a>
                <a href="#stats" className="text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Rezultati</a>
                <a href="#contact" className="text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Kontakt</a>
                <a href="#app" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                  Preuzmite Aplikaciju
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-0 w-full h-full"
        >
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=3000')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 flex items-center justify-center min-h-screen px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center w-full max-w-4xl"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-white">KBK</span>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-2 text-white tracking-tighter">
              <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                PRINCIP
              </span>
            </h1>
            <p className="text-base md:text-lg text-red-400 mb-2 font-bold tracking-[0.2em] uppercase">
              KICKBOXING KLUB
            </p>
            <p className="text-sm md:text-base text-gray-300 mb-8 px-4 max-w-2xl mx-auto">
              Gde se kuju šampioni. Pridruži se elitnoj zajednici boraca.
            </p>

            {/* App Download Section - Prominently displayed */}
            <div id="app" className="mb-8 p-8 bg-black/50 backdrop-blur-md rounded-2xl border border-white/20">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Preuzmite Našu Aplikaciju
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Pratite treninge, evidentirajte dolazke i budite u toku sa svim novostima
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-16 w-auto"
                  />
                </motion.a>

                <motion.a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="Download on the App Store"
                    className="h-16 w-auto"
                  />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Link
                href="/scan"
                className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl font-bold text-sm transition-all duration-500 flex items-center justify-center gap-2 shadow-2xl hover:shadow-red-500/25"
              >
                <QrCode className="w-4 h-4" />
                <span className="relative z-10">QR Check-In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>

              <a
                href="#contact"
                className="group relative overflow-hidden border-2 border-white/50 text-white px-6 py-4 rounded-xl font-bold text-sm hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center"
              >
                <span>Kontakt</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 md:py-24 bg-white dark:bg-gray-900 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-gradient-hero">
              Zašto Baš Mi?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-medium">
              Decenija iskustva u stvaranju šampiona
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Profesionalni Treneri",
                description: "Licencirani treneri sa međunarodnim iskustvom",
                icon: Trophy,
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500"
              },
              {
                title: "Moderna Oprema",
                description: "Najsavremenija oprema i prostorije",
                icon: Dumbbell,
                image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=500"
              },
              {
                title: "Fleksibilni Termini",
                description: "Treninzi prilagođeni vašem rasporedu",
                icon: Clock,
                image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=500"
              },
              {
                title: "Personalizovan Pristup",
                description: "Plan treninga kreiran samo za vas",
                icon: Target,
                image: "https://images.unsplash.com/photo-1517438322307-e67111335449?q=80&w=500"
              },
              {
                title: "Zajednica",
                description: "Porodica koja motiviše i podržava",
                icon: Users,
                image: "https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=500"
              },
              {
                title: "Dokazani Rezultati",
                description: "Stotine transformisanih života",
                icon: Award,
                image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="champion-card group hover-lift cursor-pointer"
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  </div>
                  <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[240px]">
                    <div className="bg-red-500/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-200 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section id="programs" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-gradient-hero">
              Programi Treninga
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-medium">
              Od početnika do profesionalaca
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Početnici",
                time: "3x nedeljno",
                focus: "Osnove tehnike",
                intensity: 1,
                color: "from-green-400 to-green-600"
              },
              {
                name: "Srednji nivo",
                time: "4x nedeljno",
                focus: "Tehnika i snaga",
                intensity: 2,
                color: "from-blue-400 to-blue-600"
              },
              {
                name: "Napredni",
                time: "5x nedeljno",
                focus: "Takmičenja",
                intensity: 3,
                color: "from-purple-400 to-purple-600"
              },
              {
                name: "Kids",
                time: "2x nedeljno",
                focus: "Zabava i disciplina",
                intensity: 1,
                color: "from-yellow-400 to-orange-500"
              }
            ].map((program, index) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card hover-lift cursor-pointer overflow-hidden group"
              >
                <div className={`h-3 bg-gradient-to-r ${program.color} group-hover:h-4 transition-all duration-300`} />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{program.name}</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{program.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">{program.focus}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 w-full rounded-full",
                          i < program.intensity
                            ? `bg-gradient-to-r ${program.color}`
                            : "bg-gray-200 dark:bg-gray-700"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1517438322307-e67111335449?q=80&w=2000')"
            }}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10+", label: "Godina Iskustva" },
              { number: "500+", label: "Aktivnih Članova" },
              { number: "50+", label: "Šampiona" },
              { number: "1000+", label: "Transformacija" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-red-400 to-white bg-clip-text mb-2">
                  {stat.number}
                </h3>
                <p className="text-white text-sm md:text-base font-semibold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-gradient-hero">
              Kontakt & Lokacija
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Lokacija</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bulevar Oslobođenja 123<br />
                21000 Novi Sad
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Clock className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Radno Vreme</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pon-Pet: 07:00 - 22:00<br />
                Subota: 09:00 - 20:00<br />
                Nedelja: 10:00 - 18:00
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Phone className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Kontakt</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tel: +381 21 123 456<br />
                Email: info@kbkprincip.rs
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="inline-block bg-gradient-to-r from-red-600 to-red-700 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Prvi Trening je BESPLATAN!</h3>
              <p className="text-white/90 mb-6">Dođite i uverite se u kvalitet naših treninga</p>
              <a
                href="tel:+381211234567"
                className="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                Pozovite Odmah
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-red-500">KBK PRINCIP</h3>
              <p className="text-gray-400 text-sm mt-1">Gde se kuju šampioni</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© 2024 KBK Princip. Sva prava zadržana.</p>
              <Link href="/admin-panel" className="text-gray-600 hover:text-gray-400 text-xs">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
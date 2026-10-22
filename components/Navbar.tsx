'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Image as ImageIcon, Home, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isSewa = pathname === '/sewa-kamera';
  const isFoto = pathname === '/jasa-foto';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0c0a09]/95 backdrop-blur-md border-b border-stone-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo Header (Aperture + Serif Fotonic + Photo & Video Project) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-900/90 border border-stone-800 flex items-center justify-center p-1.5 group-hover:border-[#dfc488]/60 transition-colors shrink-0">
              {/* Camera Aperture SVG */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full text-stone-200 group-hover:text-[#dfc488] transition-colors">
                <circle cx="12" cy="12" r="10" />
                <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
                <line x1="9.69" y1="8" x2="21.17" y2="8" />
                <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
                <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
                <line x1="14.31" y1="16" x2="2.83" y2="16" />
                <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-none group-hover:text-[#dfc488] transition-colors">
                Fotonic
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-stone-400 font-semibold mt-0.5 leading-none">
                PHOTO &amp; VIDEO PROJECT
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isHome
                  ? 'bg-[#dfc488]/15 text-[#faedd4] border border-[#dfc488]/30 shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
              }`}
            >
              <Home className="w-4 h-4" />
              Beranda
            </Link>

            <Link
              href="/sewa-kamera"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isSewa
                  ? 'bg-[#6ee7b7]/15 text-[#86efac] border border-[#6ee7b7]/30 shadow-sm'
                  : 'text-stone-400 hover:text-[#86efac] hover:bg-stone-900/60'
              }`}
            >
              <Camera className="w-4 h-4" />
              Sewa Kamera &amp; Gear
            </Link>

            <Link
              href="/jasa-foto"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isFoto
                  ? 'bg-[#dfc488]/15 text-[#faedd4] border border-[#dfc488]/30 shadow-sm'
                  : 'text-stone-400 hover:text-[#dfc488] hover:bg-stone-900/60'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Jasa Foto &amp; Video
            </Link>
          </nav>

          {/* Right Action: Instagram Icon & Quick Switcher (NO WA ICON) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Switcher (Desktop) */}
            <div className="hidden lg:flex items-center">
              {isSewa && (
                <Link
                  href="/jasa-foto"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#dfc488]/15 hover:bg-[#dfc488]/25 border border-[#dfc488]/40 text-[#faedd4] transition-all group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#dfc488]" />
                  <span>Beralih ke Jasa Foto</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              {isFoto && (
                <Link
                  href="/sewa-kamera"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#6ee7b7]/15 hover:bg-[#6ee7b7]/25 border border-[#6ee7b7]/40 text-[#86efac] transition-all group"
                >
                  <Camera className="w-3.5 h-3.5 text-[#6ee7b7]" />
                  <span>Beralih ke Sewa Kamera</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>

            {/* Instagram Circle Button (As in Image 1, NO WA ICON) */}
            <a
              href="https://instagram.com/fotonicproject"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-all shadow-sm active:scale-95"
              aria-label="Instagram @fotonicproject"
              title="Instagram @fotonicproject"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 border border-stone-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-800 bg-[#0c0a09]/98 backdrop-blur-xl px-4 pt-2 pb-5 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${
              isHome ? 'bg-[#dfc488]/15 text-[#faedd4] border border-[#dfc488]/30' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Home className="w-4 h-4 text-[#dfc488]" />
            Beranda Utama
          </Link>

          <Link
            href="/sewa-kamera"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${
              isSewa ? 'bg-[#6ee7b7]/15 text-[#86efac] border border-[#6ee7b7]/30' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Camera className="w-4 h-4 text-[#6ee7b7]" />
            Sewa Kamera &amp; Gear
          </Link>

          <Link
            href="/jasa-foto"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${
              isFoto ? 'bg-[#dfc488]/15 text-[#faedd4] border border-[#dfc488]/30' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#dfc488]" />
            Jasa Foto &amp; Video
          </Link>

          <div className="pt-2 border-t border-stone-800/80">
            {isSewa && (
              <Link
                href="/jasa-foto"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#dfc488] via-[#cca862] to-[#b89148] text-stone-950 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Beralih ke Jasa Foto ➜
              </Link>
            )}
            {isFoto && (
              <Link
                href="/sewa-kamera"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#86efac] via-[#6ee7b7] to-[#34d399] text-stone-950 shadow-md"
              >
                <Camera className="w-4 h-4" />
                Beralih ke Sewa Kamera ➜
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

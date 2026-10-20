'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Image, Home, ArrowRight, Menu, X, PhoneCall, Sparkles } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY } from '@/lib/whatsapp';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isSewa = pathname === '/sewa-kamera';
  const isFoto = pathname === '/jasa-foto';

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-emerald-500 to-teal-400 p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Camera className="w-5 h-5 text-emerald-400 group-hover:text-purple-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-purple-400 transition-all">
                  FOTONIC
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Rental Gear & Photography Service</p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isHome
                  ? 'bg-slate-800/80 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Home className="w-4 h-4" />
              Beranda
            </Link>

            <Link
              href="/sewa-kamera"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isSewa
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/20'
              }`}
            >
              <Camera className="w-4 h-4" />
              Sewa Kamera & Gear
            </Link>

            <Link
              href="/jasa-foto"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isFoto
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:text-purple-400 hover:bg-purple-950/20'
              }`}
            >
              <Image className="w-4 h-4" />
              Jasa Foto & Video
            </Link>
          </nav>

          {/* Right Action: Quick Switcher Button */}
          <div className="hidden lg:flex items-center gap-3">
            {isSewa && (
              <Link
                href="/jasa-foto"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:text-white transition-all shadow-lg shadow-purple-950/20 group"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Beralih ke Jasa Foto</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            {isFoto && (
              <Link
                href="/sewa-kamera"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-white transition-all shadow-lg shadow-emerald-950/20 group"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Beralih ke Sewa Kamera</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            {isHome && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                <span>WA Admin: <strong className="text-white font-mono">{ADMIN_WHATSAPP_DISPLAY}</strong></span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-2 pb-5 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isHome ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Home className="w-4 h-4 text-slate-400" />
            Beranda Utama
          </Link>

          <Link
            href="/sewa-kamera"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isSewa ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            Sewa Kamera & Gear
          </Link>

          <Link
            href="/jasa-foto"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isFoto ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Image className="w-4 h-4 text-purple-400" />
            Jasa Foto & Video
          </Link>

          <div className="pt-2 border-t border-slate-800/80">
            {isSewa && (
              <Link
                href="/jasa-foto"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                Beralih ke Jasa Foto ➜
              </Link>
            )}
            {isFoto && (
              <Link
                href="/sewa-kamera"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-lg"
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

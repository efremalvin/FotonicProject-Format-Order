'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Camera, Image as ImageIcon, Home, ArrowRight, Menu, X, PhoneCall, Sparkles } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY } from '@/lib/whatsapp';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isSewa = pathname === '/sewa-kamera';
  const isFoto = pathname === '/jasa-foto';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0c0a09]/90 backdrop-blur-md border-b border-amber-950/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo Header */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-8 sm:h-9 w-28 sm:w-32 flex items-center">
              <Image 
                src="/images/logo-white.png" 
                alt="Fotonic Logo" 
                width={140} 
                height={40} 
                className="object-contain w-auto h-7 sm:h-8 group-hover:brightness-110 transition-all"
                priority
              />
            </div>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Studio
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isHome
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
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
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-stone-400 hover:text-emerald-400 hover:bg-emerald-950/20'
              }`}
            >
              <Camera className="w-4 h-4" />
              Sewa Kamera & Gear
            </Link>

            <Link
              href="/jasa-foto"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isFoto
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-stone-400 hover:text-amber-400 hover:bg-amber-950/20'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Jasa Foto & Video
            </Link>
          </nav>

          {/* Right Action: Quick Switcher Button */}
          <div className="hidden lg:flex items-center gap-3">
            {isSewa && (
              <Link
                href="/jasa-foto"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 hover:text-white transition-all shadow-lg shadow-amber-950/20 group"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 border border-amber-900/40 text-[11px] text-stone-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin WA: <strong className="text-white font-mono">{ADMIN_WHATSAPP_DISPLAY}</strong></span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 border border-stone-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-amber-950/40 bg-[#0c0a09]/95 backdrop-blur-xl px-4 pt-2 pb-5 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isHome ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Home className="w-4 h-4 text-amber-400" />
            Beranda Utama
          </Link>

          <Link
            href="/sewa-kamera"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isSewa ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            Sewa Kamera & Gear
          </Link>

          <Link
            href="/jasa-foto"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isFoto ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            Jasa Foto & Video
          </Link>

          <div className="pt-2 border-t border-stone-800/80">
            {isSewa && (
              <Link
                href="/jasa-foto"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-amber-600 text-stone-950 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                Beralih ke Jasa Foto ➜
              </Link>
            )}
            {isFoto && (
              <Link
                href="/sewa-kamera"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-stone-950 shadow-lg"
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

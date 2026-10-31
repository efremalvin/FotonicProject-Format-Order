'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '@/components/icons/SocialIcons';
import { siteConfig } from '@/lib/site';
import { getGeneralChatLink } from '@/lib/whatsapp';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isSewa = pathname === '/sewa-kamera';
  const isFoto = pathname === '/jasa-foto';

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/95 sm:bg-ink/80 sm:backdrop-blur-xl">
      <nav className="mx-auto flex h-16 sm:h-[72px] max-w-6xl items-center justify-between px-4 sm:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-90 shrink-0"
          aria-label="Fotonic — kembali ke beranda"
        >
          <div className="relative size-8 sm:size-9 overflow-hidden rounded-full border border-gold/40 bg-gold/10 p-1 sm:p-1.5 transition duration-500 group-hover:rotate-90 group-hover:bg-gold/20 shrink-0">
            <Image
              src="/images/aperture-white.png"
              alt="Fotonic Shutter Icon"
              width={36}
              height={36}
              priority
              className="size-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="block font-display text-base sm:text-xl font-bold leading-tight tracking-wide text-white">
              {siteConfig.name}
            </span>
            <span className="block text-[8px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-zinc-400 leading-tight mt-0.5">
              {siteConfig.subtitle}
            </span>
          </div>
        </Link>

        {/* Quick Nav Anchor (Desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className={`text-xs uppercase tracking-widest transition ${
              isHome ? 'text-gold font-semibold' : 'text-zinc-400 hover:text-gold'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/sewa-kamera"
            className={`text-xs uppercase tracking-widest transition ${
              isSewa ? 'text-gold font-semibold' : 'text-zinc-400 hover:text-gold'
            }`}
          >
            Sewa Kamera
          </Link>
          <Link
            href="/jasa-foto"
            className={`text-xs uppercase tracking-widest transition ${
              isFoto ? 'text-gold font-semibold' : 'text-zinc-400 hover:text-gold'
            }`}
          >
            Jasa Foto
          </Link>
        </div>

        {/* Action Buttons - Simpel & Minimalis */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${siteConfig.instagram.handle}`}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-gold/50 hover:bg-gold/10 hover:text-white"
          >
            <InstagramIcon size={16} className="text-zinc-300 hover:text-white" />
          </a>
          <a
            href={getGeneralChatLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reservasi WhatsApp Fotonic"
            title="Reservasi via WhatsApp"
            className="flex size-9 items-center justify-center rounded-full bg-wa text-black shadow-lg shadow-wa/20 transition hover:brightness-110 active:scale-95"
          >
            <WhatsAppIcon size={17} />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-gold/50 hover:bg-gold/10 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-ink/98 backdrop-blur-xl px-4 py-3 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs uppercase tracking-widest transition ${
              isHome ? 'text-gold font-semibold bg-white/[0.04]' : 'text-zinc-400 hover:text-gold'
            }`}
          >
            <span>Beranda</span>
            {isHome && <span className="size-1.5 rounded-full bg-gold" />}
          </Link>
          <Link
            href="/sewa-kamera"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs uppercase tracking-widest transition ${
              isSewa ? 'text-gold font-semibold bg-white/[0.04]' : 'text-zinc-400 hover:text-gold'
            }`}
          >
            <span>Sewa Kamera &amp; Gear</span>
            {isSewa && <span className="size-1.5 rounded-full bg-gold" />}
          </Link>
          <Link
            href="/jasa-foto"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs uppercase tracking-widest transition ${
              isFoto ? 'text-gold font-semibold bg-white/[0.04]' : 'text-zinc-400 hover:text-gold'
            }`}
          >
            <span>Jasa Foto &amp; Video</span>
            {isFoto && <span className="size-1.5 rounded-full bg-gold" />}
          </Link>
        </div>
      )}
    </header>
  );
}

import React from 'react';
import Link from 'next/link';
import { Camera, Image as ImageIcon, Phone } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer className="mt-14 sm:mt-20 border-t border-stone-850 bg-[#0a0807] text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Brand & Tagline */}
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">FOTONIC</span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                Creative Studio & Equipment
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Sewa Kamera Nikon Z50 Mark II & Jasa Foto Wisuda/Sidang Terpercaya.
            </p>
          </div>

          {/* Quick Links & WhatsApp */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/sewa-kamera" className="hover:text-emerald-400 transition-colors">
              Sewa Kamera
            </Link>
            <span className="text-stone-700">•</span>
            <Link href="/jasa-foto" className="hover:text-amber-400 transition-colors">
              Jasa Foto
            </Link>
            <span className="text-stone-700">•</span>
            <a 
              href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-amber-400 font-mono font-bold hover:underline"
            >
              WA: {ADMIN_WHATSAPP_DISPLAY}
            </a>
          </div>

        </div>

        {/* Copyright notice (Dipertahankan) */}
        <div className="mt-6 pt-5 border-t border-stone-900/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-400 text-[11px]">
          <p>&copy; {new Date().getFullYear()} Fotonic. All rights reserved.</p>
          <p className="text-stone-400">Yogyakarta & Bandar Lampung (Area Kampus Unila)</p>
        </div>
      </div>
    </footer>
  );
}

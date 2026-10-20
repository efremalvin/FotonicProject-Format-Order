import React from 'react';
import Link from 'next/link';
import { Camera, Image, ShieldCheck, Clock, MapPin, Phone } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-purple-600 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Camera className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">FOTONIC</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Creative studio & equipment rental terpercaya untuk mahasiswa dan kreator konten. Menyediakan sewa kamera mirrorless berkualitas dan jasa dokumentasi wisuda, seminar, serta momen berharga Anda dengan standar profesional.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Fast Response Admin WhatsApp: </span>
              <a 
                href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-400 font-bold font-mono hover:underline"
              >
                {ADMIN_WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Layanan Utama</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/sewa-kamera" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rental Nikon Z50 Mark II</span>
                </Link>
              </li>
              <li>
                <Link href="/sewa-kamera" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sewa Lensa Viltrox 35mm</span>
                </Link>
              </li>
              <li>
                <Link href="/jasa-foto" className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                  <Image className="w-3.5 h-3.5 text-purple-400" />
                  <span>Foto Wisuda Single & Group</span>
                </Link>
              </li>
              <li>
                <Link href="/jasa-foto" className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                  <Image className="w-3.5 h-3.5 text-purple-400" />
                  <span>Dokumentasi Sempro & Sidang</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* S&K Ringkas */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Komitmen Pelayanan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Jaminan Identitas Asli (KTP / KTM) aman & transparan.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Fotografer hadir 15 menit sebelum waktu pemotretan.</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Melayani seluruh area kampus & spot fotografi Yogyakarta.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Fotonic Creative & Equipment. All rights reserved.</p>
          <p className="text-[11px] text-slate-600">Built with Next.js App Router, Tailwind CSS & TypeScript</p>
        </div>
      </div>
    </footer>
  );
}

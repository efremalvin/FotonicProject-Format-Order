import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Image as ImageIcon, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-14 overflow-hidden">
      
      {/* Dark Gold & Amber Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-36 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-36 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 left-1/3 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Simple & Clean Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          
          {/* Logo Brand Showcase */}
          <div className="flex justify-center mb-5">
            <Image
              src="/images/logo-white.png"
              alt="Fotonic Logo"
              width={160}
              height={50}
              className="object-contain w-auto h-9 sm:h-11 drop-shadow"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-amber-900/40 text-xs text-amber-300 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">Layanan Kreatif Fotografi & Rental Kamera</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Pilih Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">Fotonic</span>
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Silakan pilih modul kebutuhan Anda di bawah ini untuk melihat rincian katalog, pricelist resmi, dan formulir pemesanan langsung ke WhatsApp admin.
          </p>
        </div>

        {/* 2 Simple & Clean Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          
          {/* CARD 1: SEWA KAMERA & GEAR */}
          <Link
            href="/sewa-kamera"
            className="group relative rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-emerald-500/50 p-6 sm:p-7 shadow-xl transition-all duration-300 hover:shadow-emerald-950/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                  Unit Siap Pakai
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Sewa Kamera & Gear
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-5">
                Rental mirrorless <strong>Nikon Z50 Mark II</strong> dan lensa Viltrox 35mm f/1.7. Pilihan durasi Short Time (4 Jam), Setengah Hari, hingga 24 Jam. Gratis antar area Unila.
              </p>

              <div className="space-y-2 text-xs text-stone-300 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Paket Komplit, Single Lens, & Lensa Saja</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Termasuk 2 Baterai, SD Card 32GB & Tas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Jaminan 1 Identitas Fisik Asli (KTP / KTM)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Buka Formulir Sewa Kamera</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* CARD 2: ORDER JASA FOTO & VIDEO (DARK GOLD AMBER THEME) */}
          <Link
            href="/jasa-foto"
            className="group relative rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 p-6 sm:p-7 shadow-xl transition-all duration-300 hover:shadow-amber-950/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2.5 py-0.5 rounded-full">
                  Pricelist Resmi
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Order Jasa Foto & Video
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-5">
                Dokumentasi wisuda personal, rombongan sahabat, sempro, dan sidang skripsi. Color grading estetik dengan seluruh file RAW & JPG via Google Drive.
              </p>

              <div className="space-y-2 text-xs text-stone-300 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Kategori: Single, Group Sahabat, & Sidang/Sempro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Semua File RAW & JPG via Google Drive</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Promo Free Cinematic Reels & Express Editing 50k</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs sm:text-sm font-bold text-amber-400 group-hover:text-amber-300">
              <span>Buka Pricelist & Booking Sesi Foto</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

        </div>

        {/* Minimal Value Bar */}
        <div className="mt-8 p-4 rounded-xl bg-stone-900/50 border border-stone-800/70 flex flex-wrap items-center justify-around gap-4 text-center text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Jaminan Aman 1 Identitas Fisik</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>DP Booking Pasti Rp 50.000</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Free Antar Area Kampus Unila</span>
          </div>
        </div>

      </div>

    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Image as ImageIcon, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Clock, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-14 overflow-hidden">
      
      {/* Warm Luxury Gold & Rich Emerald Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-36 w-80 h-80 bg-[#c89343]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-36 w-80 h-80 bg-[#10b981]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 left-1/3 w-96 h-96 bg-[#be873b]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Simple & Clean Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          
          {/* Official Brand Identity Header in Hero */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative h-14 sm:h-18 w-56 sm:w-64 flex items-center justify-center mb-1">
              <Image
                src="/images/fotonic-logo-official.png"
                alt="Fotonic Photo & Video Project"
                width={260}
                height={85}
                className="object-contain w-auto h-12 sm:h-16 drop-shadow-md"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-[11px] sm:text-xs text-[#f2cf83] mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#e5b869]" />
            <span>Layanan Kreatif Fotografi &amp; Rental Kamera</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Pilih Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2cf83] via-[#d9a756] to-[#be873b]">Fotonic</span>
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto px-2">
            Silakan pilih modul kebutuhan Anda di bawah ini untuk melihat rincian katalog, pricelist resmi, dan formulir pemesanan.
          </p>
        </div>

        {/* 2 Simple & Clean Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          
          {/* CARD 1: SEWA KAMERA & GEAR (RICH GREEN GRADIENT) */}
          <Link
            href="/sewa-kamera"
            className="group relative rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-[#10b981]/60 p-5 sm:p-7 shadow-xl transition-all duration-300 hover:shadow-[#10b981]/15 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#10b981]/15 border border-[#10b981]/35 flex items-center justify-center text-[#34d399] group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#34d399] bg-[#10b981]/15 border border-[#10b981]/30 px-2.5 py-0.5 rounded-full">
                  Unit Siap Pakai
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 group-hover:text-[#34d399] transition-colors">
                Sewa Kamera &amp; Gear
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                Rental mirrorless <strong>Nikon Z50 Mark II</strong> dan lensa Viltrox 35mm f/1.7. Pilihan durasi Short Time (4 Jam), Setengah Hari, hingga 24 Jam. Gratis antar area Unila.
              </p>

              <div className="space-y-2 text-xs text-stone-300 mb-5 sm:mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Paket Komplit, Single Lens, &amp; Lensa Saja</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Termasuk 2 Baterai, SD Card 32GB &amp; Tas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Jaminan 1 Identitas Fisik Asli (KTP / KTM)</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-stone-800/80 flex items-center justify-between text-xs sm:text-sm font-bold text-[#34d399] group-hover:text-white transition-colors">
              <span>Buka Formulir Sewa Kamera</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* CARD 2: ORDER JASA FOTO & VIDEO (WARM LUXURY GOLD GRADIENT) */}
          <Link
            href="/jasa-foto"
            className="group relative rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-[#d6a350]/60 p-5 sm:p-7 shadow-xl transition-all duration-300 hover:shadow-[#d6a350]/15 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#c89343]/15 border border-[#c89343]/35 flex items-center justify-center text-[#e5b869] group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#f2cf83] bg-[#c89343]/15 border border-[#c89343]/30 px-2.5 py-0.5 rounded-full">
                  Pricelist Resmi
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 group-hover:text-[#e5b869] transition-colors">
                Order Jasa Foto &amp; Video
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                Dokumentasikan wisuda personal, rombongan sahabat, sempro, dan sidang skripsi. Color grading estetik dengan seluruh file RAW &amp; JPG via Google Drive.
              </p>

              <div className="space-y-2 text-xs text-stone-300 mb-5 sm:mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e5b869] shrink-0" />
                  <span>Kategori: Single, Group Sahabat, &amp; Sidang/Sempro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e5b869] shrink-0" />
                  <span>Semua File RAW &amp; JPG via Google Drive</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e5b869] shrink-0" />
                  <span>Promo Free Cinematic Reels &amp; Express Editing 50k</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-stone-800/80 flex items-center justify-between text-xs sm:text-sm font-bold text-[#e5b869] group-hover:text-white transition-colors">
              <span>Buka Pricelist &amp; Booking Sesi Foto</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

        </div>

        {/* Minimal Value Bar */}
        <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 rounded-xl bg-stone-900/50 border border-stone-800/70 flex flex-wrap items-center justify-around gap-3 text-center text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#e5b869]" />
            <span>Jaminan 1 Identitas Fisik</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#34d399]" />
            <span>DP Booking Rp 50.000</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#e5b869]" />
            <span>Free Antar Area Kampus Unila</span>
          </div>
        </div>

      </div>

    </div>
  );
}

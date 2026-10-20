import React from 'react';
import Link from 'next/link';
import { Camera, Image, ArrowRight, ShieldCheck, Sparkles, Clock, CheckCircle2, Star, Zap } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs sm:text-sm font-semibold text-slate-300 mb-5 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Fotonic Creative Hub — Pilih Layanan Kebutuhan Anda</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Abadikan Momen Berharga Bersama{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400">
              Fotonic
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Solusi satu atap untuk kebutuhan visual Anda. Sewa kamera mirrorless kualitas prima atau booking fotografer profesional untuk wisuda dan sidang dengan sistem order cepat via WhatsApp.
          </p>
        </div>

        {/* 2 Main Hero Cards (Split-Screen Modern Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* CARD 1: SEWA KAMERA & GEAR */}
          <div className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 p-7 sm:p-9 shadow-2xl transition-all duration-300 hover:border-emerald-500/60 hover:shadow-emerald-950/30 flex flex-col justify-between overflow-hidden">
            
            {/* Top Glow Accent on Hover */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl group-hover:bg-emerald-500/25 transition-all"></div>

            <div className="relative z-10">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Unit Ready
                </span>
              </div>

              {/* Title & Desc */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                Sewa Kamera & Gear
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Rental mirrorless <strong>Nikon Z50 Mark II</strong> dan lensa fix bokeh tajam. Tersedia durasi Short Time (4 Jam), Setengah Hari, hingga Full Day 24 Jam dengan aksesoris lengkap siap pakai.
              </p>

              {/* Feature Points */}
              <div className="space-y-2.5 mb-8">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Nikon Z50 Mark II + Lensa Kit & Lensa Fix Viltrox 35mm f/1.7</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Include 2x Baterai, SD Card Lexar, Card Reader, & Tas Kamera</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tarif hemat mulai <strong>Rp 25.000 / Rp 65.000</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Jaminan aman dengan KTP / Kartu Mahasiswa (KTM) Asli</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80">
              <Link
                href="/sewa-kamera"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-950/40 active:scale-[0.99] transition-all group-hover:gap-4"
              >
                <span>Buka Katalog & Form Rental Kamera</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </Link>
            </div>

          </div>

          {/* CARD 2: ORDER JASA FOTO & VIDEO */}
          <div className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 p-7 sm:p-9 shadow-2xl transition-all duration-300 hover:border-purple-500/60 hover:shadow-purple-950/30 flex flex-col justify-between overflow-hidden">
            
            {/* Top Glow Accent on Hover */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-purple-600/15 rounded-full blur-2xl group-hover:bg-purple-600/25 transition-all"></div>

            <div className="relative z-10">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Image className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  Slot Terbatas
                </span>
              </div>

              {/* Title & Desc */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-purple-300 transition-colors">
                Order Jasa Foto & Video
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Dokumentasi wisuda personal, rombongan sahabat, hingga momen yudisium dan seminar sidang skripsi. Hasil foto jernih, color grading estetik, dan file lengkap via Google Drive.
              </p>

              {/* Feature Points */}
              <div className="space-y-2.5 mb-8">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Kategori: Single Packet, Group Sahabat, & Sidang/Sempro</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>All Files RAW & JPG High-Res langsung via Google Drive</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Paket sidang mulai <strong>Rp 80.000</strong> & wisuda mulai <strong>Rp 100.000</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Layanan Add-On: Video Reels TikTok & Express One-Day Service</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80">
              <Link
                href="/jasa-foto"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-purple-950/40 active:scale-[0.99] transition-all group-hover:gap-4"
              >
                <span>Buka Pricelist & Form Booking Sesi Foto</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </Link>
            </div>

          </div>

        </div>

        {/* Value Trust Bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="font-extrabold text-xl text-white">100% Asli</div>
            <p className="text-xs text-slate-400">Jaminan KTP/KTM Dijamin Aman</p>
          </div>
          <div className="space-y-1">
            <div className="font-extrabold text-xl text-emerald-400">H-15 Menit</div>
            <p className="text-xs text-slate-400">Fotografer Standby Tepat Waktu</p>
          </div>
          <div className="space-y-1">
            <div className="font-extrabold text-xl text-purple-400">RAW & JPG</div>
            <p className="text-xs text-slate-400">Full Resolution via Cloud Drive</p>
          </div>
          <div className="space-y-1">
            <div className="font-extrabold text-xl text-amber-400">Instan WA</div>
            <p className="text-xs text-slate-400">Format Order Langsung ke Admin</p>
          </div>
        </div>

      </div>

    </div>
  );
}

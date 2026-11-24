import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const SERVICES = [
  {
    no: '01',
    href: '/sewa-kamera',
    title: 'Sewa Kamera & Gear',
    desc: 'Mirrorless Nikon Z50 Mark II dengan lensa Viltrox 35mm f/1.7. Durasi 4 jam, setengah hari, atau sehari penuh. Antar gratis ke area kampus Unila.',
    points: ['Paket komplit, single lens, atau lensa saja', '2 baterai, SD card 32GB, dan tas', 'Jaminan satu identitas asli (KTP / KTM)'],
    cta: 'Isi formulir sewa',
    accent: 'text-gold',
    hover: 'hover:border-gold/50',
  },
  {
    no: '02',
    href: '/jasa-foto',
    title: 'Jasa Foto & Video',
    desc: 'Dokumentasi wisuda, sempro, sidang, dan sesi bersama teman. Semua file RAW dan JPG dikirim lewat Google Drive.',
    points: ['Paket single, group, dan sidang', 'Edit pilihan sesuai paket', 'Cinematic reels gratis selama promo'],
    cta: 'Booking sesi foto',
    accent: 'text-gold',
    hover: 'hover:border-gold/50',
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-24">
      <header className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Fotonic · Format Order</p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.05] text-white">
          Mau sewa alat,
          <br />
          atau butuh fotografer?
        </h1>
        <p className="mt-5 text-sm sm:text-base leading-relaxed text-zinc-400">
          Pilih salah satu layanan, isi formulirnya, lalu pesanan terkirim langsung ke WhatsApp admin.
        </p>
      </header>

      <div className="mt-12 sm:mt-16 border-t border-white/10">
        {SERVICES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`group grid gap-4 sm:gap-8 border-b border-white/10 py-8 sm:py-10 sm:grid-cols-[4rem_1fr_auto] transition-colors ${s.hover}`}
          >
            <span className={`font-display text-2xl ${s.accent}`}>{s.no}</span>

            <div className="max-w-xl">
              <h2 className="font-display text-2xl sm:text-3xl text-white">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.desc}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-zinc-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <span className={`inline-flex items-center gap-1.5 self-start sm:self-center text-sm font-medium ${s.accent}`}>
              {s.cta}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

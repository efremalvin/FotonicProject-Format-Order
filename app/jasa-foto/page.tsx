'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Award, 
  Check, 
  Copy, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Cloud, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  Minus,
  Film,
  Zap
} from 'lucide-react';
import { FOTO_CATEGORIES, FOTO_PACKAGES, FOTO_BOOKING_RULES } from '@/data/fotoPricelist';
import { generateFotoWhatsAppUrl, formatRupiah, ADMIN_WHATSAPP_DISPLAY } from '@/lib/whatsapp';

export default function JasaFotoPage() {
  // Category & package
  const [selectedCategory, setSelectedCategory] = useState<'Single Packet' | 'Group / Family' | 'Seminar & Sidang'>('Single Packet');
  const [selectedPackageId, setSelectedPackageId] = useState('single-std');

  // Add-ons states
  const [cinematicReels, setCinematicReels] = useState(false);
  const [extraEdit1Count, setExtraEdit1Count] = useState(0);
  const [extraEdit5Count, setExtraEdit5Count] = useState(0);
  const [expressEdit, setExpressEdit] = useState(false);

  // Client Data
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [kampus, setKampus] = useState('');

  // 24-Hour time options
  const timeSlots24h = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '19:00', '20:00'
  ];

  // Date & Session
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  const defaultDateStr = defaultDate.toISOString().split('T')[0];

  const [tanggalSesi, setTanggalSesi] = useState(defaultDateStr);
  const [jamSesi, setJamSesi] = useState('09:00');
  const [lokasiTipe, setLokasiTipe] = useState('Area Kampus / Gedung Acara');
  const [lokasiDetail, setLokasiDetail] = useState('');
  const [jumlahOrang, setJumlahOrang] = useState('');
  const [catatanKhusus, setCatatanKhusus] = useState('');

  // Payment Scheme (DP wajib 50k atau lunas)
  const [skemaBayar, setSkemaBayar] = useState<'dp' | 'lunas'>('dp');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculations
  const currentPackage = FOTO_PACKAGES.find(p => p.id === selectedPackageId) || FOTO_PACKAGES[0];
  const basePrice = currentPackage.price;

  // Addons calculations
  const extra1Total = extraEdit1Count * 10000;
  const extra5Total = extraEdit5Count * 40000;
  const expressTotal = expressEdit ? 50000 : 0;
  const addonsTotal = extra1Total + extra5Total + expressTotal;

  const grandTotal = basePrice + addonsTotal;
  const dpAmount = 50000;
  const sisaPelunasan = Math.max(0, grandTotal - dpAmount);

  // Build active add-ons list for summary and WA
  const activeAddOnsList: { name: string; price: number; count?: number }[] = [];
  if (cinematicReels) {
    activeAddOnsList.push({ name: 'Cinematic Reels / TikTok Video', price: 0 });
  }
  if (extraEdit1Count > 0) {
    activeAddOnsList.push({ name: 'Xtra Edited 1 Foto', price: 10000, count: extraEdit1Count });
  }
  if (extraEdit5Count > 0) {
    activeAddOnsList.push({ name: 'Xtra Edited 5 Foto', price: 40000, count: extraEdit5Count });
  }
  if (expressEdit) {
    activeAddOnsList.push({ name: 'Express Edit (One Day Service 1x24 Jam)', price: 50000 });
  }

  const handleCategoryChange = (cat: 'Single Packet' | 'Group / Family' | 'Seminar & Sidang') => {
    setSelectedCategory(cat);
    const firstInCat = FOTO_PACKAGES.find(p => p.category === cat);
    if (firstInCat) {
      setSelectedPackageId(firstInCat.id);
    }
  };

  const handleKirimWA = () => {
    if (!nama.trim()) {
      alert('Mohon lengkapi Nama Lengkap Wisudawan/Klien terlebih dahulu.');
      return;
    }
    if (!kampus.trim()) {
      alert('Mohon lengkapi Asal Kampus / Instansi.');
      return;
    }
    if (!lokasiDetail.trim()) {
      alert('Mohon lengkapi Detail Titik Kumpul Lokasi Sesi Foto.');
      return;
    }

    const paymentText = skemaBayar === 'dp'
      ? `DP Booking : Rp 50.000 (Sisa pelunasan ${formatRupiah(sisaPelunasan)} pasca sesi)`
      : `Pembayaran Lunas : ${formatRupiah(grandTotal)} (Full Payment)`;

    const url = generateFotoWhatsAppUrl({
      nama,
      whatsapp,
      kampus,
      paketNama: currentPackage.name,
      paketKategori: currentPackage.category,
      paketHarga: currentPackage.price,
      durasi: currentPackage.duration,
      spotFoto: currentPackage.spots,
      editFoto: `Edit ${currentPackage.editedPhotos} Foto Pilihan`,
      fasilitas: currentPackage.includes,
      addOns: activeAddOnsList,
      totalHarga: grandTotal,
      skemaBayar: paymentText,
      tanggalSesi,
      jamSesi,
      lokasiTipe,
      lokasiDetail,
      jumlahOrang: jumlahOrang || 'Wisudawan & Pendamping',
      catatanKhusus: catatanKhusus || '-'
    });

    window.open(url, '_blank');
  };

  const handleSalinFormat = async () => {
    const addOnListText = activeAddOnsList.length > 0
      ? activeAddOnsList.map(a => {
          if (a.price === 0) return `• ${a.name} (Promo Free)`;
          if (a.count && a.count > 1) return `• ${a.name} x${a.count} (${formatRupiah(a.price * a.count)})`;
          return `• ${a.name} (${formatRupiah(a.price)})`;
        }).join('\n')
      : 'Tidak ada (Paket Utama Saja)';

    const paymentText = skemaBayar === 'dp'
      ? `DP Booking : Rp 50.000 (Sisa ${formatRupiah(sisaPelunasan)})`
      : `Lunas (${formatRupiah(grandTotal)})`;

    const text = 
`FORMAT BOOKING - JASA FOTO FOTONIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 DATA KLIEN :
• Nama : ${nama || '[Nama]'}
• WA : ${whatsapp || '[WhatsApp]'}
• Kampus : ${kampus || '-'}

📸 PAKET FOTO :
• Paket : ${currentPackage.name} (${formatRupiah(currentPackage.price)})
• Kategori : ${currentPackage.category}
• Durasi : ${currentPackage.duration}
• Spot : ${currentPackage.spots} | Edit : ${currentPackage.editedPhotos} Foto

✨ ADD-ON SERVICES :
${addOnListText}

🗓️ JADWAL & LOKASI :
• Tanggal : ${tanggalSesi} (${jamSesi} WIB)
• Lokasi : ${lokasiTipe} - ${lokasiDetail || '-'}

💰 TOTAL & SKEMA :
• Total : ${formatRupiah(grandTotal)}
• Skema : ${paymentText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    try {
      await navigator.clipboard.writeText(text);
      showToast('Format booking foto berhasil disalin ke clipboard!');
    } catch {
      showToast('Gagal menyalin format.');
    }
  };

  const handleReset = () => {
    if (confirm('Reset seluruh formulir booking foto?')) {
      setNama('');
      setWhatsapp('');
      setKampus('');
      setLokasiDetail('');
      setJumlahOrang('');
      setCatatanKhusus('');
      setSelectedCategory('Single Packet');
      setSelectedPackageId('single-std');
      setCinematicReels(false);
      setExtraEdit1Count(0);
      setExtraEdit5Count(0);
      setExpressEdit(false);
      setSkemaBayar('dp');
      showToast('Formulir berhasil di-reset.');
    }
  };

  const filteredPackages = FOTO_PACKAGES.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Page */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Fotonic Graduation & Sidang Photography</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Katalog & Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">Jasa Foto & Video</span>
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm sm:leading-relaxed">
          Dokumentasikan momen wisuda, yudisium, dan sidang skripsi Anda dengan karya visual berkelas. Pilih paket resmi, tentukan layanan add-on, dan kirim format order instan ke WhatsApp fotografer.
        </p>

        {/* Locked Official Admin Contact Badge */}
        <div className="mt-4 inline-flex items-center gap-2.5 bg-stone-900 border border-stone-800 rounded-full px-4 py-1.5 text-xs text-stone-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-stone-400">WhatsApp Admin Resmi:</span>
          <strong className="text-amber-400 font-mono tracking-wide">{ADMIN_WHATSAPP_DISPLAY}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Form & Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: Pilih Kategori & Paket Foto */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-7 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-stone-800">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
                1
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  Pilih Paket Foto Resmi
                </h2>
                <p className="text-[11px] sm:text-xs text-stone-400">Pilih kategori layanan dan paket durasi sesuai kebutuhan momen Anda</p>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Kategori Layanan <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {FOTO_CATEGORIES.map(cat => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500/50 text-white'
                          : 'border-stone-800 bg-stone-950/70 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                        {cat.id === 'Single Packet' && <User className="w-3.5 h-3.5 text-amber-400" />}
                        {cat.id === 'Group / Family' && <Users className="w-3.5 h-3.5 text-amber-400" />}
                        {cat.id === 'Seminar & Sidang' && <Award className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{cat.title}</span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1 line-clamp-1">{cat.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Packages List */}
            <div className="space-y-2.5 sm:space-y-3">
              <label className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Pilihan Paket dalam Kategori {selectedCategory} <span className="text-rose-400">*</span>
              </label>

              {filteredPackages.map(pkg => {
                const isSelected = pkg.id === selectedPackageId;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500/40'
                        : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          isSelected ? 'border-amber-500 bg-amber-500' : 'border-stone-700'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-stone-950 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-white">{pkg.name}</span>
                            {pkg.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap my-1.5">
                            <span className="text-[10px] sm:text-[11px] bg-stone-900 border border-stone-800 text-stone-300 px-2 py-0.5 rounded-md font-medium">
                              ⏱️ {pkg.duration}
                            </span>
                            <span className="text-[10px] sm:text-[11px] bg-stone-900 border border-stone-800 text-stone-300 px-2 py-0.5 rounded-md font-medium">
                              📍 {pkg.spots}
                            </span>
                            <span className="text-[10px] sm:text-[11px] bg-amber-950/50 border border-amber-900/60 text-amber-300 px-2 py-0.5 rounded-md font-medium">
                              🎨 Edit {pkg.editedPhotos} Foto
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-stone-400">{pkg.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-xs sm:text-base text-amber-400 font-mono">
                          {formatRupiah(pkg.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inclusions Box - Pose directing removed per user request */}
            <div className="mt-5 p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-2.5 text-xs text-stone-300">
              <Cloud className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Fasilitas Termasuk Bebas Biaya:</span>
                <p className="text-stone-400 mt-0.5 text-[11px] sm:text-xs">
                  Semua file RAW & JPG High-Resolution via Google Drive tanpa kompresi.
                </p>
              </div>
            </div>

          </section>

          {/* SECTION 2: Add-On Services */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-7 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-stone-800">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
                2
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  Layanan Tambahan (Add-On Services)
                </h2>
                <p className="text-[11px] sm:text-xs text-stone-400">Pilih layanan ekstra opsional untuk menyempurnakan hasil foto & video</p>
              </div>
            </div>

            <div className="space-y-3">
              
              {/* 1. Cinematic Reels (PROMO FREE) */}
              <div 
                onClick={() => setCinematicReels(!cinematicReels)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  cinematicReels
                    ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500/40'
                    : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                    cinematicReels ? 'border-amber-500 bg-amber-500' : 'border-stone-700'
                  }`}>
                    {cinematicReels && <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Film className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-xs sm:text-sm text-white">Cinematic Reels / TikTok Video</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                        PROMO FREE 🔥
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Shot video vertikal 1 menit, cinematic slow-motion di sela sesi pemotretan.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Extra Edit 1 Foto (Quantity Counter) */}
              <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-950/70">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-xs sm:text-sm text-white">Xtra Edited 1 Foto</span>
                      <span className="text-xs font-mono font-bold text-amber-400">Rp 10.000 / foto</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Tambahan foto pilihan untuk diedit profesional (tone color & retouching).
                    </p>
                  </div>

                  {/* Increment/Decrement Buttons */}
                  <div className="flex items-center gap-2 shrink-0 bg-stone-900 border border-stone-800 rounded-lg p-1">
                    <button
                      type="button"
                      disabled={extraEdit1Count <= 0}
                      onClick={() => setExtraEdit1Count(prev => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded flex items-center justify-center bg-stone-800 text-stone-300 hover:text-white disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs font-mono text-white">
                      {extraEdit1Count}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExtraEdit1Count(prev => prev + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {extraEdit1Count > 0 && (
                  <div className="mt-2 text-right text-[11px] text-amber-400 font-medium">
                    Total: {extraEdit1Count} foto × Rp 10.000 = <span className="font-mono font-bold">{formatRupiah(extra1Total)}</span>
                  </div>
                )}
              </div>

              {/* 3. Extra Edit 5 Foto (Quantity Counter) */}
              <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-950/70">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-xs sm:text-sm text-white">Xtra Edited 5 Foto</span>
                      <span className="text-xs font-mono font-bold text-amber-400">Rp 40.000 / 5 foto</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Paket hemat 5 foto tambahan diedit profesional (hemat Rp 10.000).
                    </p>
                  </div>

                  {/* Increment/Decrement Buttons */}
                  <div className="flex items-center gap-2 shrink-0 bg-stone-900 border border-stone-800 rounded-lg p-1">
                    <button
                      type="button"
                      disabled={extraEdit5Count <= 0}
                      onClick={() => setExtraEdit5Count(prev => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded flex items-center justify-center bg-stone-800 text-stone-300 hover:text-white disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs font-mono text-white">
                      {extraEdit5Count}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExtraEdit5Count(prev => prev + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {extraEdit5Count > 0 && (
                  <div className="mt-2 text-right text-[11px] text-amber-400 font-medium">
                    Total: {extraEdit5Count} paket (={extraEdit5Count * 5} foto) = <span className="font-mono font-bold">{formatRupiah(extra5Total)}</span>
                  </div>
                )}
              </div>

              {/* 4. Express Edit (One Day Service - Rp 50.000) */}
              <div 
                onClick={() => setExpressEdit(!expressEdit)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  expressEdit
                    ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500/40'
                    : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                    expressEdit ? 'border-amber-500 bg-amber-500' : 'border-stone-700'
                  }`}>
                    {expressEdit && <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-xs sm:text-sm text-white">Express Edit (One Day Service)</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">+Rp 50.000</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Hasil foto editan final diserahkan 1x24 jam setelah klien memilih nomor foto.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 3: Data Wisudawan & Jadwal */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-7 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-stone-800">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
                3
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  Data Diri & Jadwal Pemotretan
                </h2>
                <p className="text-[11px] sm:text-xs text-stone-400">Isi identitas wisudawan/klien dan tentukan lokasi serta jam sesi foto</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Nama Lengkap Wisudawan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Amanda Putri Salsabila, S.T."
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    No. WhatsApp Aktif <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Asal Kampus / Fakultas / Instansi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={kampus}
                  onChange={(e) => setKampus(e.target.value)}
                  placeholder="Contoh: Universitas Lampung (Unila) - Fakultas Teknik"
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Tanggal & Jam (24-Hour Selector) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Tanggal Sesi <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="date"
                    value={tanggalSesi}
                    onChange={(e) => setTanggalSesi(e.target.value)}
                    className="w-full px-2.5 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Jam Mulai Sesi (24 Jam WIB) <span className="text-rose-400">*</span>
                  </span>
                  <select
                    value={jamSesi}
                    onChange={(e) => setJamSesi(e.target.value)}
                    className="w-full px-2.5 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {timeSlots24h.map(t => (
                      <option key={t} value={t}>Pukul {t} WIB</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lokasi Tipe & Detail (Studio Foto REMOVED) */}
              <div className="space-y-3">
                <div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Kategori Lokasi Foto <span className="text-rose-400">*</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Area Kampus / Gedung Acara', 'Outdoor / Taman / Landmark'].map(loc => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLokasiTipe(loc)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                          lokasiTipe === loc
                            ? 'border-amber-500 bg-amber-950/40 text-amber-300 ring-1 ring-amber-500/50'
                            : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Detail Lokasi & Titik Kumpul Spesifik <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={lokasiDetail}
                    onChange={(e) => setLokasiDetail(e.target.value)}
                    placeholder="Contoh: Depan Rektorat Unila / Gedung Serba Guna (GSG)"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Jumlah orang & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Estimasi Jumlah Orang Ikut Foto
                  </label>
                  <input
                    type="text"
                    value={jumlahOrang}
                    onChange={(e) => setJumlahOrang(e.target.value)}
                    placeholder="Contoh: 4-6 Orang (Wisudawan + Ortu)"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Catatan / Request Konsep Khusus
                  </label>
                  <input
                    type="text"
                    value={catatanKhusus}
                    onChange={(e) => setCatatanKhusus(e.target.value)}
                    placeholder="Contoh: Pose candid, bawa buket besar"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* S&K Ketentuan Sesi Ringkas */}
          <section className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 sm:p-5 text-xs text-stone-300 space-y-2">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Ketentuan Komitmen Jadwal Fotografer:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-stone-400 pl-1 text-[11px] sm:text-xs">
              {FOTO_BOOKING_RULES.terms.map((term, idx) => (
                <li key={idx}>{term}</li>
              ))}
            </ul>
          </section>

        </div>

        {/* Right Column: Live Order Preview & Actions (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/50">
            
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <h3 className="font-bold text-sm sm:text-base text-white">Rincian Paket & Biaya</h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-stone-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-stone-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Price Breakdown Box */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs mb-4">
              <div className="flex justify-between items-center text-stone-300">
                <span className="font-medium">{currentPackage.name}</span>
                <span className="font-bold text-amber-400 font-mono">{formatRupiah(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-stone-400 text-[11px]">
                <span>Durasi: {currentPackage.duration}</span>
                <span>{activeAddOnsList.length > 0 ? `+${activeAddOnsList.length} Add-On` : 'Tanpa Add-On'}</span>
              </div>
              
              {/* Itemized Add-ons */}
              {activeAddOnsList.length > 0 && (
                <div className="pt-2 border-t border-stone-900 space-y-1">
                  {cinematicReels && (
                    <div className="flex justify-between items-center text-[11px] text-stone-400">
                      <span>• Cinematic Reels (Promo Free)</span>
                      <span className="text-emerald-400 font-bold font-mono">Gratis</span>
                    </div>
                  )}
                  {extraEdit1Count > 0 && (
                    <div className="flex justify-between items-center text-[11px] text-stone-400">
                      <span>• Xtra Edit 1 Foto (x{extraEdit1Count})</span>
                      <span className="text-amber-400 font-mono">+{formatRupiah(extra1Total)}</span>
                    </div>
                  )}
                  {extraEdit5Count > 0 && (
                    <div className="flex justify-between items-center text-[11px] text-stone-400">
                      <span>• Xtra Edit 5 Foto (x{extraEdit5Count})</span>
                      <span className="text-amber-400 font-mono">+{formatRupiah(extra5Total)}</span>
                    </div>
                  )}
                  {expressEdit && (
                    <div className="flex justify-between items-center text-[11px] text-stone-400">
                      <span>• Express Edit (1x24 Jam)</span>
                      <span className="text-amber-400 font-mono">+{formatRupiah(expressTotal)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2.5 border-t border-stone-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Biaya Pemesanan:</span>
                <span className="font-extrabold text-amber-300 text-base font-mono">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Skema Pembayaran Radio (DP wajib 50k) */}
            <div className="mb-4">
              <span className="block text-[11px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Pilihan Pembayaran (DP Wajib Rp 50.000):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSkemaBayar('dp')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    skemaBayar === 'dp'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300 ring-1 ring-amber-500/50'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="font-bold text-white">DP Rp 50.000</div>
                  <span className="text-[10px] text-stone-400 font-normal">Sisa saat/pasca sesi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSkemaBayar('lunas')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    skemaBayar === 'lunas'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300 ring-1 ring-amber-500/50'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="font-bold text-white">Langsung Lunas</div>
                  <span className="text-[10px] text-stone-400 font-normal">Full Payment</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleKirimWA}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-stone-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-amber-950/40 active:scale-[0.99] transition-all"
              >
                <Send className="w-5 h-5 text-stone-950" />
                <span>Kirim Booking via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleSalinFormat}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Salin Ringkasan Booking</span>
              </button>
            </div>

            <p className="text-center text-[10px] sm:text-[11px] text-stone-400 mt-3 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Otomatis terhubung ke WhatsApp Admin Resmi: {ADMIN_WHATSAPP_DISPLAY}</span>
            </p>

          </div>

          {/* Quick Switch to Camera Rental Card */}
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Mau Hunting Foto Sendiri?</span>
              <p className="text-stone-400 mt-0.5 text-[11px]">Sewa kamera Nikon Z50 Mark II & lensa fix mulai Rp 25.000.</p>
            </div>
            <Link
              href="/sewa-kamera"
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 font-bold shrink-0 flex items-center gap-1 shadow-sm text-xs"
            >
              <span>Sewa Kamera</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <Check className="w-5 h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

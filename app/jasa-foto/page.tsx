'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Calendar, 
  Clock, 
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
  Zap,
  ShieldCheck
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

  // Local date helper
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayStr();

  // Date & Session
  const getDefaultDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [tanggalSesi, setTanggalSesi] = useState(getDefaultDateStr());
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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
      
      {/* Header Page (NO WA BADGE ON TOP) */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c89343]/10 border border-[#c89343]/35 text-[#f2cf83] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#e5b869]" />
          <span>Fotonic Graduation &amp; Sidang Photography</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
          Katalog &amp; Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2cf83] via-[#d9a756] to-[#be873b]">Jasa Foto &amp; Video</span>
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto px-2">
          Dokumentasikan momen wisuda, yudisium, dan sidang skripsi Anda dengan karya visual berkelas. Pilih paket resmi, tentukan layanan add-on, dan kirim format order ke WhatsApp fotografer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Column: Form & Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 min-w-0 w-full">
          
          {/* SECTION 1: Pilih Kategori & Paket Foto */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-stone-800">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c89343]/15 text-[#e5b869] flex items-center justify-center font-bold text-xs border border-[#c89343]/35 shrink-0">
                1
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e5b869] shrink-0" />
                  <span>Pilih Paket Foto Resmi</span>
                </h2>
                <p className="text-[11px] text-stone-400">Pilih kategori layanan dan paket durasi sesuai momen Anda</p>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-2">
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
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'border-[#d6a350] bg-[#c89343]/15 ring-1 ring-[#d6a350]/40 text-white'
                          : 'border-stone-800 bg-stone-950/70 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                        {cat.id === 'Single Packet' && <User className="w-3.5 h-3.5 text-[#e5b869] shrink-0" />}
                        {cat.id === 'Group / Family' && <Users className="w-3.5 h-3.5 text-[#e5b869] shrink-0" />}
                        {cat.id === 'Seminar & Sidang' && <Award className="w-3.5 h-3.5 text-[#e5b869] shrink-0" />}
                        <span className="truncate">{cat.title}</span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{cat.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Packages List */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
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
                        ? 'border-[#d6a350] bg-[#c89343]/10 ring-1 ring-[#d6a350]/35'
                        : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          isSelected ? 'border-[#d6a350] bg-[#d6a350]' : 'border-stone-700'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-stone-950 stroke-[3]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-white">{pkg.name}</span>
                            {pkg.badge && (
                              <span className="text-[10px] px-2 py-0.2 rounded bg-[#c89343]/15 border border-[#c89343]/30 text-[#f2cf83] font-medium">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap my-1.5">
                            <span className="text-[10px] sm:text-[11px] bg-stone-900 border border-stone-800 text-stone-300 px-2 py-0.5 rounded-md font-medium">
                              ⏱️ {pkg.duration}
                            </span>
                            <span className="text-[10px] sm:text-[11px] bg-stone-900 border border-stone-800 text-stone-300 px-2 py-0.5 rounded-md font-medium">
                              📍 {pkg.spots}
                            </span>
                            <span className="text-[10px] sm:text-[11px] bg-[#c89343]/15 border border-[#c89343]/30 text-[#f2cf83] px-2 py-0.5 rounded-md font-medium">
                              🎨 Edit {pkg.editedPhotos} Foto
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 leading-relaxed">{pkg.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-xs sm:text-base text-[#e5b869] font-mono">
                          {formatRupiah(pkg.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inclusions Box - Clean & Responsive */}
            <div className="mt-4 p-3 sm:p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-2.5 text-xs text-stone-300">
              <Cloud className="w-4 h-4 text-[#e5b869] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-bold text-white block sm:inline">Fasilitas Termasuk Bebas Biaya: </span>
                <span className="text-stone-400 text-[11px] leading-relaxed">
                  Semua file RAW &amp; JPG High-Resolution via Google Drive tanpa kompresi.
                </span>
              </div>
            </div>

          </section>

          {/* SECTION 2: Add-On Services (Mobile Optimized) */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-stone-800">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c89343]/15 text-[#e5b869] flex items-center justify-center font-bold text-xs border border-[#c89343]/35 shrink-0">
                2
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e5b869] shrink-0" />
                  <span>Layanan Tambahan (Add-On)</span>
                </h2>
                <p className="text-[11px] text-stone-400">Pilih opsi ekstra untuk menyempurnakan hasil dokumentasi</p>
              </div>
            </div>

            <div className="space-y-2.5">
              
              {/* 1. Cinematic Reels (PROMO FREE) */}
              <div 
                onClick={() => setCinematicReels(!cinematicReels)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  cinematicReels
                    ? 'border-[#d6a350] bg-[#c89343]/10 ring-1 ring-[#d6a350]/35'
                    : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                    cinematicReels ? 'border-[#d6a350] bg-[#d6a350]' : 'border-stone-700'
                  }`}>
                    {cinematicReels && <Check className="w-3 h-3 text-stone-950 stroke-[3]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-[#e5b869] shrink-0" />
                        <span className="font-bold text-xs sm:text-sm text-white">Cinematic Reels / TikTok</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#34d399] px-2 py-0.5 rounded bg-[#10b981]/15 border border-[#10b981]/30 shrink-0">
                        PROMO FREE 🔥
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                      Shot video vertikal 1 menit, cinematic slow-motion di sela sesi pemotretan.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Extra Edit 1 Foto (Quantity Counter) */}
              <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-950/70 space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Sparkles className="w-3.5 h-3.5 text-[#e5b869] shrink-0" />
                      <span className="font-bold text-xs sm:text-sm text-white">Xtra Edited 1 Foto</span>
                      <span className="text-[11px] font-mono font-bold text-[#e5b869]">Rp 10.000/foto</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                      Tambahan 1 foto diedit profesional (tone &amp; retouching).
                    </p>
                  </div>

                  {/* Counter Buttons */}
                  <div className="flex items-center gap-1 shrink-0 bg-stone-900 border border-stone-800 rounded-lg p-1">
                    <button
                      type="button"
                      disabled={extraEdit1Count <= 0}
                      onClick={() => setExtraEdit1Count(prev => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded flex items-center justify-center bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30 transition-colors"
                      aria-label="Kurangi foto"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs font-mono text-white">
                      {extraEdit1Count}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExtraEdit1Count(prev => prev + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center bg-[#c89343]/20 text-[#e5b869] hover:bg-[#d6a350] hover:text-stone-950 transition-colors"
                      aria-label="Tambah foto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {extraEdit1Count > 0 && (
                  <div className="pt-2 border-t border-stone-900 flex justify-between items-center text-[11px] text-stone-400">
                    <span>Total Tambahan ({extraEdit1Count} foto):</span>
                    <span className="font-mono font-bold text-[#e5b869]">{formatRupiah(extra1Total)}</span>
                  </div>
                )}
              </div>

              {/* 3. Extra Edit 5 Foto (Quantity Counter) */}
              <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-950/70 space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Sparkles className="w-3.5 h-3.5 text-[#e5b869] shrink-0" />
                      <span className="font-bold text-xs sm:text-sm text-white">Xtra Edited 5 Foto</span>
                      <span className="text-[11px] font-mono font-bold text-[#e5b869]">Rp 40.000/5 foto</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                      Paket hemat 5 foto diedit profesional (hemat Rp 10.000).
                    </p>
                  </div>

                  {/* Counter Buttons */}
                  <div className="flex items-center gap-1 shrink-0 bg-stone-900 border border-stone-800 rounded-lg p-1">
                    <button
                      type="button"
                      disabled={extraEdit5Count <= 0}
                      onClick={() => setExtraEdit5Count(prev => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded flex items-center justify-center bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30 transition-colors"
                      aria-label="Kurangi paket"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs font-mono text-white">
                      {extraEdit5Count}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExtraEdit5Count(prev => prev + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center bg-[#c89343]/20 text-[#e5b869] hover:bg-[#d6a350] hover:text-stone-950 transition-colors"
                      aria-label="Tambah paket"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {extraEdit5Count > 0 && (
                  <div className="pt-2 border-t border-stone-900 flex justify-between items-center text-[11px] text-stone-400">
                    <span>Total ({extraEdit5Count * 5} foto):</span>
                    <span className="font-mono font-bold text-[#e5b869]">{formatRupiah(extra5Total)}</span>
                  </div>
                )}
              </div>

              {/* 4. Express Edit (One Day Service - Rp 50.000) */}
              <div 
                onClick={() => setExpressEdit(!expressEdit)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  expressEdit
                    ? 'border-[#d6a350] bg-[#c89343]/10 ring-1 ring-[#d6a350]/35'
                    : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                    expressEdit ? 'border-[#d6a350] bg-[#d6a350]' : 'border-stone-700'
                  }`}>
                    {expressEdit && <Check className="w-3 h-3 text-stone-950 stroke-[3]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#e5b869] shrink-0" />
                        <span className="font-bold text-xs sm:text-sm text-white">Express Edit (1x24 Jam)</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#e5b869] shrink-0">+Rp 50.000</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                      Hasil foto editan final diserahkan 1x24 jam setelah klien memilih nomor foto.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 3: Data Wisudawan & Jadwal */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-stone-800">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c89343]/15 text-[#e5b869] flex items-center justify-center font-bold text-xs border border-[#c89343]/35 shrink-0">
                3
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#e5b869] shrink-0" />
                  <span>Data Diri &amp; Jadwal Pemotretan</span>
                </h2>
                <p className="text-[11px] text-stone-400">Isi identitas wisudawan/klien dan tentukan lokasi serta jam sesi foto</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Nama Lengkap Wisudawan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Amanda Putri Salsabila, S.T."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a350]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    No. WhatsApp Aktif <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a350]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Asal Kampus / Fakultas / Instansi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={kampus}
                  onChange={(e) => setKampus(e.target.value)}
                  placeholder="Contoh: Universitas Lampung (Unila) - Fakultas Teknik"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a350]"
                />
              </div>

              {/* Tanggal & Jam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5 min-w-0">
                  <span className="text-[11px] font-bold text-[#e5b869] uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Tanggal Sesi</span> <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="date"
                    min={todayStr}
                    value={tanggalSesi}
                    onChange={(e) => setTanggalSesi(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#d6a350]"
                  />
                </div>

                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5 min-w-0">
                  <span className="text-[11px] font-bold text-[#e5b869] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Jam Mulai (WIB)</span> <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="time"
                    value={jamSesi}
                    onChange={(e) => setJamSesi(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#d6a350]"
                  />
                </div>
              </div>

              {/* Lokasi Tipe & Detail */}
              <div className="space-y-2.5">
                <div>
                  <span className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Kategori Lokasi Foto <span className="text-rose-400">*</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Area Kampus / Gedung Acara', 'Cafe / Taman / Landmark'].map(loc => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLokasiTipe(loc)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                          lokasiTipe === loc
                            ? 'border-[#d6a350] bg-[#c89343]/15 text-[#f2cf83] ring-1 ring-[#d6a350]/40'
                            : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Detail Lokasi &amp; Titik Kumpul Spesifik <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={lokasiDetail}
                    onChange={(e) => setLokasiDetail(e.target.value)}
                    placeholder="Contoh: Depan Rektorat Unila / Gedung Serba Guna (GSG)"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a350]"
                  />
                </div>
              </div>

              {/* Jumlah orang & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Estimasi Jumlah Orang Ikut Foto
                  </label>
                  <input
                    type="text"
                    value={jumlahOrang}
                    onChange={(e) => setJumlahOrang(e.target.value)}
                    placeholder="Contoh: 4-6 Orang (Wisudawan + Ortu)"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a350]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Catatan / Request Konsep Khusus
                  </label>
                  <input
                    type="text"
                    value={catatanKhusus}
                    onChange={(e) => setCatatanKhusus(e.target.value)}
                    placeholder="Contoh: Pose candid, bawa buket besar"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a350]"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* S&K Ketentuan Sesi Ringkas (RESTRUCTURED: Clean Cards without cramped bullets) */}
          <section className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#c89343]/15 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 text-[#e5b869]" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-white">
                Ketentuan Komitmen Jadwal Fotografer:
              </h3>
            </div>

            <div className="space-y-2">
              {FOTO_BOOKING_RULES.terms.map((term, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 text-[11px] sm:text-xs text-stone-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d6a350] shrink-0 mt-1.5"></span>
                  <p className="leading-relaxed min-w-0 flex-1">{term}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Live Order Preview & Actions (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4 min-w-0 w-full">
          
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d6a350] animate-pulse"></span>
                <h3 className="font-bold text-sm sm:text-base text-white">Rincian Paket &amp; Biaya</h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-stone-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-stone-800"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Price Breakdown Box */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1.5 text-xs mb-3.5">
              <div className="flex justify-between items-center text-stone-300">
                <span className="font-medium text-[11px] truncate">{currentPackage.name}</span>
                <span className="font-bold text-[#e5b869] font-mono shrink-0 ml-2">{formatRupiah(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-stone-400 text-[10px]">
                <span>Durasi: {currentPackage.duration}</span>
                <span>{activeAddOnsList.length > 0 ? `+${activeAddOnsList.length} Add-On` : 'Tanpa Add-On'}</span>
              </div>
              
              {/* Itemized Add-ons */}
              {activeAddOnsList.length > 0 && (
                <div className="pt-2 border-t border-stone-900 space-y-1">
                  {cinematicReels && (
                    <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-stone-400">
                      <span>• Cinematic Reels (Promo Free)</span>
                      <span className="text-[#34d399] font-bold font-mono">Gratis</span>
                    </div>
                  )}
                  {extraEdit1Count > 0 && (
                    <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-stone-400">
                      <span>• Xtra Edit 1 Foto (x{extraEdit1Count})</span>
                      <span className="text-[#e5b869] font-mono">+{formatRupiah(extra1Total)}</span>
                    </div>
                  )}
                  {extraEdit5Count > 0 && (
                    <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-stone-400">
                      <span>• Xtra Edit 5 Foto (x{extraEdit5Count})</span>
                      <span className="text-[#e5b869] font-mono">+{formatRupiah(extra5Total)}</span>
                    </div>
                  )}
                  {expressEdit && (
                    <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-stone-400">
                      <span>• Express Edit (1x24 Jam)</span>
                      <span className="text-[#e5b869] font-mono">+{formatRupiah(expressTotal)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs sm:text-sm">
                <span className="font-bold text-white">Total Biaya Pemesanan:</span>
                <span className="font-extrabold text-[#f2cf83] text-sm sm:text-base font-mono">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Skema Pembayaran Radio (DP wajib 50k) */}
            <div className="mb-3.5">
              <span className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Pilihan Pembayaran (DP Wajib Rp 50.000):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSkemaBayar('dp')}
                  className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                    skemaBayar === 'dp'
                      ? 'border-[#d6a350] bg-[#c89343]/15 text-[#f2cf83] ring-1 ring-[#d6a350]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}
                >
                  <div className="font-bold text-white">DP Rp 50.000</div>
                  <span className="text-[10px] text-stone-400 font-normal">Sisa: {formatRupiah(sisaPelunasan)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSkemaBayar('lunas')}
                  className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                    skemaBayar === 'lunas'
                      ? 'border-[#d6a350] bg-[#c89343]/15 text-[#f2cf83] ring-1 ring-[#d6a350]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}
                >
                  <div className="font-bold text-white">Langsung Lunas</div>
                  <span className="text-[10px] text-stone-400 font-normal">{formatRupiah(grandTotal)}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleKirimWA}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#e7bd70] via-[#d6a350] to-[#be8638] hover:brightness-105 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#be8638]/25 active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4 text-stone-950" />
                <span>Kirim Booking via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleSalinFormat}
                className="w-full py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5 text-[#e5b869]" />
                <span>Salin Ringkasan Booking</span>
              </button>
            </div>

            <p className="text-center text-[10px] text-stone-500 mt-2.5">
              WhatsApp Admin Resmi: <strong className="text-stone-300 font-mono">{ADMIN_WHATSAPP_DISPLAY}</strong>
            </p>

          </div>

          {/* Quick Switch to Camera Rental Card */}
          <div className="p-3.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0 flex-1">
              <span className="font-bold text-white block truncate">Mau Hunting Foto Sendiri?</span>
              <p className="text-stone-400 text-[11px] mt-0.5 truncate">Sewa kamera Nikon Z50 Mark II &amp; lensa mulai Rp 25k.</p>
            </div>
            <Link
              href="/sewa-kamera"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#4ade80] via-[#10b981] to-[#059669] text-stone-950 font-bold shrink-0 flex items-center gap-1 shadow text-xs"
            >
              <span>Sewa Kamera</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 border border-[#d6a350] text-white px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-[#e5b869]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

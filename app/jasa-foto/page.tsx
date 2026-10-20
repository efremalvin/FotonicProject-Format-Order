'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Calendar, Clock, MapPin, User, Users, Award, Check, Copy, Send, Sparkles, RotateCcw, Cloud, CheckCircle2, ChevronRight, Camera } from 'lucide-react';
import { FOTO_CATEGORIES, FOTO_PACKAGES, FOTO_ADDONS, FOTO_BOOKING_RULES, FotoPackage } from '@/data/fotoPricelist';
import { generateFotoWhatsAppUrl, formatRupiah, ADMIN_WHATSAPP_DISPLAY } from '@/lib/whatsapp';

export default function JasaFotoPage() {
  // Category & package
  const [selectedCategory, setSelectedCategory] = useState<'Single Packet' | 'Group / Family' | 'Seminar & Sidang'>('Single Packet');
  const [selectedPackageId, setSelectedPackageId] = useState('single-std');

  // Add-ons selection
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Client Data
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [kampus, setKampus] = useState('');

  // Date & Session
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  const defaultDateStr = defaultDate.toISOString().split('T')[0];

  const [tanggalSesi, setTanggalSesi] = useState(defaultDateStr);
  const [jamSesi, setJamSesi] = useState('10:00');
  const [lokasiTipe, setLokasiTipe] = useState('Area Kampus / Gedung Acara');
  const [lokasiDetail, setLokasiDetail] = useState('');
  const [jumlahOrang, setJumlahOrang] = useState('');
  const [catatanKhusus, setCatatanKhusus] = useState('');

  // Payment
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

  const selectedAddons = FOTO_ADDONS.filter(a => selectedAddonIds.includes(a.id));
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);

  const grandTotal = basePrice + addonsTotal;
  const dpAmount = Math.min(50000, grandTotal);
  const sisaPelunasan = Math.max(0, grandTotal - dpAmount);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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
      addOns: selectedAddons.map(a => ({ name: a.name, price: a.price })),
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
    const addOnList = selectedAddons.length > 0
      ? selectedAddons.map(a => `• ${a.name} (${formatRupiah(a.price)})`).join(', ')
      : 'Tidak ada';

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
• Add-On : ${addOnList}

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
      setSelectedAddonIds([]);
      setSkemaBayar('dp');
      showToast('Formulir berhasil di-reset.');
    }
  };

  const filteredPackages = FOTO_PACKAGES.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Page */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs sm:text-sm font-semibold mb-3">
          <ImageIcon className="w-4 h-4" />
          <span>Fotonic Graduation & Sidang Photography</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Katalog & Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300">Jasa Foto & Video</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Dokumentasikan selebrasi wisuda, yudisium, dan sidang skripsi Anda dengan karya visual berkelas. Pilih paket resmi, tentukan layanan add-on, dan kirim format order instan ke WhatsApp fotografer.
        </p>

        {/* Locked Official Admin Contact Badge */}
        <div className="mt-4 inline-flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
          <span className="text-slate-400">WhatsApp Admin Resmi:</span>
          <strong className="text-purple-400 font-mono tracking-wide">{ADMIN_WHATSAPP_DISPLAY}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form & Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: Pilih Kategori & Paket Foto */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/30">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Pilih Paket Foto Resmi
                </h2>
                <p className="text-xs text-slate-400">Pilih kategori layanan dan paket durasi sesuai kebutuhan momen Anda</p>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
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
                          ? 'border-purple-500 bg-purple-950/40 ring-1 ring-purple-500/50 text-white'
                          : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                        {cat.id === 'Single Packet' && <User className="w-3.5 h-3.5 text-purple-400" />}
                        {cat.id === 'Group / Family' && <Users className="w-3.5 h-3.5 text-purple-400" />}
                        {cat.id === 'Seminar & Sidang' && <Award className="w-3.5 h-3.5 text-purple-400" />}
                        <span>{cat.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{cat.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Packages List */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Pilihan Paket dalam Kategori {selectedCategory} <span className="text-rose-400">*</span>
              </label>

              {filteredPackages.map(pkg => {
                const isSelected = pkg.id === selectedPackageId;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/40'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-purple-500 bg-purple-500' : 'border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-white">{pkg.name}</span>
                            {pkg.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-700/60 text-purple-300 font-semibold">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap my-1.5">
                            <span className="text-[11px] bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                              ⏱️ {pkg.duration}
                            </span>
                            <span className="text-[11px] bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                              📍 {pkg.spots}
                            </span>
                            <span className="text-[11px] bg-purple-950 border border-purple-800 text-purple-300 px-2 py-0.5 rounded-md font-medium">
                              🎨 Edit {pkg.editedPhotos} Foto
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{pkg.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-sm sm:text-base text-purple-400 font-mono">
                          {formatRupiah(pkg.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inclusions Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
              <Cloud className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Fasilitas Termasuk Bebas Biaya:</span>
                <p className="text-slate-400 mt-0.5">
                  Semua file RAW & JPG High-Resolution via Google Drive tanpa kompresi + Pengarahan pose ramah dan santai selama sesi pemotretan.
                </p>
              </div>
            </div>

          </section>

          {/* SECTION 2: Add-On Services */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/30">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Layanan Tambahan (Add-On Services)
                </h2>
                <p className="text-xs text-slate-400">Pilih layanan ekstra opsional untuk menyempurnakan hasil foto & video</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {FOTO_ADDONS.map(addon => {
                const isChecked = selectedAddonIds.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/40'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                        isChecked ? 'border-purple-500 bg-purple-500' : 'border-slate-600'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-white">{addon.name}</span>
                          <span className="text-xs font-mono font-bold text-purple-300">+{formatRupiah(addon.price)}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{addon.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: Data Wisudawan & Jadwal */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/30">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Data Diri & Jadwal Pemotretan
                </h2>
                <p className="text-xs text-slate-400">Isi identitas wisudawan/klien dan tentukan lokasi serta jam sesi foto</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nama Lengkap Wisudawan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Amanda Putri Salsabila, S.T."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    No. WhatsApp Aktif <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Asal Kampus / Fakultas / Instansi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={kampus}
                  onChange={(e) => setKampus(e.target.value)}
                  placeholder="Contoh: UGM - Fakultas Teknik"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Tanggal & Jam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Tanggal Sesi <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="date"
                    value={tanggalSesi}
                    onChange={(e) => setTanggalSesi(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Jam Mulai Sesi <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="time"
                    value={jamSesi}
                    onChange={(e) => setJamSesi(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Lokasi Tipe & Detail */}
              <div className="space-y-3">
                <div>
                  <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Kategori Lokasi Foto <span className="text-rose-400">*</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Area Kampus / Gedung Acara', 'Studio Foto (Indoor)', 'Outdoor / Cafe / Landmark'].map(loc => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLokasiTipe(loc)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                          lokasiTipe === loc
                            ? 'border-purple-500 bg-purple-950/40 text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Detail Lokasi & Titik Kumpul Spesifik <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={lokasiDetail}
                    onChange={(e) => setLokasiDetail(e.target.value)}
                    placeholder="Contoh: Depan Grha Sabha Pramana UGM / Lobi Utama Gedung Pusat"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Jumlah orang & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Estimasi Jumlah Orang Ikut Foto
                  </label>
                  <input
                    type="text"
                    value={jumlahOrang}
                    onChange={(e) => setJumlahOrang(e.target.value)}
                    placeholder="Contoh: 4-6 Orang (Wisudawan + Ortu)"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Catatan / Request Konsep Khusus
                  </label>
                  <input
                    type="text"
                    value={catatanKhusus}
                    onChange={(e) => setCatatanKhusus(e.target.value)}
                    placeholder="Contoh: Pose candid, bawa buket besar"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* S&K Ketentuan Sesi Ringkas */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Ketentuan Komitmen Jadwal Fotografer:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 text-[11px] sm:text-xs">
              {FOTO_BOOKING_RULES.terms.map((term, idx) => (
                <li key={idx}>{term}</li>
              ))}
            </ul>
          </section>

        </div>

        {/* Right Column: Live Order Preview & Actions (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/50">
            
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
                <h3 className="font-bold text-base text-white">Rincian Paket & Biaya</h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Price Breakdown Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs mb-4">
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-medium">{currentPackage.name}</span>
                <span className="font-bold text-purple-400 font-mono">{formatRupiah(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Durasi: {currentPackage.duration}</span>
                <span>{selectedAddons.length > 0 ? `+${selectedAddons.length} Add-On` : 'Tanpa Add-On'}</span>
              </div>
              {selectedAddons.length > 0 && (
                <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-900">
                  <span>Tambahan Add-On</span>
                  <span className="font-bold text-purple-400 font-mono">+{formatRupiah(addonsTotal)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Biaya Pemesanan:</span>
                <span className="font-extrabold text-amber-300 text-base font-mono">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Skema Pembayaran Radio */}
            <div className="mb-4">
              <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Pilihan Pembayaran:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSkemaBayar('dp')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    skemaBayar === 'dp'
                      ? 'border-purple-500 bg-purple-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>DP Rp 50.000</div>
                  <span className="text-[10px] text-slate-400 font-normal">Sisa saat/pasca sesi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSkemaBayar('lunas')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    skemaBayar === 'lunas'
                      ? 'border-purple-500 bg-purple-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>Langsung Lunas</div>
                  <span className="text-[10px] text-slate-400 font-normal">Full Payment</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleKirimWA}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-purple-950/40 active:scale-[0.99] transition-all"
              >
                <Send className="w-5 h-5 text-white" />
                <span>Kirim Booking via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleSalinFormat}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Copy className="w-4 h-4" />
                <span>Salin Ringkasan Booking</span>
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-500 mt-3 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Otomatis terhubung ke WhatsApp Fotografer Resmi: +62 819-9421-8428</span>
            </p>

          </div>

          {/* Quick Switch to Camera Rental Card */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Mau Hunting Foto Sendiri?</span>
              <p className="text-emerald-300/80 mt-0.5">Sewa kamera Nikon Z50 Mark II & lensa fix mulai Rp 25.000.</p>
            </div>
            <Link
              href="/sewa-kamera"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold shrink-0 flex items-center gap-1 shadow-md"
            >
              <span>Sewa Kamera</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-purple-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <Check className="w-5 h-5 text-purple-400" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

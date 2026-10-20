'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Calendar, Clock, MapPin, ShieldAlert, Check, Copy, Send, Sparkles, RotateCcw, Info, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { KAMERA_PACKAGES, STANDARD_ACCESSORIES, EXTRA_GEAR_ADDONS, RENTAL_RULES } from '@/data/kameraCatalog';
import { generateRentalWhatsAppUrl, formatRupiah, ADMIN_WHATSAPP_DISPLAY, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function SewaKameraPage() {
  // Form states
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [alamatDomisili, setAlamatDomisili] = useState('');

  // Package & duration selection
  const [selectedDurationKey, setSelectedDurationKey] = useState<'fullDay' | 'halfDay' | 'shortTime'>('fullDay');
  const [selectedPackageId, setSelectedPackageId] = useState('paket-komplit');
  const [singleLensChoice, setSingleLensChoice] = useState('Lensa Kit 16-50mm (Serbaguna)');

  // Dates & hours
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [tanggalAmbil, setTanggalAmbil] = useState(todayStr);
  const [jamAmbil, setJamAmbil] = useState('08:00');
  const [tanggalKembali, setTanggalKembali] = useState(tomorrowStr);
  const [jamKembali, setJamKembali] = useState('08:00');

  // Systems & Guarantee
  const [sistemAmbil, setSistemAmbil] = useState('Ambil di Tempat Rental');
  const [sistemKembali, setSistemKembali] = useState('Antar ke Tempat Rental');
  const [jaminanKTP, setJaminanKTP] = useState(true);
  const [jaminanKTM, setJaminanKTM] = useState(false);

  // Extra Gear add-ons
  const [selectedExtraGear, setSelectedExtraGear] = useState<string[]>([]);

  // Payment scheme
  const [skemaBayar, setSkemaBayar] = useState<'dp' | 'lunas'>('dp');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculations
  const currentPackage = KAMERA_PACKAGES.find(p => p.id === selectedPackageId) || KAMERA_PACKAGES[0];
  const basePrice = currentPackage.pricing[selectedDurationKey];

  const extraGearTotal = selectedExtraGear.reduce((sum, gearId) => {
    const item = EXTRA_GEAR_ADDONS.find(g => g.id === gearId);
    return sum + (item ? item.pricePerDay : 0);
  }, 0);

  const grandTotal = basePrice + extraGearTotal;
  const dpAmount = Math.min(50000, grandTotal);
  const sisaPelunasan = Math.max(0, grandTotal - dpAmount);

  const durasiLabel = selectedDurationKey === 'fullDay' 
    ? '1 Hari / Full Day (24 Jam)' 
    : selectedDurationKey === 'halfDay' 
    ? 'Setengah Hari (6–12 Jam)' 
    : 'Short Time (Maks. 4 Jam)';

  const detailUnitText = selectedPackageId === 'paket-single-lens' 
    ? `Body Nikon Z50 Mark II + ${singleLensChoice}`
    : currentPackage.includesText;

  const toggleExtraGear = (id: string) => {
    setSelectedExtraGear(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleKirimWA = () => {
    if (!nama.trim()) {
      alert('Mohon lengkapi Nama Lengkap terlebih dahulu.');
      return;
    }
    if (!jaminanKTP && !jaminanKTM) {
      alert('Wajib memilih minimal salah satu jaminan identitas (KTP atau KTM Asli)!');
      return;
    }

    const jaminans: string[] = [];
    if (jaminanKTP) jaminans.push('KTP Asli');
    if (jaminanKTM) jaminans.push('KTM / Kartu Pelajar Asli');

    const gearObjects = selectedExtraGear.map(id => {
      const g = EXTRA_GEAR_ADDONS.find(item => item.id === id);
      return { name: g?.name || id, price: g?.pricePerDay || 0 };
    });

    const paymentText = skemaBayar === 'dp'
      ? `DP Booking : Rp 50.000 (Sisa ${formatRupiah(sisaPelunasan)} saat serah terima unit)`
      : `Pembayaran Lunas : ${formatRupiah(grandTotal)} (Full Payment)`;

    const url = generateRentalWhatsAppUrl({
      nama,
      whatsapp,
      instagram,
      alamatDomisili,
      paketNama: currentPackage.name,
      detailUnit: detailUnitText,
      durasiTipe: durasiLabel,
      durasiHari: selectedDurationKey === 'fullDay' ? 1 : 0.5,
      tarifTotal: grandTotal,
      skemaBayar: paymentText,
      tanggalAmbil,
      jamAmbil,
      tanggalKembali,
      jamKembali,
      sistemAmbil,
      sistemKembali,
      extraGear: gearObjects,
      jaminanIdentitas: jaminans,
      aksesorisDefault: '2x Baterai + SD Card Lexar 32GB + Kabel C to C + Card Reader + Strap + Lap Microfiber'
    });

    window.open(url, '_blank');
  };

  const handleSalinFormat = async () => {
    const jaminans: string[] = [];
    if (jaminanKTP) jaminans.push('KTP Asli');
    if (jaminanKTM) jaminans.push('KTM / Kartu Pelajar Asli');

    const gearObjects = selectedExtraGear.map(id => {
      const g = EXTRA_GEAR_ADDONS.find(item => item.id === id);
      return `• ${g?.name} (${formatRupiah(g?.pricePerDay || 0)})`;
    });

    const paymentText = skemaBayar === 'dp'
      ? `DP Booking : Rp 50.000 (Sisa ${formatRupiah(sisaPelunasan)} saat serah terima)`
      : `Pembayaran Lunas : ${formatRupiah(grandTotal)}`;

    const text = 
`FORMAT ORDER - SEWA KAMERA & GEAR
FOTONIC EQUIPMENT RENTAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DATA PENYEWA :
• Nama Lengkap : ${nama || '[Nama]'}
• No. WhatsApp : ${whatsapp || '[WhatsApp]'}
• Instagram : ${instagram ? '@' + instagram.replace('@', '') : '-'}
• Domisili : ${alamatDomisili || '-'}

📸 DETAIL PERALATAN :
• Paket : ${currentPackage.name}
• Unit : ${detailUnitText}
• Durasi : ${durasiLabel}
• Jadwal Ambil : ${tanggalAmbil} (${jamAmbil} WIB)
• Jadwal Kembali : ${tanggalKembali} (${jamKembali} WIB)
• Tambahan Gear : ${gearObjects.length > 0 ? gearObjects.join(', ') : 'Tidak ada'}
• Jaminan Identitas : ${jaminans.length > 0 ? jaminans.join(' & ') : 'KTP/KTM Asli'}

💰 BIAYA & PEMBAYARAN :
• Total Biaya : ${formatRupiah(grandTotal)}
• Skema Bayar : ${paymentText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    try {
      await navigator.clipboard.writeText(text);
      showToast('Format sewa kamera berhasil disalin ke clipboard!');
    } catch {
      showToast('Gagal menyalin format.');
    }
  };

  const handleReset = () => {
    if (confirm('Reset seluruh formulir sewa kamera?')) {
      setNama('');
      setWhatsapp('');
      setInstagram('');
      setAlamatDomisili('');
      setSelectedDurationKey('fullDay');
      setSelectedPackageId('paket-komplit');
      setSelectedExtraGear([]);
      setJaminanKTP(true);
      setJaminanKTM(false);
      setSkemaBayar('dp');
      showToast('Formulir berhasil di-reset.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Page */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-3">
          <Camera className="w-4 h-4" />
          <span>Fotonic Equipment Rental</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Katalog & Form Sewa <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Nikon Z50 Mark II</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Kamera mirrorless prima siap pakai untuk hunting foto wisuda, pembuatan konten, dan dokumentasi. Pilih durasi sewa, tentukan paket alat, dan kirim format booking resmi langsung ke admin.
        </p>

        {/* Locked Official Admin Contact Badge */}
        <div className="mt-4 inline-flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400">WhatsApp Admin Resmi:</span>
          <strong className="text-emerald-400 font-mono tracking-wide">{ADMIN_WHATSAPP_DISPLAY}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form & Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: Pilih Durasi & Paket Alat */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  Pilih Durasi & Paket Kamera
                </h2>
                <p className="text-xs text-slate-400">Pilih jangka waktu pemakaian dan paket kamera sesuai pricelist</p>
              </div>
            </div>

            {/* Durasi Buttons */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Durasi Sewa <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedDurationKey('fullDay')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedDurationKey === 'fullDay'
                      ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/50 text-white'
                      : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">1 Hari (24 Jam)</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">Full Day 🔥</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDurationKey('halfDay')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedDurationKey === 'halfDay'
                      ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/50 text-white'
                      : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">Setengah Hari</div>
                  <div className="text-[11px] text-slate-300 font-medium mt-0.5">6 – 12 Jam</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDurationKey('shortTime')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedDurationKey === 'shortTime'
                      ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/50 text-white'
                      : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">Short Time</div>
                  <div className="text-[11px] text-amber-400 font-medium mt-0.5">Maks. 4 Jam ⏱️</div>
                </button>
              </div>
            </div>

            {/* List Paket Kamera */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Pilihan Unit Kamera & Lensa <span className="text-rose-400">*</span>
              </label>

              {KAMERA_PACKAGES.map(pkg => {
                const isSelected = pkg.id === selectedPackageId;
                const priceVal = pkg.pricing[selectedDurationKey];

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-white">{pkg.name}</span>
                            {pkg.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-semibold">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{pkg.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-sm sm:text-base text-emerald-400 font-mono">
                          {formatRupiah(priceVal)}
                        </span>
                      </div>
                    </div>

                    {/* Sub Pilihan Lensa Khusus Paket Single Lens */}
                    {pkg.id === 'paket-single-lens' && isSelected && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800/80 pl-8">
                        <span className="block text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                          Pilih 1 Lensa yang Digunakan:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {pkg.lensOptions?.map(lens => (
                            <label
                              key={lens}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSingleLensChoice(lens);
                              }}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                                singleLensChoice === lens
                                  ? 'border-emerald-500 bg-slate-900 text-white font-medium'
                                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="singleLensOption"
                                checked={singleLensChoice === lens}
                                onChange={() => setSingleLensChoice(lens)}
                                className="accent-emerald-500"
                              />
                              <span>{lens}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Aksesoris Bawaan (Default Included) */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  Kelengkapan Bawaan (Termasuk Bebas Biaya)
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">Default Inclusions</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-emerald-300/90 font-mono">
                {STANDARD_ACCESSORIES.map(acc => (
                  <li key={acc} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </section>

          {/* SECTION 2: Extra Gear Add-ons */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Tambahan Extra Gear (Opsional)
                </h2>
                <p className="text-xs text-slate-400">Sewa perlengkapan pendukung untuk menunjang kebutuhan sesi foto/video</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EXTRA_GEAR_ADDONS.map(gear => {
                const isChecked = selectedExtraGear.includes(gear.id);
                return (
                  <div
                    key={gear.id}
                    onClick={() => toggleExtraGear(gear.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                        isChecked ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-white">{gear.name}</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">+{formatRupiah(gear.pricePerDay)}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{gear.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: Data Penyewa & Jadwal */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Data Diri & Jadwal Pengambilan
                </h2>
                <p className="text-xs text-slate-400">Isi data identitas dan tentukan waktu serah terima unit</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nama Lengkap <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Muhammad Raihan Pratama"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Username Instagram (Opsional)
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Contoh: @raihan.pratama"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Alamat Domisili Sekarang <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={alamatDomisili}
                    onChange={(e) => setAlamatDomisili(e.target.value)}
                    placeholder="Contoh: Kost Asri, Jl. Kaliurang KM 5"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Jadwal Ambil & Kembali */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Waktu Pengambilan
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={tanggalAmbil}
                      onChange={(e) => setTanggalAmbil(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <input
                      type="time"
                      value={jamAmbil}
                      onChange={(e) => setJamAmbil(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Waktu Pengembalian
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={tanggalKembali}
                      onChange={(e) => setTanggalKembali(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <input
                      type="time"
                      value={jamKembali}
                      onChange={(e) => setJamKembali(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sistem Ambil & Kembali */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sistem Pengambilan
                  </span>
                  <select
                    value={sistemAmbil}
                    onChange={(e) => setSistemAmbil(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="Ambil di Tempat Rental">Ambil di Tempat Rental (Penyedia)</option>
                    <option value="Delivery (Antar ke Lokasi)">Delivery (Antar ke Lokasi Penyewa)</option>
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sistem Pengembalian
                  </span>
                  <select
                    value={sistemKembali}
                    onChange={(e) => setSistemKembali(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="Antar ke Tempat Rental">Antar ke Tempat Rental (Penyedia)</option>
                    <option value="Delivery (Dijemput Kurir)">Delivery (Jemput di Lokasi Penyewa)</option>
                  </select>
                </div>
              </div>

              {/* Jaminan Identitas */}
              <div>
                <span className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                  Jaminan Identitas Fisik (Wajib Bawa Asli):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    jaminanKTP ? 'border-amber-500 bg-amber-950/20 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={jaminanKTP}
                      onChange={(e) => setJaminanKTP(e.target.checked)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span className="text-xs font-medium">KTP Asli (Kartu Tanda Penduduk)</span>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    jaminanKTM ? 'border-amber-500 bg-amber-950/20 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={jaminanKTM}
                      onChange={(e) => setJaminanKTM(e.target.checked)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span className="text-xs font-medium">KTM Asli (Kartu Tanda Mahasiswa)</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: S&K Rental Ringkas */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Ketentuan & S&K Rental Fotonic:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RENTAL_RULES.map((rule, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="font-semibold text-emerald-300 mb-1">{rule.title}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Live Order Preview & Actions (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/50">
            
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="font-bold text-base text-white">Rincian Sewa & Tarif</h3>
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
                <span className="font-bold text-emerald-400 font-mono">{formatRupiah(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Durasi: {durasiLabel}</span>
                <span>{selectedExtraGear.length > 0 ? `+${selectedExtraGear.length} Extra Gear` : 'Tanpa Extra'}</span>
              </div>
              {selectedExtraGear.length > 0 && (
                <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-900">
                  <span>Tambahan Gear</span>
                  <span className="font-bold text-emerald-400 font-mono">+{formatRupiah(extraGearTotal)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Tarif Sewa:</span>
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
                      ? 'border-emerald-500 bg-emerald-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>DP Rp 50.000</div>
                  <span className="text-[10px] text-slate-400 font-normal">Sisa saat serah terima</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSkemaBayar('lunas')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    skemaBayar === 'lunas'
                      ? 'border-emerald-500 bg-emerald-950/40 text-white'
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
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40 active:scale-[0.99] transition-all"
              >
                <Send className="w-5 h-5 text-slate-950" />
                <span>Kirim Format Sewa via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleSalinFormat}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Copy className="w-4 h-4" />
                <span>Salin Ringkasan Order</span>
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-500 mt-3 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Otomatis terhubung ke WhatsApp Admin Resmi: +62 819-9421-8428</span>
            </p>

          </div>

          {/* Quick Switch to Photo Card */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Perlu Jasa Fotografer Wisuda?</span>
              <p className="text-purple-300/80 mt-0.5">Lihat paket foto personal, group, & sidang mulai Rp 80.000.</p>
            </div>
            <Link
              href="/jasa-foto"
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shrink-0 flex items-center gap-1 shadow-md"
            >
              <span>Jasa Foto</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Calendar, Clock, ShieldAlert, Check, Copy, Send, RotateCcw, CheckCircle2, ChevronRight, Truck } from 'lucide-react';
import { KAMERA_PACKAGES, STANDARD_ACCESSORIES, DELIVERY_OPTIONS, RENTAL_RULES } from '@/data/kameraCatalog';
import { generateRentalWhatsAppUrl, formatRupiah, ADMIN_WHATSAPP_DISPLAY } from '@/lib/whatsapp';

export default function SewaKameraPage() {
  // Form states
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [alamatDomisili, setAlamatDomisili] = useState('');

  // Package & duration selection
  const [selectedDurationKey, setSelectedDurationKey] = useState<'fullDay' | 'halfDay' | 'shortTime'>('fullDay');
  const [selectedPackageId, setSelectedPackageId] = useState('paket-komplit');
  const [singleLensChoice, setSingleLensChoice] = useState('Lensa Kit 16-50mm (Serbaguna/Vlog)');

  // 24-Hour time options list
  const timeSlots24h = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00'
  ];

  // Dates & hours (24h)
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [tanggalAmbil, setTanggalAmbil] = useState(todayStr);
  const [jamAmbil, setJamAmbil] = useState('08:00');
  const [tanggalKembali, setTanggalKembali] = useState(tomorrowStr);
  const [jamKembali, setJamKembali] = useState('08:00');

  // Delivery & Return
  const [deliveryOptionId, setDeliveryOptionId] = useState('antar-unila');
  const [sistemKembali, setSistemKembali] = useState('Antar ke Tempat Rental');

  // Single-choice guarantee identity (Wajib pilih 1)
  const [jaminanIdentitas, setJaminanIdentitas] = useState<'KTP Asli' | 'KTM / Kartu Pelajar Asli'>('KTP Asli');

  // Payment scheme (DP wajib 50k)
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

  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === deliveryOptionId) || DELIVERY_OPTIONS[0];
  const deliveryFee = selectedDelivery.fee;

  const grandTotal = basePrice + deliveryFee;
  const dpAmount = 50000;
  const sisaPelunasan = Math.max(0, grandTotal - dpAmount);

  const durasiLabel = selectedDurationKey === 'fullDay' 
    ? '1 Hari / Full Day (24 Jam)' 
    : selectedDurationKey === 'halfDay' 
      ? 'Setengah Hari (6–12 Jam)' 
      : 'Short Time (Maks. 4 Jam)';

  const handleKirimWA = () => {
    if (!nama.trim()) {
      alert('Mohon isi Nama Lengkap Penyewa terlebih dahulu.');
      return;
    }
    if (!whatsapp.trim()) {
      alert('Mohon isi No. WhatsApp Aktif.');
      return;
    }
    if (!alamatDomisili.trim()) {
      alert('Mohon isi Alamat Domisili Sekarang.');
      return;
    }

    const detailUnitKamera = selectedPackageId === 'paket-single-lens'
      ? `${currentPackage.name} (${singleLensChoice})`
      : currentPackage.name;

    const paymentText = skemaBayar === 'dp'
      ? `DP Booking : Rp 50.000 (Sisa pelunasan ${formatRupiah(sisaPelunasan)} saat serah terima)`
      : `Pembayaran Lunas : ${formatRupiah(grandTotal)} (Full Payment)`;

    const url = generateRentalWhatsAppUrl({
      nama,
      whatsapp,
      instagram: instagram || '-',
      alamatDomisili,
      paketNama: currentPackage.name,
      detailUnit: detailUnitKamera,
      durasiTipe: durasiLabel,
      durasiHari: selectedDurationKey === 'fullDay' ? 1 : 0.5,
      tarifTotal: grandTotal,
      skemaBayar: paymentText,
      tanggalAmbil,
      jamAmbil: `${jamAmbil} WIB`,
      tanggalKembali,
      jamKembali: `${jamKembali} WIB`,
      opsiPengantaran: `${selectedDelivery.label} (${selectedDelivery.note})`,
      sistemPengembalian: sistemKembali,
      jaminanIdentitas: `${jaminanIdentitas} (Wajib diserahkan fisik asli saat serah terima)`,
      aksesorisDefault: STANDARD_ACCESSORIES.join(', ')
    });

    window.open(url, '_blank');
  };

  const handleSalinFormat = async () => {
    const detailUnitKamera = selectedPackageId === 'paket-single-lens'
      ? `${currentPackage.name} (${singleLensChoice})`
      : currentPackage.name;

    const paymentText = skemaBayar === 'dp'
      ? `DP Booking Rp 50.000 (Sisa: ${formatRupiah(sisaPelunasan)})`
      : `Lunas (${formatRupiah(grandTotal)})`;

    const text = 
`FORMAT ORDER - SEWA KAMERA & GEAR
FOTONIC EQUIPMENT RENTAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DATA PENYEWA :
• Nama Lengkap : ${nama || '[Nama]'}
• No. WhatsApp : ${whatsapp || '[WhatsApp]'}
• Akun IG : ${instagram ? '@' + instagram.replace('@', '') : '-'}
• Domisili : ${alamatDomisili || '-'}

📸 DETAIL PERALATAN SEWA :
• Paket : ${detailUnitKamera}
• Durasi : ${durasiLabel}
• Pengantaran : ${selectedDelivery.label}
• Pengembalian : ${sistemKembali}

🗓️ JADWAL SEWA (FORMAT 24 JAM) :
• Pengambilan : ${tanggalAmbil} (${jamAmbil} WIB)
• Pengembalian : ${tanggalKembali} (${jamKembali} WIB)

🪪 JAMINAN IDENTITAS FISIK :
• ${jaminanIdentitas} (Wajib bawa asli saat serah terima)

💰 TOTAL TARIF & SKEMA :
• Total : ${formatRupiah(grandTotal)}
• Pembayaran : ${paymentText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    try {
      await navigator.clipboard.writeText(text);
      showToast('Format order sewa berhasil disalin ke clipboard!');
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
      setSingleLensChoice('Lensa Kit 16-50mm (Serbaguna/Vlog)');
      setDeliveryOptionId('antar-unila');
      setJaminanIdentitas('KTP Asli');
      setSkemaBayar('dp');
      showToast('Formulir berhasil di-reset.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Header Page */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981]/15 border border-[#10b981]/35 text-[#34d399] text-xs font-semibold mb-2.5">
          <Camera className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Fotonic Equipment Rental</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
          Format Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#10b981] to-[#059669]">Sewa Nikon Z50 Mark II</span>
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          Pilih durasi dan paket alat di bawah ini. Selesaikan pengisian form untuk mengirimkan rincian sewa resmi ke WhatsApp admin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Column: Form & Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* SECTION 1: Pilih Durasi & Paket Alat */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-stone-800">
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 text-[#34d399] flex items-center justify-center font-bold text-xs border border-[#10b981]/30">
                1
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#10b981]" />
                  Pilih Durasi &amp; Paket Kamera
                </h2>
                <p className="text-[11px] text-stone-400">Pricelist resmi sewa Nikon Z50 Mark II</p>
              </div>
            </div>

            {/* Durasi Buttons */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Pilih Durasi Sewa:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDurationKey('fullDay')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedDurationKey === 'fullDay'
                      ? 'border-[#10b981] bg-[#10b981]/15 text-white font-bold ring-1 ring-[#10b981]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs">1 Hari (24 Jam)</div>
                  <div className="text-[10px] text-[#34d399] mt-0.5 font-semibold">Full Day 🔥</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDurationKey('halfDay')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedDurationKey === 'halfDay'
                      ? 'border-[#10b981] bg-[#10b981]/15 text-white font-bold ring-1 ring-[#10b981]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs">Setengah Hari</div>
                  <div className="text-[10px] text-stone-300 mt-0.5">6–12 Jam</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDurationKey('shortTime')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedDurationKey === 'shortTime'
                      ? 'border-[#10b981] bg-[#10b981]/15 text-white font-bold ring-1 ring-[#10b981]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs">Short Time</div>
                  <div className="text-[10px] text-[#e5b869] mt-0.5">Maks. 4 Jam</div>
                </button>
              </div>
            </div>

            {/* List Paket Kamera */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Pilihan Paket Alat:
              </label>

              {KAMERA_PACKAGES.map(pkg => {
                const isSelected = pkg.id === selectedPackageId;
                const priceVal = pkg.pricing[selectedDurationKey];

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#10b981] bg-[#10b981]/10 ring-1 ring-[#10b981]/35'
                        : 'border-stone-800 bg-stone-950/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          isSelected ? 'border-[#10b981] bg-[#10b981]' : 'border-stone-600'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-stone-950 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-white">{pkg.name}</span>
                            {pkg.badge && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#10b981]/15 border border-[#10b981]/30 text-[#34d399] font-medium">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-300 mt-0.5">{pkg.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-xs sm:text-sm text-[#34d399] font-mono">
                          {formatRupiah(priceVal)}
                        </span>
                      </div>
                    </div>

                    {/* Wajib Pilih 1 Lensa Khusus Paket Single Lens */}
                    {pkg.id === 'paket-single-lens' && isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-stone-800 pl-6 sm:pl-7">
                        <span className="block text-[11px] font-bold text-[#34d399] uppercase tracking-wider mb-1.5">
                          Pilih 1 Lensa yang Digunakan (Wajib):
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
                                  ? 'border-[#10b981] bg-stone-900 text-white font-semibold'
                                  : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="singleLensOption"
                                checked={singleLensChoice === lens}
                                onChange={() => setSingleLensChoice(lens)}
                                className="accent-[#10b981] w-3.5 h-3.5"
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

            {/* Kelengkapan Bawaan Unit (Bahasa Indonesia Saja) */}
            <div className="mt-4 p-3.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                Kelengkapan Bawaan Unit (Termasuk Bebas Biaya):
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-300">
                {STANDARD_ACCESSORIES.map(acc => (
                  <li key={acc} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0"></span>
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </section>

          {/* SECTION 2: Opsi Pengantaran Kamera (Unila Free vs Luar Unila) */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-stone-800">
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 text-[#34d399] flex items-center justify-center font-bold text-xs border border-[#10b981]/30">
                2
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#10b981]" />
                  Opsi Pengantaran &amp; Pengambilan
                </h2>
                <p className="text-[11px] text-stone-400">Pilih titik serah terima kamera</p>
              </div>
            </div>

            <div className="space-y-2">
              {DELIVERY_OPTIONS.map(opt => {
                const isSelected = deliveryOptionId === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#10b981] bg-[#10b981]/10 ring-1 ring-[#10b981]/35 text-white'
                        : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="deliveryOption"
                        checked={isSelected}
                        onChange={() => setDeliveryOptionId(opt.id)}
                        className="accent-[#10b981] w-4 h-4 mt-0.5"
                      />
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-white">{opt.label}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{opt.note}</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#34d399] shrink-0">
                      {opt.fee === 0 ? 'Gratis' : `+${formatRupiah(opt.fee)}`}
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: Data Penyewa & Jadwal (24 JAM) */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-stone-800">
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 text-[#34d399] flex items-center justify-center font-bold text-xs border border-[#10b981]/30">
                3
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#10b981]" />
                  Data Penyewa &amp; Jadwal Sewa (Format 24 Jam)
                </h2>
                <p className="text-[11px] text-stone-400">Isi data identitas dan pilih jam pemesanan format 24 jam</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Nama Lengkap <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Muhammad Raihan Pratama"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#10b981]"
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
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Akun Instagram (Opsional)
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Contoh: @raihan.pratama"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Alamat Domisili Sekarang <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={alamatDomisili}
                    onChange={(e) => setAlamatDomisili(e.target.value)}
                    placeholder="Contoh: Kost Wisma Unila, Jl. Sumantri"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              {/* Jadwal Ambil & Kembali dalam Format 24 Jam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#34d399] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#10b981]" />
                    Waktu Pengambilan (24 Jam)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={tanggalAmbil}
                      onChange={(e) => setTanggalAmbil(e.target.value)}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white"
                    />
                    <select
                      value={jamAmbil}
                      onChange={(e) => setJamAmbil(e.target.value)}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white cursor-pointer"
                    >
                      {timeSlots24h.map(t => (
                        <option key={t} value={t}>{t} WIB</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#34d399] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#10b981]" />
                    Waktu Pengembalian (24 Jam)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={tanggalKembali}
                      onChange={(e) => setTanggalKembali(e.target.value)}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white"
                    />
                    <select
                      value={jamKembali}
                      onChange={(e) => setJamKembali(e.target.value)}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white cursor-pointer"
                    >
                      {timeSlots24h.map(t => (
                        <option key={t} value={t}>{t} WIB</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Jaminan Identitas (Wajib Pilih 1) */}
              <div className="pt-1">
                <span className="block text-[11px] font-bold text-[#e5b869] uppercase tracking-wider mb-2">
                  Jaminan Identitas Fisik (Wajib Pilih 1):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs ${
                    jaminanIdentitas === 'KTP Asli'
                      ? 'border-[#d6a350] bg-[#c89343]/15 text-white font-semibold'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}>
                    <input
                      type="radio"
                      name="jaminanRadio"
                      checked={jaminanIdentitas === 'KTP Asli'}
                      onChange={() => setJaminanIdentitas('KTP Asli')}
                      className="accent-[#d6a350] w-3.5 h-3.5"
                    />
                    <span>KTP Asli</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs ${
                    jaminanIdentitas === 'KTM / Kartu Pelajar Asli'
                      ? 'border-[#d6a350] bg-[#c89343]/15 text-white font-semibold'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}>
                    <input
                      type="radio"
                      name="jaminanRadio"
                      checked={jaminanIdentitas === 'KTM / Kartu Pelajar Asli'}
                      onChange={() => setJaminanIdentitas('KTM / Kartu Pelajar Asli')}
                      className="accent-[#d6a350] w-3.5 h-3.5"
                    />
                    <span>KTM / Kartu Pelajar Asli</span>
                  </label>
                </div>
              </div>

            </div>
          </section>

          {/* S&K Ringkas */}
          <section className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 text-xs text-stone-300 space-y-2">
            <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#10b981]" />
              Ketentuan Sewa Fotonic:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-400">
              {RENTAL_RULES.map((rule, idx) => (
                <li key={idx} className="p-2 rounded-lg bg-stone-950 border border-stone-800/70">
                  <span className="font-semibold text-[#34d399] block mb-0.5">{rule.title}</span>
                  {rule.desc}
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* Right Column: Live Order Preview & Mobile Optimized Card (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                <h3 className="font-bold text-sm sm:text-base text-white">Rincian &amp; Total Tarif</h3>
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

            {/* Price Box */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1.5 text-xs mb-3.5">
              <div className="flex justify-between items-center text-stone-300">
                <span className="font-medium text-[11px]">{currentPackage.name}</span>
                <span className="font-bold text-[#34d399] font-mono">{formatRupiah(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-stone-400 text-[10px]">
                <span>Durasi: {durasiLabel}</span>
                <span>{selectedPackageId === 'paket-single-lens' ? singleLensChoice : 'Termasuk 2 Baterai'}</span>
              </div>
              <div className="flex justify-between items-center text-stone-300 pt-1 border-t border-stone-900 text-[11px]">
                <span>Pengantaran: {selectedDelivery.label}</span>
                <span className="font-bold text-[#34d399] font-mono">
                  {deliveryFee === 0 ? 'Gratis' : `+${formatRupiah(deliveryFee)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs sm:text-sm">
                <span className="font-bold text-white">Total Tarif:</span>
                <span className="font-extrabold text-[#f2cf83] text-sm sm:text-base font-mono">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Skema Pembayaran (DP Wajib 50k) */}
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
                      ? 'border-[#10b981] bg-[#10b981]/15 text-white ring-1 ring-[#10b981]/40'
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
                      ? 'border-[#10b981] bg-[#10b981]/15 text-white ring-1 ring-[#10b981]/40'
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
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4ade80] via-[#10b981] to-[#059669] hover:brightness-105 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/25 active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4 text-stone-950" />
                <span>Kirim Format Sewa via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleSalinFormat}
                className="w-full py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Format Teks</span>
              </button>
            </div>

            <p className="text-center text-[10px] text-stone-500 mt-2.5">
              WhatsApp Admin Resmi: <strong className="text-stone-300 font-mono">{ADMIN_WHATSAPP_DISPLAY}</strong>
            </p>

          </div>

          {/* Quick Switch to Photo Card */}
          <div className="p-3.5 rounded-xl bg-[#c89343]/10 border border-[#c89343]/30 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Butuh Jasa Fotografer Wisuda?</span>
              <p className="text-stone-400 text-[11px] mt-0.5">Sesi foto personal &amp; group mulai Rp 80k.</p>
            </div>
            <Link
              href="/jasa-foto"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#e7bd70] via-[#d6a350] to-[#be8638] text-stone-950 font-bold shrink-0 flex items-center gap-1 shadow"
            >
              <span>Jasa Foto</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 border border-[#10b981] text-white px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-[#34d399]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

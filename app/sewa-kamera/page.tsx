'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Calendar, Clock, ShieldAlert, Check, Copy, Send, RotateCcw, CheckCircle2, ChevronRight, Truck, Lock, ArrowDown, Plus, Minus, Tag, X } from 'lucide-react';
import { KAMERA_PACKAGES, STANDARD_ACCESSORIES, DELIVERY_OPTIONS, RENTAL_RULES } from '@/data/kameraCatalog';
import { generateRentalWhatsAppUrl, formatRupiah, ADMIN_WHATSAPP_DISPLAY } from '@/lib/whatsapp';
import { submitOrderToSheet, validatePromoCode, PromoValidationResponse } from '@/lib/googleSheets';

export default function SewaKameraPage() {
  // Form states
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [alamatDomisili, setAlamatDomisili] = useState('');

  // Package & duration selection (must select main package first)
  const [selectedDurationKey, setSelectedDurationKey] = useState<'fullDay' | 'halfDay' | 'shortTime' | 'multiDay'>('fullDay');
  const [rentalDays, setRentalDays] = useState<number>(2);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [singleLensChoice, setSingleLensChoice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promo code states
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoValidationResponse | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Local date helpers
  const formatLocalDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const addDaysToDate = (dateStr: string, days: number) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + days);
    return formatLocalDate(dt);
  };

  const todayStr = formatLocalDate(new Date());
  const tomorrowStr = addDaysToDate(todayStr, 1);

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
  const currentPackage = KAMERA_PACKAGES.find(p => p.id === selectedPackageId) || null;
  const isPackageReady = Boolean(
    currentPackage &&
    (selectedPackageId !== 'paket-single-lens' || singleLensChoice)
  );
  const dailyRate = currentPackage ? currentPackage.pricing.fullDay : 0;
  const basePrice = !currentPackage
    ? 0
    : selectedDurationKey === 'multiDay'
      ? dailyRate * rentalDays
      : currentPackage.pricing[selectedDurationKey];

  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === deliveryOptionId) || DELIVERY_OPTIONS[0];
  const deliveryFee = currentPackage ? selectedDelivery.fee : 0;

  const subtotalTarif = currentPackage ? basePrice + deliveryFee : 0;
  const promoDiscount = appliedPromo?.valid && appliedPromo.discountAmount
    ? Math.min(appliedPromo.discountAmount, subtotalTarif)
    : 0;
  const grandTotal = Math.max(0, subtotalTarif - promoDiscount);
  const dpAmount = Math.min(50000, grandTotal);
  const sisaPelunasan = Math.max(0, grandTotal - dpAmount);

  const durasiLabel = selectedDurationKey === 'multiDay'
    ? `${rentalDays} Hari (${rentalDays * 24} Jam)`
    : selectedDurationKey === 'fullDay'
      ? '1 Hari / Full Day (24 Jam)'
      : selectedDurationKey === 'halfDay'
        ? 'Setengah Hari (6–12 Jam)'
        : 'Short Time (Maks. 4 Jam)';

  const syncReturnDateForDuration = (
    durKey: 'fullDay' | 'halfDay' | 'shortTime' | 'multiDay',
    daysCount: number,
    startDate: string
  ) => {
    const offset = durKey === 'multiDay' ? daysCount : durKey === 'fullDay' ? 1 : 0;
    setTanggalKembali(addDaysToDate(startDate, offset));
  };

  const handleSelectDuration = (durKey: 'fullDay' | 'halfDay' | 'shortTime' | 'multiDay') => {
    setSelectedDurationKey(durKey);
    syncReturnDateForDuration(durKey, rentalDays, tanggalAmbil);
    setAppliedPromo(null);
    setPromoError(null);
  };

  const handleChangeRentalDays = (nextDays: number) => {
    const clamped = Math.max(2, Math.min(30, nextDays));
    setRentalDays(clamped);
    if (selectedDurationKey === 'multiDay') {
      syncReturnDateForDuration('multiDay', clamped, tanggalAmbil);
      setAppliedPromo(null);
      setPromoError(null);
    }
  };

  const handleApplyPromo = async () => {
    if (!currentPackage) {
      setPromoError('Pilih paket utama terlebih dahulu.');
      return;
    }
    if (!promoInput.trim()) {
      setPromoError('Masukkan kode promo terlebih dahulu.');
      return;
    }
    setPromoLoading(true);
    setPromoError(null);
    const res = await validatePromoCode({
      code: promoInput.trim(),
      serviceType: 'sewa',
      packageId: currentPackage.id,
      packageName: currentPackage.name,
      packageCategory: currentPackage.category,
      subtotal: subtotalTarif,
    });
    setPromoLoading(false);
    if (res.valid) {
      setAppliedPromo(res);
      setPromoError(null);
      showToast(`Kode promo ${res.code} berhasil diterapkan!`);
    } else {
      setAppliedPromo(null);
      setPromoError(res.message || 'Kode promo tidak valid.');
    }
  };

  const handleClearPromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError(null);
  };

  const handleKirimWA = async () => {
    if (!currentPackage || !isPackageReady) {
      alert('Silakan pilih Paket Utama (dan lensa jika Single Lens) terlebih dahulu.');
      return;
    }
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
      ? `DP Booking : ${formatRupiah(dpAmount)} (Sisa pelunasan ${formatRupiah(sisaPelunasan)} saat serah terima)`
      : `Pembayaran Lunas : ${formatRupiah(grandTotal)} (Full Payment)`;

    setIsSubmitting(true);
    await submitOrderToSheet({
      type: 'sewa',
      status: 'Pending',
      nama,
      whatsapp,
      instagram: instagram || '-',
      alamatDomisili,
      paketId: currentPackage.id,
      paketNama: currentPackage.name,
      detailUnit: detailUnitKamera,
      durasiTipe: durasiLabel,
      tanggalAmbil,
      jamAmbil,
      tanggalKembali,
      jamKembali,
      opsiPengantaran: `${selectedDelivery.label} (${selectedDelivery.note})`,
      jaminanIdentitas,
      subtotalTarif,
      kodePromo: appliedPromo?.valid ? appliedPromo.code : undefined,
      potonganPromo: promoDiscount,
      tarifTotal: grandTotal,
      skemaBayar: paymentText,
    });
    setIsSubmitting(false);

    const url = generateRentalWhatsAppUrl({
      nama,
      whatsapp,
      instagram: instagram || '-',
      alamatDomisili,
      paketNama: currentPackage.name,
      detailUnit: detailUnitKamera,
      durasiTipe: durasiLabel,
      durasiHari: selectedDurationKey === 'multiDay' ? rentalDays : selectedDurationKey === 'fullDay' ? 1 : 0.5,
      kodePromo: appliedPromo?.valid ? appliedPromo.code : undefined,
      potonganPromo: promoDiscount,
      tarifTotal: grandTotal,
      skemaBayar: paymentText,
      tanggalAmbil,
      jamAmbil: jamAmbil,
      tanggalKembali,
      jamKembali: jamKembali,
      opsiPengantaran: `${selectedDelivery.label} (${selectedDelivery.note})`,
      sistemPengembalian: sistemKembali,
      jaminanIdentitas: `${jaminanIdentitas} (Wajib diserahkan fisik asli saat serah terima)`,
      aksesorisDefault: STANDARD_ACCESSORIES.join(', ')
    });

    window.open(url, '_blank');
  };

  const handleSalinFormat = async () => {
    if (!currentPackage || !isPackageReady) {
      alert('Silakan pilih Paket Utama terlebih dahulu.');
      return;
    }
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

🗓️ JADWAL SEWA :
• Pengambilan : ${tanggalAmbil} (${jamAmbil} WIB)
• Pengembalian : ${tanggalKembali} (${jamKembali} WIB)

🪪 JAMINAN IDENTITAS FISIK :
• ${jaminanIdentitas} (Wajib bawa asli saat serah terima)

💰 TOTAL TARIF & SKEMA :${
  appliedPromo?.valid && promoDiscount > 0
    ? `\n• Kode Promo : ${appliedPromo.code} (-${formatRupiah(promoDiscount)})`
    : ''
}
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
      setRentalDays(2);
      setSelectedPackageId('');
      setSingleLensChoice('');
      setDeliveryOptionId('antar-unila');
      setJaminanIdentitas('KTP Asli');
      setSkemaBayar('dp');
      setPromoInput('');
      setAppliedPromo(null);
      setPromoError(null);
      showToast('Formulir berhasil di-reset.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Header Page */}
      <div className="max-w-2xl mb-8 sm:mb-12">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Fotonic · Sewa Kamera</p>
        <h1 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.1] text-white">
          Format order sewa<br />Nikon Z50 Mark II
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">Pilih durasi dan paket alat, lengkapi data, lalu kirim rincian sewa ke WhatsApp admin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Column: Form & Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 min-w-0 w-full">
          
          {/* SECTION 1: Pilih Durasi & Paket Alat */}
          <section className="bg-stone-900/80 border border-stone-800 rounded-lg p-4 sm:p-6 ">
            <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-white/10">
              <span className="font-display text-xl text-gold shrink-0 w-6">1</span>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDuration('fullDay')}
                  className={`p-2.5 rounded-md border text-center transition-all ${
                    selectedDurationKey === 'fullDay'
                      ? 'border-[#d6a85a] bg-[#d6a85a]/15 text-white font-bold ring-1 ring-[#d6a85a]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs">1 Hari (24 Jam)</div>
                  <div className="text-[10px] text-[#e5b869] mt-0.5 font-semibold">Full Day</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDuration('multiDay')}
                  className={`p-2.5 rounded-md border text-center transition-all ${
                    selectedDurationKey === 'multiDay'
                      ? 'border-[#d6a85a] bg-[#d6a85a]/15 text-white font-bold ring-1 ring-[#d6a85a]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs">&gt; 1 Hari</div>
                  <div className="text-[10px] text-[#e5b869] mt-0.5 font-semibold">Multi-Hari</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDuration('halfDay')}
                  className={`p-2.5 rounded-md border text-center transition-all ${
                    selectedDurationKey === 'halfDay'
                      ? 'border-[#d6a85a] bg-[#d6a85a]/15 text-white font-bold ring-1 ring-[#d6a85a]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs">Setengah Hari</div>
                  <div className="text-[10px] text-stone-300 mt-0.5">6–12 Jam</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDuration('shortTime')}
                  className={`p-2.5 rounded-md border text-center transition-all ${
                    selectedDurationKey === 'shortTime'
                      ? 'border-[#d6a85a] bg-[#d6a85a]/15 text-white font-bold ring-1 ring-[#d6a85a]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs">Short Time</div>
                  <div className="text-[10px] text-[#e5b869] mt-0.5">Maks. 4 Jam</div>
                </button>
              </div>

              {selectedDurationKey === 'multiDay' && (
                <div className="mt-2.5 p-3 rounded-md bg-stone-950 border border-[#d6a85a]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="text-xs font-bold text-white block">Jumlah Hari Sewa</span>
                    <span className="text-[11px] text-stone-400">
                      Tarif dihitung otomatis: Harga 1 Hari × {rentalDays} hari (Tanggal kembali disesuaikan)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center bg-stone-900 border border-stone-800 rounded-md p-1">
                    <button
                      type="button"
                      disabled={rentalDays <= 2}
                      onClick={() => handleChangeRentalDays(rentalDays - 1)}
                      className="w-7 h-7 rounded flex items-center justify-center bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30 transition-colors"
                      aria-label="Kurangi hari"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="min-w-[56px] text-center font-bold text-xs font-mono text-[#f0cf8e]">
                      {rentalDays} Hari
                    </span>
                    <button
                      type="button"
                      disabled={rentalDays >= 30}
                      onClick={() => handleChangeRentalDays(rentalDays + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center bg-[#d6a85a]/20 text-[#e5b869] hover:bg-[#d6a85a] hover:text-stone-950 disabled:opacity-30 transition-colors"
                      aria-label="Tambah hari"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* List Paket Kamera */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Pilihan Paket Alat:
              </label>

              {KAMERA_PACKAGES.map(pkg => {
                const isSelected = pkg.id === selectedPackageId;
                const priceVal =
                  selectedDurationKey === 'multiDay'
                    ? pkg.pricing.fullDay * rentalDays
                    : pkg.pricing[selectedDurationKey];

                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      setSelectedPackageId(pkg.id);
                      setAppliedPromo(null);
                      setPromoError(null);
                    }}
                    className={`p-3 sm:p-4 rounded-md border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#d6a85a] bg-[#d6a85a]/10 ring-1 ring-[#d6a85a]/35'
                        : 'border-stone-800 bg-stone-950/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          isSelected ? 'border-[#d6a85a] bg-[#d6a85a]' : 'border-stone-600'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-stone-950 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-white">{pkg.name}</span>
                            {pkg.badge && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#d6a85a]/15 border border-[#d6a85a]/30 text-[#e5b869] font-medium">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-300 mt-0.5">{pkg.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-xs sm:text-sm text-[#e5b869] font-mono">
                          {formatRupiah(priceVal)}
                        </span>
                      </div>
                    </div>

                    {/* Wajib Pilih 1 Lensa Khusus Paket Single Lens */}
                    {pkg.id === 'paket-single-lens' && isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-stone-800 pl-6 sm:pl-7">
                        <span className="block text-[11px] font-bold text-[#e5b869] uppercase tracking-wider mb-1.5">
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
                                  ? 'border-[#d6a85a] bg-stone-900 text-white font-semibold'
                                  : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="singleLensOption"
                                checked={singleLensChoice === lens}
                                onChange={() => setSingleLensChoice(lens)}
                                className="accent-[#d6a85a] w-3.5 h-3.5"
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
            <div className="mt-4 p-3.5 rounded-md bg-stone-950 border border-stone-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d6a85a]" />
                Kelengkapan Bawaan Unit (Termasuk Bebas Biaya):
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-300">
                {STANDARD_ACCESSORIES.map(acc => (
                  <li key={acc} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d6a85a] shrink-0"></span>
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gate prompt: must select main package first */}
            <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {isPackageReady ? (
                <>
                  <span className="text-xs text-[#e5b869] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Paket utama terpilih: <strong className="text-white">{currentPackage?.name}</strong>
                  </span>
                  <a
                    href="#step-2-sewa"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-[#d6a85a] text-stone-950 font-bold text-xs hover:brightness-105 transition-all shrink-0"
                  >
                    <span>Lanjut ke Menu Berikutnya</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                </>
              ) : (
                <span className="text-xs text-stone-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#e5b869] shrink-0" />
                  {selectedPackageId === 'paket-single-lens'
                    ? 'Pilih 1 lensa pada paket Single Lens di atas untuk membuka menu selanjutnya.'
                    : 'Pilih salah satu paket utama di atas terlebih dahulu untuk membuka menu selanjutnya.'}
                </span>
              )}
            </div>

          </section>

          {/* SECTION 2: Opsi Pengantaran Kamera (Unila Free vs Luar Unila) */}
          <section id="step-2-sewa" className={`bg-stone-900/80 border border-stone-800 rounded-lg p-4 sm:p-6 transition-opacity ${!isPackageReady ? 'opacity-55' : ''}`}>
            <div className="flex items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="font-display text-xl text-gold shrink-0 w-6">2</span>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Opsi Pengantaran &amp; Pengambilan
                  </h2>
                  <p className="text-[11px] text-stone-400">Pilih titik serah terima kamera</p>
                </div>
              </div>
              {!isPackageReady && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#e5b869] bg-[#d6a85a]/10 border border-[#d6a85a]/30 px-2 py-1 rounded">
                  <Lock className="w-3 h-3" />
                  Pilih Paket Dulu
                </span>
              )}
            </div>

            <div className={`space-y-2 ${!isPackageReady ? 'pointer-events-none select-none' : ''}`}>
              {DELIVERY_OPTIONS.map(opt => {
                const isSelected = deliveryOptionId === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start justify-between gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#d6a85a] bg-[#d6a85a]/10 ring-1 ring-[#d6a85a]/35 text-white'
                        : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="deliveryOption"
                        checked={isSelected}
                        onChange={() => setDeliveryOptionId(opt.id)}
                        className="accent-[#d6a85a] w-4 h-4 mt-0.5"
                      />
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-white">{opt.label}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{opt.note}</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#e5b869] shrink-0">
                      {opt.fee === 0 ? 'Gratis' : `+${formatRupiah(opt.fee)}`}
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: Data Penyewa & Jadwal */}
          <section className={`bg-stone-900/80 border border-stone-800 rounded-lg p-4 sm:p-6 transition-opacity ${!isPackageReady ? 'opacity-55' : ''}`}>
            <div className="flex items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="font-display text-xl text-gold shrink-0 w-6">3</span>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Data Penyewa &amp; Jadwal Sewa
                  </h2>
                  <p className="text-[11px] text-stone-400">Isi data identitas dan tentukan jadwal sewa alat</p>
                </div>
              </div>
              {!isPackageReady && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#e5b869] bg-[#d6a85a]/10 border border-[#d6a85a]/30 px-2 py-1 rounded">
                  <Lock className="w-3 h-3" />
                  Pilih Paket Dulu
                </span>
              )}
            </div>

            <div className={`space-y-3.5 ${!isPackageReady ? 'pointer-events-none select-none' : ''}`}>
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
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a85a]"
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
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a85a]"
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
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a85a]"
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
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-md text-xs sm:text-sm text-white focus:outline-none focus:border-[#d6a85a]"
                  />
                </div>
              </div>

              {/* Jadwal Ambil & Kembali */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-stone-950 rounded-md border border-stone-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#e5b869] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d6a85a]" />
                    Waktu Pengambilan
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      min={todayStr}
                      value={tanggalAmbil}
                      onChange={(e) => {
                        const newAmbil = e.target.value;
                        setTanggalAmbil(newAmbil);
                        if (newAmbil) {
                          syncReturnDateForDuration(selectedDurationKey, rentalDays, newAmbil);
                        }
                      }}
                      style={{ colorScheme: 'dark' }}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#d6a85a]"
                    />
                    <input
                      type="time"
                      value={jamAmbil}
                      onChange={(e) => setJamAmbil(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#d6a85a]"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-stone-950 rounded-md border border-stone-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#e5b869] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d6a85a]" />
                    Waktu Pengembalian
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      min={tanggalAmbil || todayStr}
                      value={tanggalKembali}
                      onChange={(e) => setTanggalKembali(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#d6a85a]"
                    />
                    <input
                      type="time"
                      value={jamKembali}
                      onChange={(e) => setJamKembali(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#d6a85a]"
                    />
                  </div>
                </div>
              </div>

              {/* Jaminan Identitas (Wajib Pilih 1) */}
              <div className="pt-1">
                <span className="block text-[11px] font-bold text-[#e5b869] uppercase tracking-wider mb-2">
                  Jaminan Identitas Fisik (Wajib Pilih 1):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2.5 rounded-md border cursor-pointer text-xs ${
                    jaminanIdentitas === 'KTP Asli'
                      ? 'border-[#d6a85a] bg-[#d6a85a]/15 text-white font-semibold'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}>
                    <input
                      type="radio"
                      name="jaminanRadio"
                      checked={jaminanIdentitas === 'KTP Asli'}
                      onChange={() => setJaminanIdentitas('KTP Asli')}
                      className="accent-[#d6a85a] w-3.5 h-3.5"
                    />
                    <span>KTP Asli</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-md border cursor-pointer text-xs ${
                    jaminanIdentitas === 'KTM / Kartu Pelajar Asli'
                      ? 'border-[#d6a85a] bg-[#d6a85a]/15 text-white font-semibold'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}>
                    <input
                      type="radio"
                      name="jaminanRadio"
                      checked={jaminanIdentitas === 'KTM / Kartu Pelajar Asli'}
                      onChange={() => setJaminanIdentitas('KTM / Kartu Pelajar Asli')}
                      className="accent-[#d6a85a] w-3.5 h-3.5"
                    />
                    <span>KTM / Kartu Pelajar Asli</span>
                  </label>
                </div>
              </div>

            </div>
          </section>

          {/* S&K Ringkas */}
          <section className="bg-stone-900/60 border border-stone-800 rounded-lg p-4 sm:p-5 text-xs text-stone-300 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#d6a85a]/15 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-3.5 h-3.5 text-[#d6a85a]" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-white">
                Ketentuan Sewa Fotonic:
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {RENTAL_RULES.map((rule, idx) => (
                <div key={idx} className="p-2.5 rounded-md bg-stone-950/70 border border-stone-800/80">
                  <span className="font-semibold text-[#e5b869] block mb-0.5">{rule.title}</span>
                  <p className="text-stone-400 leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Live Order Preview & Mobile Optimized Card (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4 min-w-0 w-full">
          
          <div className="bg-stone-900/90 border border-stone-800 rounded-lg p-4 sm:p-5 ">
            
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d6a85a]"></span>
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
            <div className="bg-stone-950 p-3.5 rounded-md border border-stone-800 space-y-1.5 text-xs mb-3.5">
              <div className="flex justify-between items-center text-stone-300">
                <span className="font-medium text-[11px]">{currentPackage ? currentPackage.name : 'Belum ada paket dipilih'}</span>
                <span className="font-bold text-[#e5b869] font-mono">{formatRupiah(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-stone-400 text-[10px]">
                <span>
                  Durasi: {durasiLabel}
                  {currentPackage && selectedDurationKey === 'multiDay' ? ` (${formatRupiah(dailyRate)} × ${rentalDays})` : ''}
                </span>
                <span>
                  {!currentPackage
                    ? 'Pilih paket di Bagian 1'
                    : selectedPackageId === 'paket-single-lens'
                      ? (singleLensChoice || 'Pilih 1 lensa')
                      : 'Termasuk 2 Baterai'}
                </span>
              </div>
              <div className="flex justify-between items-center text-stone-300 pt-1 border-t border-stone-900 text-[11px]">
                <span>Pengantaran: {selectedDelivery.label}</span>
                <span className="font-bold text-[#e5b869] font-mono">
                  {!currentPackage ? '-' : deliveryFee === 0 ? 'Gratis' : `+${formatRupiah(deliveryFee)}`}
                </span>
              </div>
              {appliedPromo?.valid && promoDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-400 pt-1 border-t border-stone-900 text-[11px]">
                  <span>Promo ({appliedPromo.code}):</span>
                  <span className="font-bold font-mono">-{formatRupiah(promoDiscount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs sm:text-sm">
                <span className="font-bold text-white">Total Tarif:</span>
                <span className="font-extrabold text-[#f0cf8e] text-sm sm:text-base font-mono">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Kode Promo Input */}
            <div className="mb-3.5">
              <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#e5b869]" />
                <span>Kode Promo (Opsional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled={!isPackageReady || Boolean(appliedPromo?.valid)}
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value.toUpperCase());
                    if (promoError) setPromoError(null);
                  }}
                  placeholder={isPackageReady ? 'Masukkan kode promo' : 'Pilih paket utama dulu'}
                  className="flex-1 min-w-0 px-3 py-2 bg-stone-950 border border-stone-800 rounded-md text-xs text-white uppercase placeholder:normal-case focus:outline-none focus:border-[#d6a85a] disabled:opacity-45"
                />
                {appliedPromo?.valid ? (
                  <button
                    type="button"
                    onClick={handleClearPromo}
                    className="px-3 py-2 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!isPackageReady || promoLoading || !promoInput.trim()}
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 rounded-md bg-[#d6a85a]/20 hover:bg-[#d6a85a] text-[#e5b869] hover:text-stone-950 border border-[#d6a85a]/40 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-colors shrink-0"
                  >
                    {promoLoading ? 'Cek...' : 'Pakai'}
                  </button>
                )}
              </div>
              {promoError && <p className="mt-1 text-[11px] text-rose-400">{promoError}</p>}
              {appliedPromo?.valid && (
                <p className="mt-1 text-[11px] text-emerald-400">
                  ✓ {appliedPromo.description} (Hemat {formatRupiah(promoDiscount)})
                </p>
              )}
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
                  className={`p-2 rounded-md border text-center text-xs font-semibold transition-all ${
                    skemaBayar === 'dp'
                      ? 'border-[#d6a85a] bg-[#d6a85a]/15 text-white ring-1 ring-[#d6a85a]/40'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}
                >
                  <div className="font-bold text-white">DP {formatRupiah(dpAmount)}</div>
                  <span className="text-[10px] text-stone-400 font-normal">Sisa: {formatRupiah(sisaPelunasan)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSkemaBayar('lunas')}
                  className={`p-2 rounded-md border text-center text-xs font-semibold transition-all ${
                    skemaBayar === 'lunas'
                      ? 'border-[#d6a85a] bg-[#d6a85a]/15 text-white ring-1 ring-[#d6a85a]/40'
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
                disabled={!isPackageReady || isSubmitting}
                onClick={handleKirimWA}
                className="w-full py-3 px-4 rounded-md bg-[#d6a85a] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[#d6a85a]/25 active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4 text-stone-950" />
                <span>
                  {!isPackageReady
                    ? 'Pilih Paket Utama Terlebih Dahulu'
                    : isSubmitting
                      ? 'Menyimpan ke Spreadsheet...'
                      : 'Kirim Format Sewa via WhatsApp'}
                </span>
              </button>

              <button
                type="button"
                disabled={!isPackageReady}
                onClick={handleSalinFormat}
                className="w-full py-2 px-3 rounded-md bg-stone-950 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed border border-stone-800 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
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
          <div className="p-3.5 rounded-md bg-[#d6a85a]/10 border border-[#d6a85a]/30 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Butuh Jasa Fotografer Wisuda?</span>
              <p className="text-stone-400 text-[11px] mt-0.5">Sesi foto personal &amp; group mulai Rp 80k.</p>
            </div>
            <Link
              href="/jasa-foto"
              className="px-3 py-1.5 rounded-lg bg-[#d6a85a] text-stone-950 font-bold shrink-0 flex items-center gap-1 shadow"
            >
              <span>Jasa Foto</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 border border-[#d6a85a] text-white px-3.5 py-2.5 rounded-md  flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-[#e5b869]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

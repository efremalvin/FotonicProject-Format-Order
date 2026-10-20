// Helper Engine WhatsApp Generator Fotonic
// File: lib/whatsapp.ts

export const ADMIN_WHATSAPP_NUMBER = '6281994218428';
export const ADMIN_WHATSAPP_DISPLAY = '+62 819-9421-8428';

export interface FotoOrderData {
  nama: string;
  whatsapp: string;
  kampus: string;
  paketNama: string;
  paketKategori: string;
  paketHarga: number;
  durasi: string;
  spotFoto: string;
  editFoto: string;
  fasilitas: string[];
  addOns: { name: string; price: number }[];
  totalHarga: number;
  skemaBayar: string;
  tanggalSesi: string;
  jamSesi: string;
  lokasiTipe: string;
  lokasiDetail: string;
  jumlahOrang: string;
  catatanKhusus: string;
}

export interface RentalOrderData {
  nama: string;
  whatsapp: string;
  instagram: string;
  alamatDomisili: string;
  paketNama: string;
  detailUnit: string;
  durasiTipe: string;
  durasiHari: number;
  tarifTotal: number;
  skemaBayar: string;
  tanggalAmbil: string;
  jamAmbil: string;
  tanggalKembali: string;
  jamKembali: string;
  sistemAmbil: string;
  sistemKembali: string;
  extraGear: { name: string; price: number }[];
  jaminanIdentitas: string[];
  aksesorisDefault: string;
}

export function formatRupiah(num: number): string {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

export function generateFotoWhatsAppUrl(order: FotoOrderData): string {
  const addOnsText = order.addOns.length > 0
    ? order.addOns.map(a => `• ${a.name} (${formatRupiah(a.price)})`).join('\n')
    : 'Tidak ada (Paket Utama Saja)';

  const message = 
`FORMAT BOOKING - JASA FOTO & DOKUMENTASI
FOTONIC PHOTOGRAPHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 DATA KLIEN / WISUDAWAN :
• Nama Lengkap : ${order.nama || '-'}
• No. WhatsApp : ${order.whatsapp || '-'}
• Kampus / Instansi : ${order.kampus || '-'}

📸 DETAIL PAKET FOTO :
• Kategori : ${order.paketKategori}
• Nama Paket : ${order.paketNama} (${formatRupiah(order.paketHarga)})
• Durasi Sesi : ${order.durasi}
• Spot Foto : ${order.spotFoto}
• Output Edit : ${order.editFoto}
• Fasilitas : ${order.fasilitas.join(', ')}

✨ LAYANAN ADD-ON :
${addOnsText}

🗓️ JADWAL & LOKASI PEMOTRETAN :
• Tanggal Sesi : ${order.tanggalSesi || '-'}
• Jam Sesi : Pukul ${order.jamSesi || '-'} WIB
• Kategori Lokasi : ${order.lokasiTipe}
• Titik Kumpul Spesifik : ${order.lokasiDetail || '-'}
• Estimasi Jumlah Orang : ${order.jumlahOrang || '-'}
• Catatan / Konsep : ${order.catatanKhusus || '-'}

💰 TOTAL BIAYA & SKEMA PEMBAYARAN :
• Total Biaya : ${formatRupiah(order.totalHarga)}
• Skema Bayar : ${order.skemaBayar}

⚠️ CATATAN :
Klien memahami ketentuan DP Rp 50.000 / Pelunasan sebagai penguncian slot jadwal fotografer resmi. Fotografer akan standby di lokasi 15 menit sebelum waktu pemotretan.
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Halo kak, mohon konfirmasi slot fotografer untuk jadwal dan paket di atas ya. Terima kasih!`;

  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateRentalWhatsAppUrl(order: RentalOrderData): string {
  const extraGearText = order.extraGear.length > 0
    ? order.extraGear.map(g => `• ${g.name} (${formatRupiah(g.price)})`).join('\n')
    : 'Tidak ada';

  const jaminanText = order.jaminanIdentitas.length > 0
    ? order.jaminanIdentitas.join(' & ')
    : 'Belum dipilih (Wajib Bawa Asli Saat Serah Terima)';

  const message = 
`FORMAT ORDER - SEWA KAMERA & GEAR
FOTONIC EQUIPMENT RENTAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DATA PENYEWA :
• Nama Lengkap : ${order.nama || '-'}
• No. WhatsApp : ${order.whatsapp || '-'}
• Akun Instagram : ${order.instagram ? '@' + order.instagram.replace('@', '') : '-'}
• Alamat Domisili Sekarang : ${order.alamatDomisili || '-'}

📸 DETAIL PERALATAN SEWA :
• Paket Sewa : ${order.paketNama}
• Unit Kamera/Lensa : ${order.detailUnit}
• Aksesoris Bawaan : ${order.aksesorisDefault}
• Tambahan Extra Gear :
${extraGearText}

⏱️ DURASI & JADWAL SEWA :
• Opsi Durasi : ${order.durasiTipe} (${order.durasiHari} Hari)
• Jadwal Pengambilan : ${order.tanggalAmbil} (Pukul ${order.jamAmbil} WIB)
• Jadwal Pengembalian : ${order.tanggalKembali} (Pukul ${order.jamKembali} WIB)
• Sistem Pengambilan : ${order.sistemAmbil}
• Sistem Pengembalian : ${order.sistemKembali}

🪪 JAMINAN IDENTITAS (Wajib Bawa Fisik Asli) :
• ${jaminanText}

💰 TOTAL TARIF & PEMBAYARAN :
• Total Biaya Sewa : ${formatRupiah(order.tarifTotal)}
• Skema Pembayaran : ${order.skemaBayar}

⚠️ S&K RENTAL :
Penyewa menyetujui S&K: Wajib menyerahkan identitas asli, DP untuk booking unit, toleransi keterlambatan 1–2 jam dengan info admin, dan bertanggung jawab penuh atas keutuhan alat selama masa sewa.
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Halo admin Fotonic Rental, mohon konfirmasi ketersediaan alat dan nomor rekening untuk booking unit ya. Terima kasih!`;

  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

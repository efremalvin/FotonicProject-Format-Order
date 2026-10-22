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
  addOns: { name: string; price: number; count?: number }[];
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
  opsiPengantaran: string;
  sistemPengembalian: string;
  jaminanIdentitas: string;
  aksesorisDefault: string;
}

export function formatRupiah(num: number): string {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

export function generateFotoWhatsAppUrl(order: FotoOrderData): string {
  const addOnsText = order.addOns.length > 0
    ? order.addOns.map(a => {
        if (a.price === 0) return `• ${a.name} (Promo Free)`;
        if (a.count && a.count > 1) return `• ${a.name} x${a.count} (${formatRupiah(a.price * a.count)})`;
        return `• ${a.name} (${formatRupiah(a.price)})`;
      }).join('\n')
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
Klien memahami ketentuan DP Rp 50.000 / Pelunasan sebagai penguncian slot jadwal fotografer resmi. Fotografer hadir 15 menit sebelum waktu pemotretan.
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Halo kak, mohon konfirmasi slot fotografer untuk jadwal dan paket di atas ya. Terima kasih!`;

  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateRentalWhatsAppUrl(order: RentalOrderData): string {
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
• Unit Kamera / Lensa : ${order.detailUnit}
• Kelengkapan Bawaan : ${order.aksesorisDefault}

⏱️ DURASI & JADWAL SEWA :
• Opsi Durasi : ${order.durasiTipe}
• Jadwal Pengambilan : ${order.tanggalAmbil} (Pukul ${order.jamAmbil} WIB)
• Jadwal Pengembalian : ${order.tanggalKembali} (Pukul ${order.jamKembali} WIB)

🚚 SISTEM PENGANTARAN & PENGEMBALIAN :
• Pengantaran/Pengambilan : ${order.opsiPengantaran}
• Sistem Pengembalian : ${order.sistemPengembalian}

🪪 JAMINAN IDENTITAS (Wajib Bawa Fisik Asli) :
• ${order.jaminanIdentitas || 'Belum dipilih'}

💰 TOTAL TARIF & PEMBAYARAN :
• Total Biaya Sewa : ${formatRupiah(order.tarifTotal)}
• Skema Pembayaran : ${order.skemaBayar}

⚠️ S&K RENTAL :
Penyewa menyetujui S&K: Wajib menyerahkan 1 identitas fisik asli, DP Rp 50.000 untuk penguncian unit, dan bertanggung jawab penuh atas keutuhan alat selama masa sewa.
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Halo admin Fotonic Rental, mohon konfirmasi ketersediaan alat dan nomor rekening untuk booking unit ya. Terima kasih!`;

  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

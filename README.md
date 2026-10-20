# Fotonic Web Format Order

Dua website mandiri (standalone) tanpa interaksi satu sama lain untuk kebutuhan format order:

1. **Web Format Order Rental Kamera**
   - File folder: `rental-kamera/index.html`
   - File alternatif root: `rental-kamera.html`

2. **Web Format Order Booking Foto Wisuda**
   - File folder: `booking-wisuda/index.html`
   - File alternatif root: `booking-foto.html`

---

## 📸 1. Web Rental Kamera (`rental-kamera/index.html`)

### Data yang Dikelola:
- **Data Penyewa:**
  - Nama Lengkap
  - No. WhatsApp
  - Alamat Domisili Sekarang
- **Detail Sewa:**
  - Pilihan Alat:
    1. *Nikon z50 II + Lensa Kit 16-50mm*
    2. *Nikon z50 II + Lensa Viltrox 35mm f1.7*
    3. *Lensa Viltrox 35mm f1.7*
  - Aksesoris Tambahan (Default / Free Inclusions):
    `2 baterai + SD Card Lexar 32GB + Kabel C to C + Card reader + Strap Kamera + 1 Lap Microfiber`
  - Tanggal & Jam Pengambilan
  - Tanggal & Jam Pengembalian
  - Durasi Sewa:
    1. *1 Hari (24 Jam / Full Day)*
    2. *Setengah Hari (6-12 Jam)*
    3. *Short Time (Maks 4 Jam)*
  - Sistem Pengambilan: *Ambil di penyedia rental* / *Delivery*
  - Sistem Pengembalian: *Antar ke penyedia rental* / *Delivery*
- **Jaminan Identitas (Wajib Asli saat Serah Terima):**
  - Checkbox *KTP* & *Kartu Pelajar / Mahasiswa* (Bisa pilih keduanya, validasi wajib minimal 1)
- **Komitmen Pembayaran:**
  - Pilihan *DP Rp 50.000* atau *Langsung Lunas* secara profesional beserta klausul komitmen booking jadwal.
- **Fitur Tambahan:**
  - Live Order Text Preview yang ter-update secara otomatis.
  - Tombol **Kirim Format ke WhatsApp** (langsung membuka WhatsApp tujuan dengan teks rapi).
  - Tombol **Salin Format Pesan** (Copy to Clipboard dengan toast notifikasi).
  - Input kustomisasi nomor WhatsApp Admin langsung dari UI.

---

## 🎓 2. Web Booking Foto Wisuda (`booking-wisuda/index.html`)

### Penyesuaian dari Format Sewa:
Menghilangkan bagian peralatan fisik kamera & jaminan identitas yang tidak relevan, serta menambahkan informasi esensial untuk sesi fotografi wisuda:
- **Data Wisudawan:**
  - Nama Lengkap Wisudawan
  - No. WhatsApp
  - Asal Kampus / Universitas & Fakultas
  - Jenis Sesi (Hari-H Wisuda / Pre-Wisuda / Post-Wisuda)
- **Detail Sesi Pemotretan:**
  - Paket Foto Wisuda:
    1. *Paket Solo / Personal* (Wisudawan + Pendamping/Keluarga Inti)
    2. *Paket Group Sahabat* (3-8 Wisudawan Bareng)
    3. *Paket Big Family* (Keluarga Besar)
  - Fasilitas Termasuk (All-inclusive):
    `Semua File Original High-Res (Google Drive) + Edit Tone Warna Pilihan (15-30 Foto) + Pengarahan Pose Profesional`
  - Tanggal Sesi Pemotretan
  - Jam Mulai & Jam Selesai Sesi
  - Durasi Sesi: *1 Jam*, *2 Jam (Best Seller)*, *Full Sesi / Sesuai Rundown*
  - Kategori Lokasi: *Area Kampus*, *Studio Foto*, *Outdoor / Cafe*
  - Detail Lokasi / Titik Kumpul Spesifik
  - Estimasi Jumlah Anggota Foto
  - Request Khusus / Konsep Pose
- **Komitmen Pembayaran:**
  - Pilihan *DP Lock Jadwal Rp 50.000* atau *Langsung Lunas (Full Payment)* lengkap dengan terms komitmen jadwal fotografer.
- **Fitur Tambahan:**
  - Live Booking Text Preview.
  - Tombol **Kirim Format ke WhatsApp** dan **Salin Format Pesan**.
  - Input kustomisasi nomor WhatsApp Admin.

---

## 🚀 Cara Menjalankan

Tidak memerlukan instalasi server atau dependensi tambahan. Anda cukup:
- **Klik dua kali (Double-click)** file `rental-kamera/index.html` atau `booking-wisuda/index.html` untuk membuka langsung di browser (Google Chrome, Edge, Safari, dll.).
- Atau deploy folder masing-masing ke hosting statis seperti Vercel, Netlify, Cloudflare Pages, atau GitHub Pages secara terpisah.

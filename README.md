# Fotonic Web Format Order

Dua website mandiri (standalone) tanpa interaksi satu sama lain untuk kebutuhan format order:

1. **Web Format Order Rental Kamera**
   - File folder: `rental-kamera/index.html`
   - URL Vercel: `https://[domain-anda].vercel.app/rental-kamera`

2. **Web Format Order Booking Foto Wisuda**
   - File folder: `booking-wisuda/index.html`
   - URL Vercel: `https://[domain-anda].vercel.app/booking-wisuda`

---

## ⚙️ Konfigurasi Vercel (`vercel.json`)
Proyek ini telah dilengkapi file konfigurasi `vercel.json` dengan *clean URLs* dan *direct rewrite*:
- `/rental-kamera` & `/rental` &rarr; membuka langsung form Rental Kamera.
- `/booking-wisuda` & `/booking-foto` & `/booking` &rarr; membuka langsung form Booking Foto Wisuda.
- Tidak ada halaman pemilihan/menu awal, sehingga link bisa langsung dibagikan terpisah ke pelanggan masing-masing.

---

## 🚀 Cara Singkronisasi ke GitHub & Deploy ke Vercel

### Langkah 1: Buat Repository di GitHub
1. Buka browser dan login ke akun GitHub Anda: **[github.com/new](https://github.com/new)**.
2. Beri nama repository, misalnya: `FotonicProject-web-format-order` (atau nama lain yang Anda inginkan).
3. Biarkan opsi repository **Public** (atau Private), **jangan centang** "Add a README file" karena proyek ini sudah memiliki kode lengkap.
4. Klik tombol **Create repository**.

### Langkah 2: Push Kode ke GitHub
Buka terminal / PowerShell di folder proyek ini (`e:\Fotonic Web\Web-Format-Order`), lalu jalankan:
```bash
git push -u origin main
```
*(Atau Anda cukup klik dua kali file **`update.bat`** di folder proyek).*

> **Catatan:** Jika Anda memberi nama repository selain `FotonicProject-web-format-order`, ubah remote terlebih dahulu:
> ```bash
> git remote set-url origin https://github.com/efremalvin/[NAMA-REPO-ANDA].git
> git push -u origin main
> ```

### Langkah 3: Sambungkan ke Vercel (Auto Deploy)
1. Buka dashboard Vercel Anda di: **[vercel.com/new](https://vercel.com/new)**.
2. Pada bagian **Import Git Repository**, pilih repository GitHub yang baru saja Anda buat (`FotonicProject-web-format-order`).
3. Pada pengaturan konfigurasi proyek:
   - **Framework Preset**: *Other*
   - **Root Directory**: `./` (biarkan default)
4. Klik tombol **Deploy**.
5. Selesai! Web Anda akan langsung aktif dengan domain Vercel. Setiap kali Anda melakukan update via `update.bat`, Vercel akan otomatis meng-update web secara instan.


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

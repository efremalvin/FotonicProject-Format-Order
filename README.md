# Fotonic Web Format Order

Dua website mandiri (standalone) tanpa interaksi satu sama lain untuk kebutuhan format order:

1. **Web Format Order Rental Kamera (Nikon Z50 Mark II)**
   - File folder: `rental-kamera/index.html`
   - URL Vercel: `https://[domain-anda].vercel.app/rental-kamera`

2. **Web Format Order Booking Foto Wisuda & Sidang**
   - File folder: `booking-wisuda/index.html`
   - URL Vercel: `https://[domain-anda].vercel.app/booking-wisuda`

*Nomor WhatsApp Admin Resmi*: **+62 819-9421-8428** (terkunci otomatis pada kedua web).

---

## 📸 1. Pricelist Sewa Nikon Z50 Mark II (`rental-kamera/index.html`)

### Pilihan Durasi & Tarif Resmi:
1. **Paket Komplit (Best Value! 🔥)**
   - *Unit*: Body Nikon Z50 Mark II + Lensa Kit 16-50mm + Lensa Fix Viltrox 35mm f/1.7
   - Short Time (Maks 4 Jam): **Rp 90.000**
   - Setengah Hari (6–12 Jam): **Rp 110.000**
   - 1 Hari / Full Day (24 Jam): **Rp 150.000**

2. **Paket Single Lens**
   - *Unit*: Body Nikon Z50 Mark II + Pilih 1 Lensa (*Kit 16-50mm* ATAU *Viltrox 35mm f/1.7*)
   - Short Time (Maks 4 Jam): **Rp 65.000**
   - Setengah Hari (6–12 Jam): **Rp 85.000**
   - 1 Hari / Full Day (24 Jam): **Rp 120.000**

3. **Sewa Lensa Saja**
   - *Unit*: Viltrox Air 35mm f/1.7 (Nikon Z Mount)
   - Short Time (Maks 4 Jam): **Rp 25.000**
   - Setengah Hari (6–12 Jam): **Rp 35.000**
   - 1 Hari / Full Day (24 Jam): **Rp 50.000**

### Aksesoris Termasuk (Bundled / Default):
`2 baterai + SD Card Lexar 32GB + Kabel C to C + Card reader + Strap Kamera + 1 Lap Microfiber`

---

## 🎓 2. Pricelist Booking Foto Wisuda & Sidang (`booking-wisuda/index.html`)

Dikelola melalui data TypeScript [`data/pricelist.ts`](file:///e:/Fotonic%20Web/Web-Format-Order/data/pricelist.ts):
- **Single Packet**: Single Kilat (100k), Single Standard 60m (175k), Single Standard 120m (200k)
- **Group Packet**: Group Kilat (250k), Group Standard 90m (320k), Group Standard 120m (350k)
- **Seminar & Sidang**: Sidang Kilat (80k), Sidang Standard 90m (130k), Sidang Standard 120m (150k)
- **Add-On**: Cinematic Reels/TikTok Video (50k), Xtra Edit 1 Foto (10k), Xtra Edit 5 Foto (40k), Express Edit 1 Day (200k)


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

## ⚡ Cara Menjalankan & Update (Mirip Web-Porto)

Proyek ini telah dikonfigurasi menjadi **Static Web murni** (tanpa dependensi eksternal yang rumit) dan dilengkapi script otomatisasi praktis:

### 1. Menjalankan Website Secara Lokal (`run.bat`)
Cukup **klik 2x file `run.bat`** (atau jalankan `npm run dev` di terminal).
- Server statis lokal akan langsung aktif di `http://localhost:3000`.
- 📷 Rental Kamera : `http://localhost:3000/rental-kamera/`
- 🎓 Booking Wisuda: `http://localhost:3000/booking-wisuda/`

### 2. Mengunggah Update ke GitHub & Vercel (`update.bat`)
Cukup **klik 2x file `update.bat`**.
- Masukkan pesan update Anda saat diminta di layar.
- Script akan otomatis melakukan `git add`, `git commit`, dan `git push origin main`.
- Jika sudah terhubung ke Vercel, pembaruan akan otomatis ter-*deploy* ke web live dalam hitungan detik!


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
"# FotonicProject-Format-Order" 

# Fotonic - Portal Format Order Sewa Kamera & Jasa Foto

Website modern dan responsif untuk brand kreatif **Fotonic** dengan arsitektur **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS**. Mengintegrasikan 2 layanan utama: **Sewa Kamera & Gear** serta **Order Jasa Foto & Video**.

---

## 🌟 Fitur Utama & Struktur Halaman

1. **Portal Gerbang Utama (`/`)**:
   - Visual modern *split-screen hero cards* yang membagi pengunjung ke dua modul layanan:
     - 📷 **Sewa Kamera & Gear** (`/sewa-kamera`)
     - 🎓 **Order Jasa Foto & Video** (`/jasa-foto`)
   - Dilengkapi kartu informasi jaminan identitas aman, standar ketepatan waktu H-15 menit, dan file full resolution via Google Drive.

2. **Modul Sewa Kamera & Gear (`/sewa-kamera`)**:
   - Katalog unit: Nikon Z50 Mark II, Lensa Kit 16-50mm, Lensa Fix Viltrox 35mm f/1.7, dan paket Lensa Saja.
   - Pilihan durasi fleksibel: **Short Time (Maks. 4 Jam)**, **Setengah Hari (6–12 Jam)**, dan **1 Hari / Full Day (24 Jam)**.
   - Kelengkapan bawaan (*included*): 2x baterai, SD Card Lexar, Card reader OTG, kabel C to C, strap kamera, lap microfiber, tas kamera.
   - Tambahan Extra Gear: Tripod kamera, Mini LED light, baterai cadangan ekstra, SD card ekstra.
   - S&K Ringkas: Jaminan KTP/KTM Asli, toleransi keterlambatan 1–2 jam, dan ketentuan denda.
   - Form order interaktif + tombol **"Kirim Format Sewa via WhatsApp"** ke nomor admin resmi.

3. **Modul Jasa Foto & Video (`/jasa-foto`)**:
   - Tab kategori resmi:
     - **Single Packet**: Single Kilat (100k), Single Standard (175k), Single Full (200k)
     - **Group / Family Packet (Maks. 10 Orang)**: Group Kilat (250k), Group Standard (320k), Group Full (350k)
     - **Seminar & Sidang Packet**: Sidang Kilat (80k), Sidang Standard (130k), Sidang Full (150k)
   - Layanan Add-On: Video Reels / TikTok vertikal (50k), Xtra edited 1 foto (10k), Xtra edited 5 foto (40k), Express Edit 1x24 jam (200k).
   - Inklusi Google Drive: All Files RAW & JPG resolusi penuh tanpa kompresi.
   - Form order interaktif + tombol **"Kirim Booking via WhatsApp"** ke nomor fotografer resmi.

4. **Navigasi Cepat (Quick Switcher)**:
   - Navbar universal dengan tombol switcher cepat untuk berpindah langsung antara halaman Sewa Kamera dan Jasa Foto tanpa harus kembali ke beranda.
   - Kontak admin WhatsApp resmi terkunci pada nomor **`+62 819-9421-8428`**.

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

### 1. Menjalankan Server Dev (`run.bat`)
Cukup **klik 2x file `run.bat`** (atau jalankan perintah di bawah ini):
```bash
npm run dev
```
Buka browser di:
- Portal Utama   : `http://localhost:3000`
- Sewa Kamera    : `http://localhost:3000/sewa-kamera`
- Jasa Foto      : `http://localhost:3000/jasa-foto`

### 2. Mengunggah Pembaruan ke GitHub & Vercel (`update.bat`)
Cukup **klik 2x file `update.bat`**:
1. Masukkan deskripsi update yang Anda buat.
2. Script otomatis melakukan `git add`, `git commit`, dan `git push origin main`.
3. Vercel akan otomatis melakukan build dan deploy versi terbaru secara langsung.

---

## 📁 Struktur Direktori
```
Web-Format-Order/
├── app/
│   ├── globals.css           # Styling Tailwind CSS
│   ├── layout.tsx            # Root layout Next.js
│   ├── page.tsx              # Portal Utama (Split Hero Cards)
│   ├── sewa-kamera/
│   │   └── page.tsx          # Halaman Katalog & Order Sewa Kamera
│   └── jasa-foto/
│       └── page.tsx          # Halaman Katalog & Booking Jasa Foto
├── components/
│   ├── Navbar.tsx            # Navigasi universal & Quick Switcher
│   └── Footer.tsx            # Footer informasi brand Fotonic
├── data/
│   ├── fotoPricelist.ts      # Data resmi paket foto & add-ons
│   └── kameraCatalog.ts      # Data resmi unit kamera, durasi & gear
├── lib/
│   └── whatsapp.ts           # Generator pesan WhatsApp (+62 819-9421-8428)
├── package.json
├── tsconfig.json
├── next.config.js
├── run.bat                   # Script jalankan local server
├── update.bat                # Script update ke GitHub
└── README.md
```

# Panduan Integrasi Google Sheets & Google Calendar (Fotonic)

Integrasi ini berjalan dua arah:
1. **Web Form → Google Sheets (`Sewa Kamera` & `Jasa Foto`)**: Otomatis tercatat saat tombol *Kirim via WhatsApp* ditekan melalui `/api/orders` menggunakan kredensial Service Account di `.env.local` (dan Vercel).
2. **Google Sheets ↔ Google Calendar (termasuk H-1 jam 18:00 WIB)**: Otomatis membuat, memperbarui, dan menghapus event di Google Calendar jika baris di Spreadsheet ditambah, diubah, dibatalkan (`Batal`), atau dihapus.

---

## Langkah 1: Bagikan Spreadsheet ke Service Account
1. Buka Google Spreadsheet Anda: `https://docs.google.com/spreadsheets/d/1YNPP_yqiRIIuvETQrbX9kG0tZpFlxtc23kAOpBTe8hU/edit`
2. Klik **Share** (Bagikan) di pojok kanan atas.
3. Tambahkan email Service Account:
   `botdeploy@fotonic-project.iam.gserviceaccount.com`
4. Setel akses menjadi **Editor**, lalu klik **Send**.

---

## Langkah 2: Aktifkan Sinkronisasi Google Calendar + H-1 (18:00 WIB)
1. Di dalam Google Spreadsheet yang sama, buka menu **Extensions → Apps Script**.
2. Hapus kode bawaan, lalu salin-tempel seluruh isi file [`Code.gs`](./Code.gs).
3. Klik ikon **Save** (`Ctrl+S`).
4. Pada dropdown fungsi di toolbar atas, pilih **`setupTriggers`**, lalu klik **Run**.
5. Berikan izin akses (*Review permissions → Advanced → Go to ... (unsafe) → Allow*).
6. Selesai! Kedua tab **`Sewa Kamera`** dan **`Jasa Foto`** beserta format tabel, header, dan dropdown `Status` langsung dibuat otomatis.

---

## Langkah 3: Environment Variables di Vercel (untuk Production)
Pastikan 3 variabel dari `.env.local` berikut juga dimasukkan ke **Vercel → Project Settings → Environment Variables**:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SPREADSHEET_ID`

*(Opsional)* Jika Anda juga ingin API Next.js langsung menulis ke Calendar tanpa menunggu trigger 5 menit Apps Script, bagikan Google Calendar Anda ke `botdeploy@fotonic-project.iam.gserviceaccount.com` (*Make changes to events*) dan tambahkan `GOOGLE_CALENDAR_ID=<email-gmail-anda>`.

// Data Katalog Rental Kamera & Perlengkapan Fotonic
// File: data/kameraCatalog.ts

export interface KameraPackage {
  id: string;
  name: string;
  category: 'Paket Kamera + Lensa' | 'Lensa Saja';
  badge?: string;
  description: string;
  includesText: string;
  pricing: {
    shortTime: number; // Maks 4 Jam
    halfDay: number;   // 6-12 Jam
    fullDay: number;   // 24 Jam
  };
  hasLensChoice?: boolean;
  lensOptions?: string[];
}

export const KAMERA_PACKAGES: KameraPackage[] = [
  {
    id: 'paket-komplit',
    name: '1. PAKET KOMPLIT (Best Value!)',
    category: 'Paket Kamera + Lensa',
    badge: 'Best Value 🔥',
    description: 'Bodi Nikon Z50 Mark II + Lensa Kit 16-50mm + Lensa Fix Viltrox 35mm f/1.7',
    includesText: 'Bodi Kamera + 2 Lensa Sekaligus (Sudut Lebar & Bokeh Tajam)',
    pricing: {
      shortTime: 90000,
      halfDay: 110000,
      fullDay: 150000
    }
  },
  {
    id: 'paket-single-lens',
    name: '2. PAKET SINGLE LENS',
    category: 'Paket Kamera + Lensa',
    badge: 'Paling Populer',
    description: 'Bodi Nikon Z50 Mark II + Pilih 1 Lensa (Kit 16-50mm ATAU Viltrox 35mm f/1.7)',
    includesText: 'Bodi Kamera + 1 Lensa Pilihan',
    pricing: {
      shortTime: 65000,
      halfDay: 85000,
      fullDay: 120000
    },
    hasLensChoice: true,
    lensOptions: [
      'Lensa Kit 16-50mm (Serbaguna/Vlog)',
      'Lensa Fix Viltrox 35mm f/1.7 (Bokeh Portrait Estetis)'
    ]
  },
  {
    id: 'paket-lensa-saja',
    name: '3. SEWA LENSA SAJA',
    category: 'Lensa Saja',
    badge: 'Lensa Saja',
    description: 'Viltrox Air 35mm f/1.7 (Nikon Z Mount)',
    includesText: 'Hanya Lensa Viltrox 35mm f/1.7 bagi yang sudah memiliki bodi Nikon Z Mount',
    pricing: {
      shortTime: 25000,
      halfDay: 35000,
      fullDay: 50000
    }
  }
];

export const STANDARD_ACCESSORIES = [
  '2x Baterai Kamera',
  'Kartu Memori SD Lexar 32GB Kecepatan Tinggi',
  'Kabel Data Tipe-C ke Tipe-C',
  'Pembaca Kartu Memori (Card Reader OTG)',
  'Tali Gantungan Kamera (Strap)',
  '1x Kain Lap Pembersih Microfiber',
  'Tas Pelindung Kamera'
];

export const DELIVERY_OPTIONS = [
  {
    id: 'ambil-sendiri',
    label: 'Ambil Sendiri di Tempat Rental',
    fee: 0,
    note: 'Gratis (Langsung ke lokasi penyedia rental)'
  },
  {
    id: 'antar-unila',
    label: 'Antar ke Area Kampus Unila',
    fee: 0,
    note: 'Gratis (Free antar ke area dalam kampus Unila)'
  },
  {
    id: 'antar-luar-unila',
    label: 'Antar ke Luar Area Kampus',
    fee: 10000,
    note: '+Rp 10.000 atau lebih tergantung jarak pengantaran'
  }
];

export const RENTAL_RULES = [
  {
    title: 'Jaminan Identitas Fisik Asli (Wajib 1)',
    desc: 'Wajib menyerahkan salah satu identitas fisik asli (KTP Asli ATAU Kartu Mahasiswa KTM Asli) selama masa sewa sebagai tanda jaminan keamanan.'
  },
  {
    title: 'Hitungan Waktu Sewa',
    desc: 'Hitungan 1 Hari adalah 24 jam penuh sejak serah terima alat. Tersedia juga opsi Setengah Hari (6–12 Jam) dan Short Time (Maks. 4 Jam).'
  },
  {
    title: 'Uang Muka (DP) Booking Unit',
    desc: 'DP sebesar Rp 50.000 wajib dibayarkan untuk mengunci unit dan tanggal yang diinginkan.'
  },
  {
    title: 'Pengantaran & Toleransi Waktu',
    desc: 'Pengantaran area Unila gratis, luar Unila mulai Rp 10.000. Toleransi keterlambatan 1–2 jam bebas denda (wajib info admin lebih awal).'
  }
];

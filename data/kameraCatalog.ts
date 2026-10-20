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

export interface ExtraGear {
  id: string;
  name: string;
  pricePerDay: number;
  category: 'Tripod' | 'Lighting' | 'Power & Storage';
  description: string;
}

export const KAMERA_PACKAGES: KameraPackage[] = [
  {
    id: 'paket-komplit',
    name: '1. PAKET KOMPLIT (Best Value!)',
    category: 'Paket Kamera + Lensa',
    badge: 'Best Value 🔥',
    description: 'Body Nikon Z50 Mark II + Lensa Kit 16-50mm + Lensa Fix Viltrox 35mm f/1.7',
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
    description: 'Body Nikon Z50 Mark II + Pilih 1 Lensa (Kit 16-50mm ATAU Viltrox 35mm f/1.7)',
    includesText: 'Bodi Kamera + 1 Lensa Sesuai Pilihan Anda',
    pricing: {
      shortTime: 65000,
      halfDay: 85000,
      fullDay: 120000
    },
    hasLensChoice: true,
    lensOptions: [
      'Lensa Kit 16-50mm (Serbaguna/Vlog/Landscape)',
      'Lensa Fix Viltrox 35mm f/1.7 (Bokeh Portrait Estetis)'
    ]
  },
  {
    id: 'paket-lensa-saja',
    name: '3. SEWA LENSA SAJA',
    category: 'Lensa Saja',
    badge: 'Lensa Saja',
    description: 'Viltrox Air 35mm f/1.7 (Nikon Z Mount)',
    includesText: 'Lensa Viltrox 35mm f/1.7 saja bagi yang sudah memiliki bodi Nikon Z Mount',
    pricing: {
      shortTime: 25000,
      halfDay: 35000,
      fullDay: 50000
    }
  }
];

export const STANDARD_ACCESSORIES = [
  '2x Baterai Kamera',
  'SD Card Lexar 32GB High-Speed',
  'Kabel Type-C to C',
  'Card Reader OTG',
  'Strap Kamera Nyaman',
  '1x Lap Microfiber Pembersih',
  'Tas Kamera Protektif'
];

export const EXTRA_GEAR_ADDONS: ExtraGear[] = [
  {
    id: 'gear-tripod',
    name: 'Tripod Kamera Kokoh',
    pricePerDay: 20000,
    category: 'Tripod',
    description: 'Tripod aluminium stabil untuk foto grup, landscape, atau video stabil.'
  },
  {
    id: 'gear-led',
    name: 'Mini LED On-Camera Light',
    pricePerDay: 20000,
    category: 'Lighting',
    description: 'Lampu LED portabel bi-color dengan pengaturan intensitas cahaya.'
  },
  {
    id: 'gear-batt-extra',
    name: 'Extra Baterai Cadangan (Baterai ke-3)',
    pricePerDay: 15000,
    category: 'Power & Storage',
    description: 'Tambahan 1 unit baterai cadangan terisi penuh untuk sesi seharian.'
  },
  {
    id: 'gear-sd-extra',
    name: 'Extra SD Card Sandisk 64GB',
    pricePerDay: 15000,
    category: 'Power & Storage',
    description: 'Penyimpanan cadangan 64GB ekstra cepat class 10.'
  }
];

export const RENTAL_RULES = [
  {
    title: 'Jaminan Identitas Fisik Asli',
    desc: 'Wajib menyerahkan identitas resmi asli (KTP / Kartu Mahasiswa KTM Aktif) selama masa sewa sebagai tanda jaminan keamanan.'
  },
  {
    title: 'Hitungan Waktu Sewa',
    desc: 'Hitungan 1 Hari adalah 24 jam penuh sejak serah terima alat. Tersedia pula opsi Setengah Hari (6–12 Jam) dan Short Time (Maks. 4 Jam).'
  },
  {
    title: 'Uang Muka (DP) Booking Unit',
    desc: 'DP sebesar Rp 20.000 – Rp 50.000 wajib dibayarkan untuk mengunci unit dan tanggal yang diinginkan.'
  },
  {
    title: 'Toleransi & Ketentuan Keterlambatan',
    desc: 'Toleransi keterlambatan 1–2 jam bebas denda (wajib konfirmasi admin terlebih dahulu). Keterlambatan >2 jam tanpa konfirmasi dikenakan denda Rp 15.000 – Rp 20.000/jam.'
  }
];

// Data Pricelist Resmi Jasa Foto Fotonic
// File: data/fotoPricelist.ts

export interface FotoPackage {
  id: string;
  name: string;
  category: 'Single Packet' | 'Group / Family' | 'Seminar & Sidang';
  price: number;
  duration: string;
  durationMinutes: number;
  spots: string;
  editedPhotos: number;
  includes: string[];
  description: string;
  badge?: string;
  recommended?: boolean;
}

export const FOTO_CATEGORIES = [
  {
    id: 'Single Packet',
    title: 'Single Packet',
    subtitle: 'Solo portrait wisudawan & pendamping inti',
    icon: 'User'
  },
  {
    id: 'Group / Family',
    title: 'Group / Family',
    subtitle: 'Sahabat wisuda bareng & rombongan keluarga (Maks 10 org)',
    icon: 'Users'
  },
  {
    id: 'Seminar & Sidang',
    title: 'Seminar & Sidang',
    subtitle: 'Dokumentasi momen Sempro, Semhas, & Sidang Kompre',
    icon: 'Award'
  }
] as const;

export const FOTO_PACKAGES: FotoPackage[] = [
  // 1. Single Packet
  {
    id: 'single-kilat',
    name: 'Single Kilat',
    category: 'Single Packet',
    price: 100000,
    duration: '30 Menit',
    durationMinutes: 30,
    spots: '1 Spot Foto',
    editedPhotos: 5,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Sesi kilat untuk portrait inti wisudawan personal.',
    badge: 'Kilat'
  },
  {
    id: 'single-std',
    name: 'Single Standard',
    category: 'Single Packet',
    price: 175000,
    duration: '60 Menit',
    durationMinutes: 60,
    spots: '3 Spot Foto',
    editedPhotos: 10,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Pilihan paling ideal untuk wisudawan solo bersama orang tua.',
    badge: 'Paling Populer',
    recommended: true
  },
  {
    id: 'single-full',
    name: 'Single Full',
    category: 'Single Packet',
    price: 200000,
    duration: '120 Menit',
    durationMinutes: 120,
    spots: '5 Spot Foto',
    editedPhotos: 15,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Waktu leluasa untuk foto portrait wisudawan di berbagai sudut kampus.',
    badge: 'Best Value'
  },

  // 2. Group / Family Packet
  {
    id: 'group-kilat',
    name: 'Group Kilat',
    category: 'Group / Family',
    price: 250000,
    duration: '60 Menit',
    durationMinutes: 60,
    spots: '1 Spot Foto',
    editedPhotos: 10,
    includes: ['All Files RAW & JPG via Google Drive', 'Maksimal 10 Orang Peserta'],
    description: 'Foto grup ringkas bersama sahabat dekat wisuda.',
    badge: 'Kilat'
  },
  {
    id: 'group-std',
    name: 'Group Standard',
    category: 'Group / Family',
    price: 320000,
    duration: '90 Menit',
    durationMinutes: 90,
    spots: '3 Spot Foto',
    editedPhotos: 15,
    includes: ['All Files RAW & JPG via Google Drive', 'Maksimal 10 Orang Peserta'],
    description: 'Pilihan favorit grup sahabat untuk variasi pose rame-rame & candid.',
    badge: 'Favorit Rombongan',
    recommended: true
  },
  {
    id: 'group-full',
    name: 'Group Full',
    category: 'Group / Family',
    price: 350000,
    duration: '120 Menit',
    durationMinutes: 120,
    spots: '5-6 Spot Foto',
    editedPhotos: 20,
    includes: ['All Files RAW & JPG via Google Drive', 'Maksimal 10 Orang Peserta'],
    description: 'Sesi komplit untuk grup wisudawan atau keluarga besar dengan banyak spot foto.',
    badge: 'Komplit'
  },

  // 3. Seminar & Sidang Packet
  {
    id: 'sidang-kilat',
    name: 'Sidang Kilat',
    category: 'Seminar & Sidang',
    price: 80000,
    duration: '30 Menit',
    durationMinutes: 30,
    spots: '1 Spot Foto',
    editedPhotos: 10,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Foto selebrasi kilat seusai yudisium, sempro, atau sidang.',
    badge: 'Hemat'
  },
  {
    id: 'sidang-std',
    name: 'Sidang Standard',
    category: 'Seminar & Sidang',
    price: 130000,
    duration: '90 Menit',
    durationMinutes: 90,
    spots: '3 Spot Foto',
    editedPhotos: 15,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Liputan lengkap momen bersama dosen penguji, pembimbing, dan teman satu angkatan.',
    badge: 'Rekomendasi',
    recommended: true
  },
  {
    id: 'sidang-full',
    name: 'Sidang Full',
    category: 'Seminar & Sidang',
    price: 150000,
    duration: '120 Menit',
    durationMinutes: 120,
    spots: '5 Spot Foto',
    editedPhotos: 20,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Dokumentasi maksimal dari prosesi pengumuman hasil hingga selebrasi luar gedung.',
    badge: 'Full Sesi'
  }
];

export const FOTO_BOOKING_RULES = {
  dpAmount: 50000,
  terms: [
    'Jadwal fotografer resmi terkunci setelah pembayaran DP Rp 50.000 atau pelunasan.',
    'Fotografer hadir di titik kumpul 15 menit sebelum jam sesi dimulai.',
    'Keterlambatan dari pihak klien tidak menambah durasi demi menjaga jadwal sesi berikutnya.',
    'DP tidak dapat di-refund jika pembatalan sepihak, namun dapat reschedule sesuai ketersediaan slot.'
  ]
};

export interface FotoAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  badge?: string;
  isPromoFree?: boolean;
  canIncrement?: boolean;
}

export const FOTO_ADDONS: FotoAddon[] = [
  {
    id: 'cinematic-reels',
    name: 'Cinematic Reels / TikTok Video',
    price: 0,
    description: 'Shot video vertikal 1 menit, cinematic slow-motion di sela sesi pemotretan.',
    badge: 'PROMO FREE',
    isPromoFree: true
  },
  {
    id: 'extra-edit-1',
    name: 'Xtra Edited 1 Foto',
    price: 10000,
    description: 'Tambahan 1 foto pilihan untuk diedit profesional (tone color & retouching).',
    canIncrement: true
  },
  {
    id: 'extra-edit-5',
    name: 'Xtra Edited 5 Foto',
    price: 40000,
    description: 'Paket hemat 5 foto tambahan diedit profesional (hemat Rp 10.000).',
    canIncrement: true
  },
  {
    id: 'express-edit',
    name: 'Express Edit (One Day Service)',
    price: 50000,
    description: 'Hasil foto editan final diserahkan 1x24 jam setelah klien memilih nomor foto.',
    badge: '1x24 Jam'
  }
];

// Spesifikasi Data Paket & Pricelist Resmi Fotonic Photography
// File: data/pricelist.ts

export interface PhotoPackage {
  id: string;
  name: string;
  category: 'Single Packet' | 'Group Packet' | 'Seminar & Sidang';
  price: number;
  duration: string;
  durationMinutes: number;
  spots: string;
  editedPhotos: number;
  includes: string[];
  description?: string;
  badge?: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CategoryInfo {
  id: 'Single Packet' | 'Group Packet' | 'Seminar & Sidang';
  label: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'Single Packet',
    label: 'Single Packet',
    description: 'Sesi wisuda solo/personal bersama keluarga & pendamping inti',
    icon: 'user'
  },
  {
    id: 'Group Packet',
    label: 'Group Packet',
    description: 'Sesi wisuda rombongan sahabat & rekan sejurusan',
    icon: 'users'
  },
  {
    id: 'Seminar & Sidang',
    label: 'Seminar & Sidang',
    description: 'Dokumentasi momen yudisium, seminar proposal, & sidang skripsi',
    icon: 'award'
  }
];

export const PHOTO_PACKAGES: PhotoPackage[] = [
  // 1. Kategori "Single Packet"
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
    description: 'Cepat & praktis untuk portrait inti wisudawan.',
    badge: 'Kilat'
  },
  {
    id: 'single-std-60',
    name: 'Single Standard (60 Menit)',
    category: 'Single Packet',
    price: 175000,
    duration: '60 Menit',
    durationMinutes: 60,
    spots: '3 Spot Foto',
    editedPhotos: 10,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Pilihan seimbang untuk wisudawan solo dan orang tua.',
    badge: 'Populer'
  },
  {
    id: 'single-std-120',
    name: 'Single Standard (120 Menit)',
    category: 'Single Packet',
    price: 200000,
    duration: '120 Menit',
    durationMinutes: 120,
    spots: '5 Spot Foto',
    editedPhotos: 15,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Eksplorasi banyak spot kampus dengan pose maksimal.',
    badge: 'Best Value'
  },

  // 2. Kategori "Group Packet"
  {
    id: 'group-kilat',
    name: 'Group Kilat',
    category: 'Group Packet',
    price: 250000,
    duration: '60 Menit',
    durationMinutes: 60,
    spots: '1 Spot Foto',
    editedPhotos: 10,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Foto grup ringkas bersama circle terdekat.',
    badge: 'Kilat'
  },
  {
    id: 'group-std-90',
    name: 'Group Standard (90 Menit)',
    category: 'Group Packet',
    price: 320000,
    duration: '90 Menit',
    durationMinutes: 90,
    spots: '3 Spot Foto',
    editedPhotos: 15,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Pilihan favorit grup sahabat untuk berbagai sudut dan kombinasi pose.',
    badge: 'Favorit'
  },
  {
    id: 'group-std-120',
    name: 'Group Standard (120 Menit)',
    category: 'Group Packet',
    price: 350000,
    duration: '120 Menit',
    durationMinutes: 120,
    spots: '5 Spot Foto',
    editedPhotos: 20,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Sesi leluasa untuk rombongan besar dengan banyak spot foto.',
    badge: 'Lengkap'
  },

  // 3. Kategori "Seminar & Sidang"
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
    description: 'Foto selebrasi kilat seusai yudisium/sidang.',
    badge: 'Hemat'
  },
  {
    id: 'sidang-std-90',
    name: 'Sidang Standard (90 Menit)',
    category: 'Seminar & Sidang',
    price: 130000,
    duration: '90 Menit',
    durationMinutes: 90,
    spots: '3 Spot Foto',
    editedPhotos: 15,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Momen berharga bersama dosen pembimbing & teman sekelas.',
    badge: 'Rekomendasi'
  },
  {
    id: 'sidang-std-120',
    name: 'Sidang Standard (120 Menit)',
    category: 'Seminar & Sidang',
    price: 150000,
    duration: '120 Menit',
    durationMinutes: 120,
    spots: '5 Spot Foto',
    editedPhotos: 20,
    includes: ['All Files RAW & JPG via Google Drive'],
    description: 'Liputan lengkap mulai ucapan selamat hingga selebrasi gedung.',
    badge: 'Komplit'
  }
];

export const ADD_ONS: AddOnItem[] = [
  {
    id: 'addon-reels',
    name: 'Cinematic Reels/TikTok Video',
    price: 50000,
    description: 'Pengambilan maks 15 detik di sela sesi, slomo, hasil edit maks 1 menit'
  },
  {
    id: 'addon-extra-1',
    name: 'Xtra Edited 1 Foto',
    price: 10000,
    description: 'Tambahan 1 foto pilihan ber-color grading khusus'
  },
  {
    id: 'addon-extra-5',
    name: 'Xtra Edited 5 Foto',
    price: 40000,
    description: 'Paket hemat tambahan 5 foto pilihan ber-color grading khusus'
  },
  {
    id: 'addon-express',
    name: 'Express Edit (One Day Services)',
    price: 200000,
    description: 'Hasil foto edit diserahkan 1x24 jam setelah pemilihan foto'
  }
];

export const BOOKING_TERMS = {
  dpAmount: 50000,
  dpDescription: 'Wajib DP Rp 50.000 untuk penguncian jadwal fotografer',
  deliveryTimeNormal: '2-3 Hari Kerja via Google Drive',
  arrivalBufferMinutes: 15
};

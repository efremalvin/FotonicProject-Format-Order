// Data Pricelist Resmi Fotonic Photography (Static JavaScript)
// File: data/pricelist.js

export const CATEGORIES = [
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

export const PHOTO_PACKAGES = [
  // 1. Kategori "Single Packet"
  {
    id: 'single-kilat',
    name: 'Single Kilat',
    category: 'Single Packet',
    price: 100000,
    duration: '30 Menit',
    spots: '1 Spot Foto',
    editedPhotos: 5,
    includes: ['All Files RAW & JPG via Google Drive'],
    badge: 'Kilat',
    desc: 'Sesi ringkas portrait wisudawan solo.'
  },
  {
    id: 'single-std-60',
    name: 'Single Standard (60 Menit)',
    category: 'Single Packet',
    price: 175000,
    duration: '60 Menit',
    spots: '3 Spot Foto',
    editedPhotos: 10,
    includes: ['All Files RAW & JPG via Google Drive'],
    badge: 'Paling Populer',
    desc: 'Wisudawan solo bersama pendamping / keluarga inti.'
  },
  {
    id: 'single-std-120',
    name: 'Single Standard (120 Menit)',
    category: 'Single Packet',
    price: 200000,
    duration: '120 Menit',
    spots: '5 Spot Foto',
    editedPhotos: 15,
    includes: ['All Files RAW & JPG via Google Drive'],
    badge: 'Best Value',
    desc: 'Eksplorasi banyak spot kampus dengan pose maksimal.'
  },

  // 2. Kategori "Group Packet"
  {
    id: 'group-kilat',
    name: 'Group Kilat',
    category: 'Group Packet',
    price: 250000,
    duration: '60 Menit',
    spots: '1 Spot Foto',
    editedPhotos: 10,
    includes: ['All Files RAW & JPG via Google Drive'],
    badge: 'Kilat',
    desc: 'Foto grup ringkas bersama sahabat wisuda.'
  },
  {
    id: 'group-std-90',
    name: 'Group Standard (90 Menit)',
    category: 'Group Packet',
    price: 320000,
    duration: '90 Menit',
    spots: '3 Spot Foto',
    editedPhotos: 15,
    includes: ['All Files RAW & JPG via Google Drive'],
    badge: 'Favorit Grup',
    desc: 'Pilihan favorit grup sahabat untuk berbagai sudut dan kombinasi pose.'
  },
  {
    id: 'group-std-120',
    name: 'Group Standard (120 Menit)',
    category: 'Group Packet',
    price: 350000,
    duration: '120 Menit',
    spots: '5 Spot Foto',
    editedPhotos: 20,
    includes: ['All Files RAW & JPG via Google Drive'],
    badge: 'Komplit',
    desc: 'Sesi leluasa untuk rombongan dengan banyak spot foto berkesan.'
  },

  // 3. Kategori "Seminar & Sidang"
  {
    id: 'sidang-kilat',
    name: 'Sidang Kilat',
    category: 'Seminar & Sidang',
    price: 80000,
    duration: '30 Menit',
    spots: '1 Spot Foto',
    editedPhotos: 10,
    includes: ['All Files RAW & JPG via Google Drive'],
    badge: 'Hemat',
    desc: 'Foto selebrasi kilat seusai yudisium/sidang.'
  },
  {
    id: 'sidang-std-90',
    name: 'Sidang Standard (90 Menit)',
    category: 'Seminar & Sidang',
    price: 130000,
    duration: '90 Menit',
    spots: '3 Spot Foto',
    editedPhotos: 15,
    includes: ['All Files RAW & JPG via Google Drive'],
    badge: 'Rekomendasi',
    desc: 'Momen berharga bersama dosen pembimbing & teman sekelas.'
  },
  {
    id: 'sidang-std-120',
    name: 'Sidang Standard (120 Menit)',
    category: 'Seminar & Sidang',
    price: 150000,
    duration: '120 Menit',
    spots: '5 Spot Foto',
    editedPhotos: 20,
    includes: ['All Files RAW & JPG via Google Drive'],
    badge: 'Lengkap',
    desc: 'Liputan lengkap mulai ucapan selamat hingga selebrasi gedung.'
  }
];

export const ADD_ONS = [
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

export const ADMIN_CONTACT = {
  phoneNumber: '6281994218428',
  formattedDisplay: '+62 819-9421-8428'
};

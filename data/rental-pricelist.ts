// Spesifikasi Data Pricelist Resmi Rental Kamera Nikon Z50 Mark II Fotonic
// File: data/rental-pricelist.ts

export interface RentalPackage {
  id: string;
  name: string;
  badge?: string;
  description: string;
  includesText: string;
  pricing: {
    shortTime: number;    // Maks 4 Jam
    halfDay: number;      // 6-12 Jam
    fullDay: number;      // 24 Jam / 1 Hari
  };
  hasLensChoice?: boolean;
  lensOptions?: string[];
}

export const RENTAL_PACKAGES: RentalPackage[] = [
  {
    id: 'paket-komplit',
    name: 'Paket Komplit (Best Value!)',
    badge: 'Best Value 🔥',
    description: 'Body Nikon Z50 Mark II + Lensa Kit 16-50mm + Lensa Fix Viltrox 35mm f/1.7',
    includesText: 'Body + 2 Lensa (Kit 16-50mm & Viltrox 35mm f/1.7)',
    pricing: {
      shortTime: 90000,
      halfDay: 110000,
      fullDay: 150000
    }
  },
  {
    id: 'paket-single-lens',
    name: 'Paket Single Lens',
    badge: 'Populer',
    description: 'Body Nikon Z50 Mark II + Pilih 1 Lensa (Kit 16-50mm ATAU Viltrox 35mm f/1.7)',
    includesText: 'Body + 1 Lensa Pilihan',
    pricing: {
      shortTime: 65000,
      halfDay: 85000,
      fullDay: 120000
    },
    hasLensChoice: true,
    lensOptions: [
      'Lensa Kit 16-50mm (Serbaguna/Vlog)',
      'Lensa Fix Viltrox 35mm f/1.7 (Bokeh Portrait)'
    ]
  },
  {
    id: 'paket-lensa-saja',
    name: 'Sewa Lensa Saja',
    badge: 'Lensa Saja',
    description: 'Viltrox Air 35mm f/1.7 (Nikon Z Mount)',
    includesText: 'Hanya Lensa Viltrox 35mm f/1.7 (Z Mount)',
    pricing: {
      shortTime: 25000,
      halfDay: 35000,
      fullDay: 50000
    }
  }
];

export const RENTAL_ACCESSORIES = '2 baterai + SD Card Lexar 32GB + Kabel C to C + Card reader + Strap Kamera + 1 Lap Microfiber';

export const ADMIN_CONTACT = {
  phoneNumber: '6281994218428',
  formattedDisplay: '+62 819-9421-8428'
};

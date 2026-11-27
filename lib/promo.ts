import {
  GoogleConfig,
  ensureOrderSheetsExist,
  getSheetRows,
  updateSheetRange,
} from './googleApi';

export interface PromoCheckInput {
  code: string;
  serviceType: 'sewa' | 'foto';
  packageId?: string;
  packageName?: string;
  packageCategory?: string;
  subtotal: number;
}

export interface PromoCheckResult {
  valid: boolean;
  code?: string;
  discountAmount?: number;
  discountLabel?: string;
  description?: string;
  rowNumber?: number;
  currentUsedCount?: number;
  message?: string;
}

function parseNumber(val: string | undefined): number {
  if (!val) return 0;
  let s = String(val).trim().replace(/Rp|IDR|%|\s/gi, '');
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/^\d+(,\d+)$/.test(s)) {
    s = s.replace(',', '.');
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, '');
  } else {
    s = s.replace(/[^\d.-]/g, '');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function normalizeExpiryDate(val: string | undefined): string {
  const s = String(val || '').trim();
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dmy = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }
  return '';
}

function normalizeText(val: string | undefined): string {
  return String(val || '')
    .trim()
    .toLowerCase();
}

function getTodayWib(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

export async function validatePromoInSheet(
  config: GoogleConfig,
  token: string,
  input: PromoCheckInput
): Promise<PromoCheckResult> {
  const cleanCode = String(input.code || '').trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: 'Masukkan kode promo terlebih dahulu.' };
  }

  await ensureOrderSheetsExist(config, token);
  const rows = await getSheetRows(config, token, 'Kode Promo');

  let matchedRow: string[] | null = null;
  let matchedRowNum = -1;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    if (String(row[0]).trim().toUpperCase() === cleanCode) {
      matchedRow = row;
      matchedRowNum = i + 1;
      break;
    }
  }

  if (!matchedRow) {
    return { valid: false, message: `Kode promo "${cleanCode}" tidak ditemukan.` };
  }

  const active = normalizeText(matchedRow[1]);
  if (active !== 'ya' && active !== 'aktif' && active !== 'true' && active !== 'yes') {
    return { valid: false, message: `Kode promo "${cleanCode}" sedang tidak aktif.` };
  }

  const serviceRule = normalizeText(matchedRow[2] || 'semua');
  const expectedService = input.serviceType === 'sewa' ? 'sewa kamera' : 'jasa foto';
  if (serviceRule !== 'semua' && serviceRule !== 'all' && serviceRule !== expectedService) {
    return {
      valid: false,
      message: `Kode promo "${cleanCode}" hanya berlaku untuk layanan ${matchedRow[2]}.`,
    };
  }

  const targetRule = String(matchedRow[3] || 'Semua').trim();
  const targetNorm = normalizeText(targetRule);
  if (targetNorm && targetNorm !== 'semua' && targetNorm !== 'all') {
    const allowedTargets = targetRule
      .split(',')
      .map((s) => normalizeText(s))
      .filter(Boolean);
    const candidates = [
      normalizeText(input.packageId),
      normalizeText(input.packageName),
      normalizeText(input.packageCategory),
    ].filter(Boolean);

    const isPackageMatch = allowedTargets.some((target) =>
      candidates.some((cand) => cand === target || cand.includes(target) || target.includes(cand))
    );

    if (!isPackageMatch) {
      return {
        valid: false,
        message: `Kode promo "${cleanCode}" hanya berlaku untuk paket: ${targetRule}.`,
      };
    }
  }

  const expiry = normalizeExpiryDate(matchedRow[8]);
  if (expiry) {
    const todayWib = getTodayWib();
    if (todayWib > expiry) {
      return { valid: false, message: `Kode promo "${cleanCode}" sudah kedaluwarsa (${matchedRow[8]}).` };
    }
  }

  const quota = parseNumber(matchedRow[9]);
  const usedCount = parseNumber(matchedRow[10]);
  if (quota > 0 && usedCount >= quota) {
    return { valid: false, message: `Kuota pemakaian kode promo "${cleanCode}" sudah habis.` };
  }

  const minTransaction = parseNumber(matchedRow[7]);
  if (minTransaction > 0 && input.subtotal < minTransaction) {
    return {
      valid: false,
      message: `Minimal transaksi untuk promo ini adalah Rp ${minTransaction.toLocaleString('id-ID')}.`,
    };
  }

  const discountType = normalizeText(matchedRow[4] || 'nominal');
  const discountValue = parseNumber(matchedRow[5]);
  const maxDiscount = parseNumber(matchedRow[6]);

  if (discountValue <= 0) {
    return { valid: false, message: `Nilai diskon untuk kode "${cleanCode}" belum valid.` };
  }

  let discountAmount = 0;
  let discountLabel = '';

  if (discountType === 'persen' || discountType === 'percent' || discountType === '%') {
    discountAmount = Math.round((input.subtotal * discountValue) / 100);
    if (maxDiscount > 0 && discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }
    discountLabel = `${discountValue}%`;
  } else {
    discountAmount = discountValue;
    discountLabel = `Rp ${discountValue.toLocaleString('id-ID')}`;
  }

  discountAmount = Math.max(0, Math.min(discountAmount, input.subtotal));

  return {
    valid: true,
    code: cleanCode,
    discountAmount,
    discountLabel,
    description: String(matchedRow[11] || '').trim() || `Potongan ${discountLabel}`,
    rowNumber: matchedRowNum,
    currentUsedCount: usedCount,
  };
}

export async function incrementPromoUsage(
  config: GoogleConfig,
  token: string,
  rowNumber: number,
  currentUsedCount: number
): Promise<void> {
  if (rowNumber < 2) return;
  await updateSheetRange(config, token, 'Kode Promo', `K${rowNumber}`, [[currentUsedCount + 1]]);
}

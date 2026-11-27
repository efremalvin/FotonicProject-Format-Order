import { NextRequest, NextResponse } from 'next/server';
import {
  ORDER_STATUS_OPTIONS,
  OrderStatus,
  appendSheetRow,
  ensureOrderSheetsExist,
  getGoogleAccessToken,
  getGoogleConfig,
} from '@/lib/googleApi';
import { OrderSyncPayload } from '@/lib/googleSheets';
import { syncAllOrdersWithCalendar } from '@/lib/googleSync';
import { incrementPromoUsage, validatePromoInSheet } from '@/lib/promo';
import { formatRupiah } from '@/lib/whatsapp';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar',
];

function formatWibTimestamp(): string {
  return new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function generateOrderId(prefix: 'RENT' | 'FOTO'): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randPart = Math.floor(1000 + Math.random() * 9000);
  return `FTN-${prefix}-${datePart}-${randPart}`;
}

export async function POST(req: NextRequest) {
  const config = getGoogleConfig();
  if (!config) {
    return NextResponse.json({ ok: false, reason: 'Google credentials not configured' }, { status: 200 });
  }

  try {
    const payload = (await req.json()) as OrderSyncPayload;
    const token = await getGoogleAccessToken(config, SCOPES);
    await ensureOrderSheetsExist(config, token);

    const timestamp = formatWibTimestamp();
    const orderId = generateOrderId(payload.type === 'sewa' ? 'RENT' : 'FOTO');
    const resolvedStatus: OrderStatus =
      payload.status && ORDER_STATUS_OPTIONS.includes(payload.status) ? payload.status : 'Pending';

    let appliedPromoCode = '';
    let appliedDiscount = 0;

    if (payload.kodePromo && payload.kodePromo.trim()) {
      const subtotal =
        payload.type === 'sewa'
          ? (payload.subtotalTarif ?? payload.tarifTotal)
          : (payload.subtotalHarga ?? payload.totalHarga);

      const promoResult = await validatePromoInSheet(config, token, {
        code: payload.kodePromo,
        serviceType: payload.type,
        packageId: payload.paketId,
        packageName: payload.paketNama,
        packageCategory: payload.type === 'foto' ? payload.paketKategori : undefined,
        subtotal,
      });

      if (promoResult.valid && promoResult.code && promoResult.discountAmount) {
        appliedPromoCode = promoResult.code;
        appliedDiscount = promoResult.discountAmount;
        if (promoResult.rowNumber) {
          await incrementPromoUsage(config, token, promoResult.rowNumber, promoResult.currentUsedCount || 0);
        }
      }
    }

    if (payload.type === 'sewa') {
      const finalTotal = Math.max(0, (payload.subtotalTarif ?? payload.tarifTotal) - appliedDiscount);
      await appendSheetRow(config, token, 'Sewa Kamera', [
        orderId,
        timestamp,
        payload.nama,
        payload.whatsapp,
        payload.instagram || '-',
        payload.alamatDomisili,
        payload.paketNama,
        payload.detailUnit,
        payload.durasiTipe,
        payload.tanggalAmbil,
        payload.jamAmbil,
        payload.tanggalKembali,
        payload.jamKembali,
        payload.opsiPengantaran,
        payload.jaminanIdentitas,
        formatRupiah(finalTotal),
        payload.skemaBayar,
        resolvedStatus,
        '',
        '',
        '',
        appliedPromoCode || '-',
        appliedDiscount > 0 ? formatRupiah(appliedDiscount) : 'Rp 0',
      ]);
    } else {
      const finalTotal = Math.max(0, (payload.subtotalHarga ?? payload.totalHarga) - appliedDiscount);
      await appendSheetRow(config, token, 'Jasa Foto', [
        orderId,
        timestamp,
        payload.nama,
        payload.whatsapp || '-',
        payload.kampus,
        payload.paketKategori,
        payload.paketNama,
        payload.addOnsText,
        payload.tanggalSesi,
        payload.jamSesi,
        payload.lokasiTipe,
        payload.lokasiDetail,
        payload.jumlahOrang,
        payload.catatanKhusus,
        formatRupiah(finalTotal),
        payload.skemaBayar,
        resolvedStatus,
        '',
        '',
        '',
        appliedPromoCode || '-',
        appliedDiscount > 0 ? formatRupiah(appliedDiscount) : 'Rp 0',
      ]);
    }

    const syncResult = await syncAllOrdersWithCalendar(config);
    return NextResponse.json({ ok: true, orderId, syncResult });
  } catch (err) {
    console.error('[api/orders] Error:', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

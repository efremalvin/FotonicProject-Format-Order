import { NextRequest, NextResponse } from 'next/server';
import {
  appendSheetRow,
  ensureOrderSheetsExist,
  getGoogleAccessToken,
  getGoogleConfig,
} from '@/lib/googleApi';
import { OrderSyncPayload } from '@/lib/googleSheets';
import { syncAllOrdersWithCalendar } from '@/lib/googleSync';
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

    if (payload.type === 'sewa') {
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
        formatRupiah(payload.tarifTotal),
        payload.skemaBayar,
        'Pending',
        '',
        '',
        '',
      ]);
    } else {
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
        formatRupiah(payload.totalHarga),
        payload.skemaBayar,
        'Pending',
        '',
        '',
        '',
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

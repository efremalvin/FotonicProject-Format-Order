export interface SewaOrderPayload {
  type: 'sewa';
  nama: string;
  whatsapp: string;
  instagram: string;
  alamatDomisili: string;
  paketNama: string;
  detailUnit: string;
  durasiTipe: string;
  tanggalAmbil: string;
  jamAmbil: string;
  tanggalKembali: string;
  jamKembali: string;
  opsiPengantaran: string;
  jaminanIdentitas: string;
  tarifTotal: number;
  skemaBayar: string;
}

export interface FotoOrderPayload {
  type: 'foto';
  nama: string;
  whatsapp: string;
  kampus: string;
  paketKategori: string;
  paketNama: string;
  addOnsText: string;
  tanggalSesi: string;
  jamSesi: string;
  lokasiTipe: string;
  lokasiDetail: string;
  jumlahOrang: string;
  catatanKhusus: string;
  totalHarga: number;
  skemaBayar: string;
}

export type OrderSyncPayload = SewaOrderPayload | FotoOrderPayload;

/**
 * Mengirim pesanan ke API internal (/api/orders) yang mencatat ke Google Sheets & Google Calendar.
 * Didesain non-blocking dengan timeout singkat agar tidak menghambat pembukaan WhatsApp.
 */
export async function submitOrderToSheet(payload: OrderSyncPayload): Promise<{ ok: boolean; orderId?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as { ok?: boolean; orderId?: string };
    return { ok: Boolean(data.ok), orderId: data.orderId };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}

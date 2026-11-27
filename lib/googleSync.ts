import {
  GoogleConfig,
  buildWibDateTime,
  computeOrderHash,
  deleteCalendarEvent,
  ensureOrderSheetsExist,
  getGoogleAccessToken,
  getMinusOneDayDate,
  getSheetRows,
  listFotonicCalendarEvents,
  updateSheetRange,
  upsertCalendarEvent,
} from './googleApi';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar',
];

export interface SyncReport {
  created: number;
  updated: number;
  deleted: number;
  skippedNoCalendar: boolean;
}

function addOneHour(timeStr: string): string {
  const [h, m] = (timeStr || '09:00').split(':').map(Number);
  const nextH = (h + 1) % 24;
  return `${String(nextH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
}

export async function syncAllOrdersWithCalendar(config: GoogleConfig): Promise<SyncReport> {
  const token = await getGoogleAccessToken(config, SCOPES);
  await ensureOrderSheetsExist(config, token);

  if (!config.calendarId) {
    return { created: 0, updated: 0, deleted: 0, skippedNoCalendar: true };
  }

  const calendarId = config.calendarId;
  const activeOrderIds = new Set<string>();
  let created = 0;
  let updated = 0;
  let deleted = 0;

  // 1. Sync "Sewa Kamera" (Columns A..U -> idx 0..20; Status=17(R), MainID=18(S), H1ID=19(T), Hash=20(U))
  const sewaRows = await getSheetRows(config, token, 'Sewa Kamera');
  for (let i = 1; i < sewaRows.length; i++) {
    const r = sewaRows[i];
    const rowNum = i + 1;
    const orderId = (r[0] || '').trim();
    const nama = (r[2] || '').trim();
    const tanggalAmbil = (r[9] || '').trim();
    if (!orderId || !nama || !tanggalAmbil) continue;

    const status = (r[17] || 'Pending').trim();
    const mainEventId = (r[18] || '').trim();
    const h1EventId = (r[19] || '').trim();
    const savedHash = (r[20] || '').trim();

    if (status.toLowerCase() === 'batal') {
      if (mainEventId) {
        await deleteCalendarEvent(calendarId, token, mainEventId);
        deleted++;
      }
      if (h1EventId) {
        await deleteCalendarEvent(calendarId, token, h1EventId);
      }
      if (mainEventId || h1EventId || savedHash) {
        await updateSheetRange(config, token, 'Sewa Kamera', `S${rowNum}:U${rowNum}`, [['', '', 'CANCELLED']]);
      }
      continue;
    }

    activeOrderIds.add(orderId);
    const jamAmbil = (r[10] || '08:00').trim();
    const tanggalKembali = (r[11] || tanggalAmbil).trim();
    const jamKembali = (r[12] || jamAmbil).trim();
    const paket = (r[7] || r[6] || 'Sewa Kamera').trim();
    const whatsapp = (r[3] || '').trim();
    const pengantaran = (r[13] || '').trim();
    const total = (r[15] || '').trim();

    const currentHash = computeOrderHash([
      nama,
      whatsapp,
      paket,
      tanggalAmbil,
      jamAmbil,
      tanggalKembali,
      jamKembali,
      pengantaran,
      total,
      status,
    ]);

    if (!mainEventId || !h1EventId || currentHash !== savedHash) {
      const isNew = !mainEventId;
      let startIso = buildWibDateTime(tanggalAmbil, jamAmbil);
      let endIso = buildWibDateTime(tanggalKembali, jamKembali);
      if (endIso <= startIso) {
        endIso = buildWibDateTime(tanggalKembali, addOneHour(jamAmbil));
      }

      const description = [
        `Order ID: ${orderId}`,
        `Penyewa: ${nama} (${whatsapp})`,
        `Unit: ${paket}`,
        `Durasi: ${r[8] || '-'}`,
        `Pengantaran: ${pengantaran}`,
        `Jaminan: ${r[14] || '-'}`,
        `Total: ${total} (${r[16] || '-'})`,
        `Status: ${status}`,
      ].join('\n');

      const newMainId = await upsertCalendarEvent(
        calendarId,
        token,
        {
          summary: `[Sewa Kamera] ${nama} - ${paket}`,
          description,
          location: pengantaran,
          startIso,
          endIso,
          orderId,
          kind: 'main',
        },
        mainEventId || undefined
      );

      // H-1 Schedule at 18:00 - 19:00 WIB
      const h1Date = getMinusOneDayDate(tanggalAmbil);
      const newH1Id = await upsertCalendarEvent(
        calendarId,
        token,
        {
          summary: `[H-1 Sewa Kamera] Persiapan ${nama} (${paket})`,
          description: `Pengingat H-1 untuk pengambilan besok (${tanggalAmbil} ${jamAmbil} WIB).\n\n${description}`,
          location: pengantaran,
          startIso: buildWibDateTime(h1Date, '18:00'),
          endIso: buildWibDateTime(h1Date, '19:00'),
          orderId,
          kind: 'h1',
        },
        h1EventId || undefined
      );

      await updateSheetRange(config, token, 'Sewa Kamera', `S${rowNum}:U${rowNum}`, [
        [newMainId, newH1Id, currentHash],
      ]);

      if (isNew) created++;
      else updated++;
    }
  }

  // 2. Sync "Jasa Foto" (Columns A..T -> idx 0..19; Status=16(Q), MainID=17(R), H1ID=18(S), Hash=19(T))
  const fotoRows = await getSheetRows(config, token, 'Jasa Foto');
  for (let i = 1; i < fotoRows.length; i++) {
    const r = fotoRows[i];
    const rowNum = i + 1;
    const orderId = (r[0] || '').trim();
    const nama = (r[2] || '').trim();
    const tanggalSesi = (r[8] || '').trim();
    if (!orderId || !nama || !tanggalSesi) continue;

    const status = (r[16] || 'Pending').trim();
    const mainEventId = (r[17] || '').trim();
    const h1EventId = (r[18] || '').trim();
    const savedHash = (r[19] || '').trim();

    if (status.toLowerCase() === 'batal') {
      if (mainEventId) {
        await deleteCalendarEvent(calendarId, token, mainEventId);
        deleted++;
      }
      if (h1EventId) {
        await deleteCalendarEvent(calendarId, token, h1EventId);
      }
      if (mainEventId || h1EventId || savedHash) {
        await updateSheetRange(config, token, 'Jasa Foto', `R${rowNum}:T${rowNum}`, [['', '', 'CANCELLED']]);
      }
      continue;
    }

    activeOrderIds.add(orderId);
    const jamSesi = (r[9] || '09:00').trim();
    const paket = (r[6] || 'Jasa Foto').trim();
    const whatsapp = (r[3] || '').trim();
    const lokasi = [r[10], r[11]].filter(Boolean).join(' - ');
    const total = (r[14] || '').trim();

    const currentHash = computeOrderHash([
      nama,
      whatsapp,
      paket,
      r[7] || '',
      tanggalSesi,
      jamSesi,
      lokasi,
      total,
      status,
    ]);

    if (!mainEventId || !h1EventId || currentHash !== savedHash) {
      const isNew = !mainEventId;
      const startIso = buildWibDateTime(tanggalSesi, jamSesi);
      const endIso = buildWibDateTime(tanggalSesi, addOneHour(jamSesi));

      const description = [
        `Order ID: ${orderId}`,
        `Klien: ${nama} (${whatsapp})`,
        `Kampus/Instansi: ${r[4] || '-'}`,
        `Paket: ${r[5] || ''} - ${paket}`,
        `Add-On: ${r[7] || '-'}`,
        `Lokasi: ${lokasi || '-'}`,
        `Estimasi Orang: ${r[12] || '-'}`,
        `Catatan: ${r[13] || '-'}`,
        `Total: ${total} (${r[15] || '-'})`,
        `Status: ${status}`,
      ].join('\n');

      const newMainId = await upsertCalendarEvent(
        calendarId,
        token,
        {
          summary: `[Jasa Foto] ${nama} - ${paket}`,
          description,
          location: lokasi,
          startIso,
          endIso,
          orderId,
          kind: 'main',
        },
        mainEventId || undefined
      );

      // H-1 Schedule at 18:00 - 19:00 WIB
      const h1Date = getMinusOneDayDate(tanggalSesi);
      const newH1Id = await upsertCalendarEvent(
        calendarId,
        token,
        {
          summary: `[H-1 Jasa Foto] Persiapan ${nama} (${paket})`,
          description: `Pengingat H-1 untuk sesi foto besok (${tanggalSesi} ${jamSesi} WIB).\n\n${description}`,
          location: lokasi,
          startIso: buildWibDateTime(h1Date, '18:00'),
          endIso: buildWibDateTime(h1Date, '19:00'),
          orderId,
          kind: 'h1',
        },
        h1EventId || undefined
      );

      await updateSheetRange(config, token, 'Jasa Foto', `R${rowNum}:T${rowNum}`, [
        [newMainId, newH1Id, currentHash],
      ]);

      if (isNew) created++;
      else updated++;
    }
  }

  // 3. Remove Calendar events whose Order ID was deleted from the Spreadsheet
  const calEvents = await listFotonicCalendarEvents(calendarId, token);
  for (const ev of calEvents) {
    if (!activeOrderIds.has(ev.orderId)) {
      await deleteCalendarEvent(calendarId, token, ev.id);
      deleted++;
    }
  }

  return { created, updated, deleted, skippedNoCalendar: false };
}

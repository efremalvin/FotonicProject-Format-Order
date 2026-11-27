/**
 * Fotonic Project - Google Sheets <-> Google Calendar Auto-Sync
 * Dipasang pada Spreadsheet ID: 1YNPP_yqiRIIuvETQrbX9kG0tZpFlxtc23kAOpBTe8hU
 *
 * Fitur:
 * 1. Membuat otomatis tab "Sewa Kamera" & "Jasa Foto" beserta tabel header & validasi Status.
 * 2. Membuat event utama di Google Calendar untuk setiap orderan aktif.
 * 3. Membuat otomatis jadwal pengingat H-1 pada pukul 18:00 - 19:00 WIB.
 * 4. Memastikan sinkronisasi: jika baris di Spreadsheet diubah, dibatalkan ("Batal"),
 *    atau dihapus, event Utama & H-1 di Google Calendar ikut ter-update atau terhapus.
 */

var SHEET_SEWA = 'Sewa Kamera';
var SHEET_FOTO = 'Jasa Foto';
var SHEET_PROMO = 'Kode Promo';
var TIMEZONE = 'Asia/Jakarta';

var SEWA_HEADERS = [
  'Order ID', 'Waktu Order', 'Nama Penyewa', 'No. WhatsApp', 'Instagram',
  'Alamat Domisili', 'Paket Sewa', 'Detail Unit / Lensa', 'Durasi',
  'Tanggal Ambil', 'Jam Ambil', 'Tanggal Kembali', 'Jam Kembali',
  'Pengantaran', 'Jaminan', 'Total Tarif', 'Skema Bayar',
  'Status', 'Main Event ID', 'H-1 Event ID', 'Sync Hash',
  'Kode Promo', 'Potongan Diskon'
];

var FOTO_HEADERS = [
  'Order ID', 'Waktu Order', 'Nama Klien', 'No. WhatsApp', 'Kampus / Instansi',
  'Kategori', 'Paket Foto', 'Add-On', 'Tanggal Sesi', 'Jam Mulai',
  'Kategori Lokasi', 'Titik Kumpul', 'Jumlah Orang', 'Catatan',
  'Total Biaya', 'Skema Bayar', 'Status', 'Main Event ID', 'H-1 Event ID', 'Sync Hash',
  'Kode Promo', 'Potongan Diskon'
];

var PROMO_HEADERS = [
  'Kode Promo', 'Aktif', 'Jenis Layanan', 'Target Paket', 'Tipe Diskon',
  'Nilai Diskon', 'Maks. Diskon (Rp)', 'Min. Transaksi (Rp)', 'Berlaku Sampai',
  'Kuota Pakai', 'Terpakai', 'Keterangan'
];

function setupSheetsAndTables() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureTab_(ss, SHEET_SEWA, SEWA_HEADERS, 18);
  ensureTab_(ss, SHEET_FOTO, FOTO_HEADERS, 17);
  ensureTab_(ss, SHEET_PROMO, PROMO_HEADERS, -1);
}

function setupTriggers() {
  setupSheetsAndTables();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    ScriptApp.deleteTrigger(existing[i]);
  }

  ScriptApp.newTrigger('onSheetChangeSync').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('onSheetChangeSync').forSpreadsheet(ss).onChange().create();
  ScriptApp.newTrigger('syncCalendar').timeBased().everyMinutes(5).create();

  syncCalendar();
}

function onSheetChangeSync() {
  syncCalendar();
}

function syncCalendar() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureTab_(ss, SHEET_SEWA, SEWA_HEADERS, 18);
    ensureTab_(ss, SHEET_FOTO, FOTO_HEADERS, 17);

    var cal = CalendarApp.getDefaultCalendar();
    var activeOrderIds = {};

    syncSewaSheet_(ss.getSheetByName(SHEET_SEWA), cal, activeOrderIds);
    syncFotoSheet_(ss.getSheetByName(SHEET_FOTO), cal, activeOrderIds);
    cleanupDeletedOrders_(cal, activeOrderIds);
  } finally {
    lock.releaseLock();
  }
}

function syncSewaSheet_(sheet, cal, activeOrderIds) {
  if (!sheet || sheet.getLastRow() < 2) return;
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, SEWA_HEADERS.length).getValues();

  for (var i = 0; i < data.length; i++) {
    var r = data[i];
    var rowNum = i + 2;
    var orderId = String(r[0] || '').trim();
    var nama = String(r[2] || '').trim();
    var tanggalAmbil = formatDateCell_(r[9]);
    if (!orderId || !nama || !tanggalAmbil) continue;

    var status = String(r[17] || 'Pending').trim();
    var mainId = String(r[18] || '').trim();
    var h1Id = String(r[19] || '').trim();
    var savedHash = String(r[20] || '').trim();

    if (status.toLowerCase() === 'batal') {
      deleteEventById_(cal, mainId);
      deleteEventById_(cal, h1Id);
      if (mainId || h1Id || savedHash !== 'CANCELLED') {
        sheet.getRange(rowNum, 19, 1, 3).setValues([['', '', 'CANCELLED']]);
      }
      continue;
    }

    activeOrderIds[orderId] = true;
    var jamAmbil = formatTimeCell_(r[10], '08:00');
    var tanggalKembali = formatDateCell_(r[11]) || tanggalAmbil;
    var jamKembali = formatTimeCell_(r[12], jamAmbil);
    var paket = String(r[7] || r[6] || 'Sewa Kamera').trim();
    var whatsapp = String(r[3] || '').trim();
    var pengantaran = String(r[13] || '').trim();
    var total = String(r[15] || '').trim();

    var currentHash = computeHash_([
      nama, whatsapp, paket, tanggalAmbil, jamAmbil,
      tanggalKembali, jamKembali, pengantaran, total, status
    ]);

    if (!mainId || !h1Id || currentHash !== savedHash) {
      var startMain = parseWibDateTime_(tanggalAmbil, jamAmbil);
      var endMain = parseWibDateTime_(tanggalKembali, jamKembali);
      if (endMain.getTime() <= startMain.getTime()) {
        endMain = new Date(startMain.getTime() + 60 * 60 * 1000);
      }

      var desc = [
        'Order ID: ' + orderId,
        'Penyewa: ' + nama + ' (' + whatsapp + ')',
        'Unit: ' + paket,
        'Durasi: ' + (r[8] || '-'),
        'Pengantaran: ' + pengantaran,
        'Jaminan: ' + (r[14] || '-'),
        'Total: ' + total + ' (' + (r[16] || '-') + ')',
        'Status: ' + status
      ].join('\n');

      var newMainId = upsertEvent_(
        cal, mainId,
        '[Sewa Kamera] ' + nama + ' - ' + paket,
        startMain, endMain,
        desc + '\n\n[FotonicOrderID:' + orderId + '][Kind:main]',
        pengantaran
      );

      var h1Date = minusOneDay_(tanggalAmbil);
      var startH1 = parseWibDateTime_(h1Date, '18:00');
      var endH1 = parseWibDateTime_(h1Date, '19:00');
      var newH1Id = upsertEvent_(
        cal, h1Id,
        '[H-1 Sewa Kamera] Persiapan ' + nama + ' (' + paket + ')',
        startH1, endH1,
        'Pengingat H-1 untuk pengambilan besok (' + tanggalAmbil + ' ' + jamAmbil + ' WIB).\n\n' + desc + '\n\n[FotonicOrderID:' + orderId + '][Kind:h1]',
        pengantaran
      );

      sheet.getRange(rowNum, 19, 1, 3).setValues([[newMainId, newH1Id, currentHash]]);
    }
  }
}

function syncFotoSheet_(sheet, cal, activeOrderIds) {
  if (!sheet || sheet.getLastRow() < 2) return;
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, FOTO_HEADERS.length).getValues();

  for (var i = 0; i < data.length; i++) {
    var r = data[i];
    var rowNum = i + 2;
    var orderId = String(r[0] || '').trim();
    var nama = String(r[2] || '').trim();
    var tanggalSesi = formatDateCell_(r[8]);
    if (!orderId || !nama || !tanggalSesi) continue;

    var status = String(r[16] || 'Pending').trim();
    var mainId = String(r[17] || '').trim();
    var h1Id = String(r[18] || '').trim();
    var savedHash = String(r[19] || '').trim();

    if (status.toLowerCase() === 'batal') {
      deleteEventById_(cal, mainId);
      deleteEventById_(cal, h1Id);
      if (mainId || h1Id || savedHash !== 'CANCELLED') {
        sheet.getRange(rowNum, 18, 1, 3).setValues([['', '', 'CANCELLED']]);
      }
      continue;
    }

    activeOrderIds[orderId] = true;
    var jamSesi = formatTimeCell_(r[9], '09:00');
    var paket = String(r[6] || 'Jasa Foto').trim();
    var whatsapp = String(r[3] || '').trim();
    var lokasi = [r[10], r[11]].filter(function (v) { return String(v || '').trim() !== ''; }).join(' - ');
    var total = String(r[14] || '').trim();

    var currentHash = computeHash_([
      nama, whatsapp, paket, String(r[7] || ''),
      tanggalSesi, jamSesi, lokasi, total, status
    ]);

    if (!mainId || !h1Id || currentHash !== savedHash) {
      var startMain = parseWibDateTime_(tanggalSesi, jamSesi);
      var endMain = new Date(startMain.getTime() + 60 * 60 * 1000);

      var desc = [
        'Order ID: ' + orderId,
        'Klien: ' + nama + ' (' + whatsapp + ')',
        'Kampus/Instansi: ' + (r[4] || '-'),
        'Paket: ' + (r[5] || '') + ' - ' + paket,
        'Add-On: ' + (r[7] || '-'),
        'Lokasi: ' + (lokasi || '-'),
        'Estimasi Orang: ' + (r[12] || '-'),
        'Catatan: ' + (r[13] || '-'),
        'Total: ' + total + ' (' + (r[15] || '-') + ')',
        'Status: ' + status
      ].join('\n');

      var newMainId = upsertEvent_(
        cal, mainId,
        '[Jasa Foto] ' + nama + ' - ' + paket,
        startMain, endMain,
        desc + '\n\n[FotonicOrderID:' + orderId + '][Kind:main]',
        lokasi
      );

      var h1Date = minusOneDay_(tanggalSesi);
      var startH1 = parseWibDateTime_(h1Date, '18:00');
      var endH1 = parseWibDateTime_(h1Date, '19:00');
      var newH1Id = upsertEvent_(
        cal, h1Id,
        '[H-1 Jasa Foto] Persiapan ' + nama + ' (' + paket + ')',
        startH1, endH1,
        'Pengingat H-1 untuk sesi foto besok (' + tanggalSesi + ' ' + jamSesi + ' WIB).\n\n' + desc + '\n\n[FotonicOrderID:' + orderId + '][Kind:h1]',
        lokasi
      );

      sheet.getRange(rowNum, 18, 1, 3).setValues([[newMainId, newH1Id, currentHash]]);
    }
  }
}

function cleanupDeletedOrders_(cal, activeOrderIds) {
  var start = new Date();
  start.setDate(start.getDate() - 30);
  var end = new Date();
  end.setFullYear(end.getFullYear() + 1);

  var events = cal.getEvents(start, end, { search: 'FotonicOrderID:' });
  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    var desc = ev.getDescription() || '';
    var match = desc.match(/\[FotonicOrderID:([^\]]+)\]/);
    if (match && !activeOrderIds[match[1]]) {
      ev.deleteEvent();
    }
  }
}

function upsertEvent_(cal, existingId, title, startTime, endTime, description, location) {
  if (existingId) {
    try {
      var ev = cal.getEventById(existingId);
      if (ev) {
        ev.setTitle(title);
        ev.setTime(startTime, endTime);
        ev.setDescription(description);
        if (location) ev.setLocation(location);
        return ev.getId();
      }
    } catch (e) {}
  }
  var created = cal.createEvent(title, startTime, endTime, {
    description: description,
    location: location || ''
  });
  created.addPopupReminder(30);
  return created.getId();
}

function deleteEventById_(cal, eventId) {
  if (!eventId) return;
  try {
    var ev = cal.getEventById(eventId);
    if (ev) ev.deleteEvent();
  } catch (e) {}
}

function ensureTab_(ss, title, headers, statusCol) {
  var sheet = ss.getSheetByName(title);
  if (!sheet) {
    sheet = ss.insertSheet(title);
  }
  if (sheet.getLastRow() === 0 || !sheet.getRange(1, 1).getValue()) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#09090b').setFontColor('#d6a85a').setFontWeight('bold').setHorizontalAlignment('center');

    if (statusCol > 0) {
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(['Pending', 'DP', 'Confirmed', 'Lunas', 'Selesai', 'Batal'], true)
        .build();
      sheet.getRange(2, statusCol, 999, 1).setDataValidation(rule);
    }
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function formatDateCell_(val) {
  if (!val) return '';
  if (val instanceof Date) {
    return Utilities.formatDate(val, TIMEZONE, 'yyyy-MM-dd');
  }
  return String(val).trim();
}

function formatTimeCell_(val, fallback) {
  if (!val) return fallback;
  if (val instanceof Date) {
    return Utilities.formatDate(val, TIMEZONE, 'HH:mm');
  }
  return String(val).trim().slice(0, 5);
}

function parseWibDateTime_(dateStr, timeStr) {
  return new Date(dateStr + 'T' + timeStr + ':00+07:00');
}

function minusOneDay_(dateStr) {
  var parts = dateStr.split('-');
  var d = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function computeHash_(arr) {
  var raw = arr.map(function (v) { return String(v || '').trim(); }).join('|');
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.slice(0, 6).map(function (b) {
    return ('0' + (b & 0xff).toString(16)).slice(-2);
  }).join('');
}

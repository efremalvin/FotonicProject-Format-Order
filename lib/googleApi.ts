import crypto from 'crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3';

export interface GoogleConfig {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  calendarId?: string;
}

export function getGoogleConfig(): GoogleConfig | null {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_PRIVATE_KEY?.trim();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID?.trim();
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();

  if (!clientEmail || !rawKey || !spreadsheetId) {
    return null;
  }

  const privateKey = rawKey.replace(/\\n/g, '\n');
  return { clientEmail, privateKey, spreadsheetId, calendarId };
}

function base64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function getGoogleAccessToken(config: GoogleConfig, scopes: string[]): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(
    JSON.stringify({
      iss: config.clientEmail,
      scope: scopes.join(' '),
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  );

  const unsigned = `${header}.${claim}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsigned);
  sign.end();
  const signature = base64Url(sign.sign(config.privateKey));

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google OAuth failed (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export const SEWA_HEADERS = [
  'Order ID',
  'Waktu Order',
  'Nama Penyewa',
  'No. WhatsApp',
  'Instagram',
  'Alamat Domisili',
  'Paket Sewa',
  'Detail Unit / Lensa',
  'Durasi',
  'Tanggal Ambil',
  'Jam Ambil',
  'Tanggal Kembali',
  'Jam Kembali',
  'Pengantaran',
  'Jaminan',
  'Total Tarif',
  'Skema Bayar',
  'Status',
  'Main Event ID',
  'H-1 Event ID',
  'Sync Hash',
];

export const FOTO_HEADERS = [
  'Order ID',
  'Waktu Order',
  'Nama Klien',
  'No. WhatsApp',
  'Kampus / Instansi',
  'Kategori',
  'Paket Foto',
  'Add-On',
  'Tanggal Sesi',
  'Jam Mulai',
  'Kategori Lokasi',
  'Titik Kumpul',
  'Jumlah Orang',
  'Catatan',
  'Total Biaya',
  'Skema Bayar',
  'Status',
  'Main Event ID',
  'H-1 Event ID',
  'Sync Hash',
];

interface SheetMeta {
  properties: {
    sheetId: number;
    title: string;
  };
}

export async function ensureOrderSheetsExist(config: GoogleConfig, token: string): Promise<void> {
  const metaRes = await fetch(`${SHEETS_BASE}/${config.spreadsheetId}?fields=sheets.properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!metaRes.ok) {
    throw new Error(`Failed to read spreadsheet metadata (${metaRes.status}): ${await metaRes.text()}`);
  }

  const meta = (await metaRes.json()) as { sheets: SheetMeta[] };
  const existingTitles = new Map(meta.sheets.map((s) => [s.properties.title, s.properties.sheetId]));

  const desiredTabs: { title: string; headers: string[]; statusColIdx: number }[] = [
    { title: 'Sewa Kamera', headers: SEWA_HEADERS, statusColIdx: 17 },
    { title: 'Jasa Foto', headers: FOTO_HEADERS, statusColIdx: 16 },
  ];

  const requests: Record<string, unknown>[] = [];
  const newlyCreated: { title: string; headers: string[]; statusColIdx: number }[] = [];

  for (const tab of desiredTabs) {
    if (!existingTitles.has(tab.title)) {
      requests.push({
        addSheet: {
          properties: {
            title: tab.title,
            gridProperties: { frozenRowCount: 1 },
          },
        },
      });
      newlyCreated.push(tab);
    }
  }

  if (requests.length > 0) {
    const batchRes = await fetch(`${SHEETS_BASE}/${config.spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });
    if (!batchRes.ok) {
      throw new Error(`Failed to create sheets (${batchRes.status}): ${await batchRes.text()}`);
    }

    const updatedMetaRes = await fetch(`${SHEETS_BASE}/${config.spreadsheetId}?fields=sheets.properties`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedMeta = (await updatedMetaRes.json()) as { sheets: SheetMeta[] };
    for (const s of updatedMeta.sheets) {
      existingTitles.set(s.properties.title, s.properties.sheetId);
    }
  }

  // Ensure headers + table formatting on newly created or empty sheets
  const formatRequests: Record<string, unknown>[] = [];
  for (const tab of desiredTabs) {
    const sheetId = existingTitles.get(tab.title);
    if (sheetId === undefined) continue;

    // Check if row 1 already has headers
    const checkRes = await fetch(
      `${SHEETS_BASE}/${config.spreadsheetId}/values/${encodeURIComponent(`'${tab.title}'!A1:A1`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const checkData = (await checkRes.json()) as { values?: string[][] };
    const hasHeader = checkData.values && checkData.values[0] && checkData.values[0][0];

    if (!hasHeader || newlyCreated.some((n) => n.title === tab.title)) {
      await fetch(
        `${SHEETS_BASE}/${config.spreadsheetId}/values/${encodeURIComponent(`'${tab.title}'!A1`)}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: [tab.headers] }),
        }
      );

      formatRequests.push(
        {
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
            fields: 'gridProperties.frozenRowCount',
          },
        },
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: tab.headers.length },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.04, green: 0.04, blue: 0.05 },
                textFormat: { foregroundColor: { red: 0.84, green: 0.66, blue: 0.35 }, bold: true, fontSize: 10 },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
          },
        },
        {
          setDataValidation: {
            range: {
              sheetId,
              startRowIndex: 1,
              endRowIndex: 1000,
              startColumnIndex: tab.statusColIdx,
              endColumnIndex: tab.statusColIdx + 1,
            },
            rule: {
              condition: {
                type: 'ONE_OF_LIST',
                values: [
                  { userEnteredValue: 'Pending' },
                  { userEnteredValue: 'Confirmed' },
                  { userEnteredValue: 'Selesai' },
                  { userEnteredValue: 'Batal' },
                ],
              },
              showCustomUi: true,
              strict: false,
            },
          },
        },
        {
          autoResizeDimensions: {
            dimensions: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: tab.headers.length },
          },
        }
      );
    }
  }

  if (formatRequests.length > 0) {
    await fetch(`${SHEETS_BASE}/${config.spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests: formatRequests }),
    });
  }
}

export async function appendSheetRow(
  config: GoogleConfig,
  token: string,
  sheetTitle: string,
  rowValues: (string | number)[]
): Promise<number | null> {
  const range = encodeURIComponent(`'${sheetTitle}'!A1`);
  const res = await fetch(`${SHEETS_BASE}/${config.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [rowValues] }),
  });

  if (!res.ok) {
    throw new Error(`Failed to append row (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { updates?: { updatedRange?: string } };
  const match = data.updates?.updatedRange?.match(/![A-Z]+(\d+):/);
  return match ? parseInt(match[1], 10) : null;
}

export async function updateSheetRange(
  config: GoogleConfig,
  token: string,
  sheetTitle: string,
  a1Range: string,
  values: (string | number)[][]
): Promise<void> {
  const range = encodeURIComponent(`'${sheetTitle}'!${a1Range}`);
  const res = await fetch(`${SHEETS_BASE}/${config.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update sheet range (${res.status}): ${await res.text()}`);
  }
}

export async function getSheetRows(config: GoogleConfig, token: string, sheetTitle: string): Promise<string[][]> {
  const range = encodeURIComponent(`'${sheetTitle}'!A1:Z1000`);
  const res = await fetch(`${SHEETS_BASE}/${config.spreadsheetId}/values/${range}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { values?: string[][] };
  return data.values || [];
}

export function computeOrderHash(parts: (string | number | undefined)[]): string {
  return crypto
    .createHash('sha256')
    .update(parts.map((p) => String(p ?? '').trim()).join('|'))
    .digest('hex')
    .slice(0, 12);
}

export function buildWibDateTime(dateStr: string, timeStr: string): string {
  const cleanDate = dateStr.trim();
  const cleanTime = (timeStr || '09:00').trim().slice(0, 5);
  return `${cleanDate}T${cleanTime}:00+07:00`;
}

export function getMinusOneDayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

export interface CalendarEventPayload {
  summary: string;
  description: string;
  location?: string;
  startIso: string;
  endIso: string;
  orderId: string;
  kind: 'main' | 'h1';
}

export async function upsertCalendarEvent(
  calendarId: string,
  token: string,
  payload: CalendarEventPayload,
  existingEventId?: string
): Promise<string> {
  const body = {
    summary: payload.summary,
    description: `${payload.description}\n\n[FotonicOrderID:${payload.orderId}][Kind:${payload.kind}]`,
    location: payload.location || '',
    start: { dateTime: payload.startIso, timeZone: 'Asia/Jakarta' },
    end: { dateTime: payload.endIso, timeZone: 'Asia/Jakarta' },
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: payload.kind === 'h1' ? 30 : 60 }],
    },
  };

  if (existingEventId) {
    const patchRes = await fetch(
      `${CALENDAR_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(existingEventId)}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    if (patchRes.ok) {
      const updated = (await patchRes.json()) as { id: string };
      return updated.id;
    }
    if (patchRes.status !== 404 && patchRes.status !== 410) {
      throw new Error(`Calendar PATCH failed (${patchRes.status}): ${await patchRes.text()}`);
    }
  }

  const createRes = await fetch(`${CALENDAR_BASE}/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!createRes.ok) {
    throw new Error(`Calendar POST failed (${createRes.status}): ${await createRes.text()}`);
  }
  const created = (await createRes.json()) as { id: string };
  return created.id;
}

export async function deleteCalendarEvent(calendarId: string, token: string, eventId: string): Promise<void> {
  if (!eventId) return;
  const res = await fetch(
    `${CALENDAR_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Calendar DELETE failed (${res.status}): ${await res.text()}`);
  }
}

export async function listFotonicCalendarEvents(
  calendarId: string,
  token: string
): Promise<{ id: string; orderId: string }[]> {
  const url = `${CALENDAR_BASE}/calendars/${encodeURIComponent(calendarId)}/events?q=${encodeURIComponent(
    'FotonicOrderID:'
  )}&maxResults=250&singleEvents=true`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  const data = (await res.json()) as { items?: { id: string; description?: string }[] };
  const results: { id: string; orderId: string }[] = [];
  for (const item of data.items || []) {
    const match = item.description?.match(/\[FotonicOrderID:([^\]]+)\]/);
    if (match) {
      results.push({ id: item.id, orderId: match[1] });
    }
  }
  return results;
}

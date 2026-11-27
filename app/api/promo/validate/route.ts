import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAccessToken, getGoogleConfig } from '@/lib/googleApi';
import { PromoCheckInput, validatePromoInSheet } from '@/lib/promo';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function POST(req: NextRequest) {
  const config = getGoogleConfig();
  if (!config) {
    return NextResponse.json(
      { valid: false, message: 'Konfigurasi Google Spreadsheet belum tersedia di server.' },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as PromoCheckInput;
    const token = await getGoogleAccessToken(config, SCOPES);
    const result = await validatePromoInSheet(config, token, body);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[api/promo/validate] Error:', err);
    return NextResponse.json(
      { valid: false, message: 'Gagal memvalidasi kode promo. Pastikan tab Kode Promo dapat diakses.' },
      { status: 500 }
    );
  }
}

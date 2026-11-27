import { NextResponse } from 'next/server';
import { getGoogleConfig } from '@/lib/googleApi';
import { syncAllOrdersWithCalendar } from '@/lib/googleSync';

export async function GET() {
  const config = getGoogleConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: 'Google credentials not configured' }, { status: 500 });
  }

  try {
    const report = await syncAllOrdersWithCalendar(config);
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    console.error('[api/sync-calendar] Error:', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}

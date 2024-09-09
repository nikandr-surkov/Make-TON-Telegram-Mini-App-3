import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import geoip from 'geoip-lite';
import { getName } from 'country-list';

export async function POST(request: Request) {
  const { telegram_id, telegram_username, referrer_id, coin_balance } = await request.json();
  const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';
  const geo = geoip.lookup(ip);
  const country = geo ? getName(geo.country) || 'Unknown' : 'Unknown';

  try {
    await sql`
      INSERT INTO users (telegram_id, telegram_username, country, referrer_id, coin_balance)
      VALUES (${telegram_id}, ${telegram_username}, ${country}, ${referrer_id}, ${coin_balance})
      ON CONFLICT (telegram_id) 
      DO UPDATE SET 
        telegram_username = EXCLUDED.telegram_username,
        country = EXCLUDED.country,
        coin_balance = EXCLUDED.coin_balance,
        last_update = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegram_id = searchParams.get('telegram_id');

  if (!telegram_id) {
    return NextResponse.json({ success: false, error: 'Telegram ID is required' });
  }

  try {
    const referralCount = await sql`
      SELECT COUNT(*) FROM users WHERE referrer_id = ${telegram_id}
    `;

    return NextResponse.json({ success: true, referralCount: referralCount.rows[0].count });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

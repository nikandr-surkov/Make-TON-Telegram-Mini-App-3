import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fetch from 'node-fetch';

async function getCountryFromIP(ip: string): Promise<string> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/country_name/`);
    return await response.text() || 'Unknown';
  } catch (error) {
    console.error('Error fetching country:', error);
    return 'Unknown';
  }
}

export async function POST(request: Request) {
  const { telegram_id, telegram_username, referrer_id, coin_balance } = await request.json();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '0.0.0.0';
  const country = await getCountryFromIP(ip);

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
  const rewardEvent = searchParams.get('reward');

  if (rewardEvent && rewardEvent === 'true' && telegram_id) {
    // Handle the reward event
    try {
      // Simulate reward logic (update coin balance for example)
      await sql`
        UPDATE users 
        SET coin_balance = coin_balance + 500
        WHERE telegram_id = ${telegram_id}
      `;

      return NextResponse.json({ success: true, message: `Reward applied to user ${telegram_id}` });
    } catch (error) {
      return NextResponse.json({ success: false, error: (error as Error).message });
    }
  }

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

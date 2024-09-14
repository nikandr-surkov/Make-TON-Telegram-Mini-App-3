import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fetch from 'node-fetch';

// Function to get country from the user's IP
async function getCountryFromIP(ip: string): Promise<string> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/country_name/`);
    return await response.text() || 'Unknown';
  } catch (error) {
    console.error('Error fetching country:', error);
    return 'Unknown';
  }
}

// Handle POST requests (user creation/updating)
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

// Handle GET requests for referral count
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

// Handle REWARD event from Adsgram
export async function REWARD(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegram_id = searchParams.get('userid'); // Replace [userId] with Telegram ID

  if (!telegram_id) {
    return NextResponse.json({ success: false, error: 'Telegram ID is required for reward' });
  }

  try {
    // Increment the user's coin balance by the reward amount (for example, 500 coins)
    const rewardAmount = 500; // You can modify this amount based on the reward
    await sql`
      UPDATE users
      SET coin_balance = coin_balance + ${rewardAmount}
      WHERE telegram_id = ${telegram_id}
    `;

    return NextResponse.json({ success: true, message: `Reward applied to user ${telegram_id}` });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

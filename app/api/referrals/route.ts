import { getReferrals, getReferrer, saveReferral } from '@/lib/storage';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId, referrerId } = await request.json();
  
  if (!userId || !referrerId) {
    return NextResponse.json({ error: 'Missing userId or referrerId' }, { status: 400 });
  }

  saveReferral(userId, referrerId);
  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const referrals = getReferrals(userId);
  const referrer = getReferrer(userId);

  return NextResponse.json({ referrals, referrer });
}
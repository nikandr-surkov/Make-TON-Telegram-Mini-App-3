import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'referrals.json');

interface ReferralData {
  referrals: { [userId: string]: string[] };
  referredBy: { [userId: string]: string };
}

function ensureStorageFile() {
  if (!fs.existsSync(STORAGE_FILE)) {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify({ referrals: {}, referredBy: {} }));
  }
}

export function saveReferral(userId: string, referrerId: string) {
  ensureStorageFile();
  const data: ReferralData = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
  
  if (!data.referrals[referrerId]) {
    data.referrals[referrerId] = [];
  }
  data.referrals[referrerId].push(userId);
  data.referredBy[userId] = referrerId;

  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data));
}

export function getReferrals(userId: string): string[] {
  ensureStorageFile();
  const data: ReferralData = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
  return data.referrals[userId] || [];
}

export function getReferrer(userId: string): string | null {
  ensureStorageFile();
  const data: ReferralData = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
  return data.referredBy[userId] || null;
}
interface ReferralData {
    referrals: { [userId: string]: string[] };
    referredBy: { [userId: string]: string };
  }
  
  let storage: ReferralData = {
    referrals: {},
    referredBy: {}
  };
  
  export function saveReferral(userId: string, referrerId: string) {
    if (!storage.referrals[referrerId]) {
      storage.referrals[referrerId] = [];
    }
    storage.referrals[referrerId].push(userId);
    storage.referredBy[userId] = referrerId;
  }
  
  export function getReferrals(userId: string): string[] {
    return storage.referrals[userId] || [];
  }
  
  export function getReferrer(userId: string): string | null {
    return storage.referredBy[userId] || null;
  }
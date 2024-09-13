'use client';

import React, { useEffect, useState } from 'react';
import ReferralSystem from '@/components/ReferralSystem';
import { Trees, Users, Gift } from 'lucide-react';

export default function Friends() {
  const [initData, setInitData] = useState('');
  const [userId, setUserId] = useState('');
  const [startParam, setStartParam] = useState('');
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        setInitData(WebApp.initData);
        const userTelegramId = WebApp.initDataUnsafe.user?.id.toString() || '';
        setUserId(userTelegramId);
        setStartParam(WebApp.initDataUnsafe.start_param || '');

        // Fetch referral count
        if (userTelegramId) {
          try {
            const response = await fetch(`/api/user?telegram_id=${userTelegramId}`);
            const data = await response.json();
            if (data.success) {
              setReferralCount(parseInt(data.referralCount, 10));
            } else {
              console.error('Failed to fetch referral count:', data.error);
            }
          } catch (error) {
            console.error('Error fetching referral count:', error);
          }
        }
      }
    };
    initWebApp();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-red-700 to-green-800">
      <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center text-red-700 flex items-center justify-center">
          <Users className="mr-2" />
          Christmas Friends
        </h1>
        <p className="text-center mb-6 text-green-800">Spread the holiday cheer! Invite your friends and earn rewards.</p>
        
        <div className="bg-red-100 rounded-lg p-4 mb-6">
          <p className="text-center text-red-800 font-semibold">
            Your Invited Friends: <span className="text-2xl">{referralCount}</span>
          </p>
        </div>

        <ReferralSystem initData={initData} userId={userId} startParam={startParam} />
        
        <div className="mt-8 flex justify-center items-center space-x-4">
          <Gift className="text-red-700" size={24} />
          <p className="text-green-800 font-medium">Invite more friends to earn rewards!</p>
          <Trees className="text-green-800" size={24} />
        </div>
      </div>
    </main>
  );
}

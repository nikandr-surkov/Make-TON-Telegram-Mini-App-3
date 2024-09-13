'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Friends: React.FC = () => {
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        const userTelegramId = WebApp.initDataUnsafe.user?.id.toString() || '';

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
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 m-4 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Friends</h2>
      <div className="flex justify-center items-center space-x-4">
        <div className="bg-white p-2 rounded-full">
          <Image
            src="/friends.png"
            alt="Friends Icon"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="text-center">
          <p className="text-3xl font-semibold">{referralCount}</p>
          <p className="text-sm">Total Friends</p>
        </div>
      </div>
    </div>
  );
};

export default Friends;

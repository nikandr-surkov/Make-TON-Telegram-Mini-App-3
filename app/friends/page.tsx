'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Friends: React.FC = () => {
  const [referralCount, setReferralCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferralCount = async () => {
      setIsLoading(true);
      try {
        // Replace '123456789' with the actual way you're getting the user's Telegram ID
        const telegramId = '123456789';
        const response = await fetch(`/api/user?telegram_id=${telegramId}`);
        const data = await response.json();

        if (data.success) {
          setReferralCount(parseInt(data.referralCount));
        } else {
          setError(data.error || 'Failed to fetch referral count');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralCount();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Friends</h2>
      <div className="flex justify-center items-center space-x-4">
        <Image
          src="/friends-icon.png"
          alt="Friends Icon"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="text-center">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-xl font-semibold">
              {referralCount !== null ? referralCount : 0} Friends
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;

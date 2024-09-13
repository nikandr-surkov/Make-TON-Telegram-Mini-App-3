'use client';

import { useState, useEffect } from 'react'
import { WebApp } from '@twa-dev/sdk'

interface ReferralSystemProps {
  initData: string
  userId: string
  startParam: string
}

const Friends: React.FC<ReferralSystemProps> = ({ initData, userId, startParam }) => {
  const [referrals, setReferrals] = useState<string[]>([])
  const [referrer, setReferrer] = useState<string | null>(null)
  const [referralCount, setReferralCount] = useState<number>(0)
  const INVITE_URL = "https://t.me/telemas_ai_bot/Farm"

  useEffect(() => {
    const checkReferral = async () => {
      if (startParam && userId) {
        try {
          const response = await fetch('/api/referrals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, referrerId: startParam }),
          });
          if (!response.ok) throw new Error('Failed to save referral');
        } catch (error) {
          console.error('Error saving referral:', error);
        }
      }
    }

    const fetchReferrals = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/user?telegram_id=${userId}`);
          if (!response.ok) throw new Error('Failed to fetch referrals');
          const data = await response.json();
          if (data.success) {
            setReferralCount(parseInt(data.referralCount, 10));
          } else {
            console.error('Failed to fetch referral count:', data.error);
          }
        } catch (error) {
          console.error('Error fetching referrals:', error);
        }
      }
    }

    checkReferral();
    fetchReferrals();
  }, [userId, startParam])

  const handleInviteFriend = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`
    const shareText = `Join me accumulate coins for the first christmas airdop bot on Telegram.`
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`
    WebApp.openTelegramLink(fullUrl)
  }

  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        WebApp.showAlert("Invite link copied to clipboard!")
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        WebApp.showAlert("Failed to copy invite link. Please try again.")
      });
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 m-4 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Friends</h2>
      <div className="flex justify-center items-center space-x-4 mb-6">
        <div className="bg-white p-2 rounded-full">
          <img
            src="/friends.png"
            alt="Friends Icon"
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div className="text-center">
          <p className="text-3xl font-semibold">{referralCount}</p>
          <p className="text-sm">Total Friends</p>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleInviteFriend}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Invite Friend
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Copy Invite Link
        </button>
      </div>
    </div>
  )
}

export default Friends;

'use client'
import ReferralSystem from '@/components/ReferralSystem'
import { useEffect, useState } from 'react'
import { Gift, ChristmasTree, Users } from 'lucide-react'

export default function Friends() {
  const [initData, setInitData] = useState('')
  const [userId, setUserId] = useState('')
  const [startParam, setStartParam] = useState('')

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        setInitData(WebApp.initData);
        setUserId(WebApp.initDataUnsafe.user?.id.toString() || '');
        setStartParam(WebApp.initDataUnsafe.start_param || '');
      }
    };
    initWebApp();
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-red-700 to-green-800">
      <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center text-red-700 flex items-center justify-center">
          <Users className="mr-2" />
          Christmas Friends
        </h1>
        <p className="text-center mb-6 text-green-800">Spread the holiday cheer! Invite your friends and earn rewards.</p>
        <ReferralSystem initData={initData} userId={userId} startParam={startParam} />
        <div className="mt-8 flex justify-center">
          <Gift className="text-red-700 mr-2" size={24} />
          <ChristmasTree className="text-green-800 ml-2" size={24} />
        </div>
      </div>
    </main>
  )
}

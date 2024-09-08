'use client'
import ReferralSystem from '@/components/ReferralSystem'
import { useEffect, useState } from 'react'
import {Link} from 'next/link'

export default function Home() {

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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div>Follow us on  Twitter</div>
        <div>Follow us on Instagram</div>
        <div>Follow us on Youtube</div>
    </main>
  )
}
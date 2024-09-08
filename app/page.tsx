'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Snowflake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ReferralSystem from '@/components/ReferralSystem';

const NavLink = ({ href, children }) => (
  <Link href={href} className="text-white hover:text-red-300 transition-colors duration-200">
    {children}
  </Link>
);

export default function Home() {
  const [initData, setInitData] = useState('');
  const [userId, setUserId] = useState('');
  const [startParam, setStartParam] = useState('');

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
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-cover bg-center" style={{ backgroundImage: 'url("/christmas_bg.jpeg")' }}>
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <Card className="relative z-10 w-full max-w-md bg-white bg-opacity-90 shadow-xl rounded-lg overflow-hidden">
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-red-700">Welcome Home</h1>
          <nav className="mb-8">
            <ul className="flex justify-center space-x-6">
              <li><NavLink href="/">Home</NavLink></li>
              <li><NavLink href="/friends">Friends</NavLink></li>
              <li><NavLink href="/tasks">Tasks</NavLink></li>
            </ul>
          </nav>
          <div className="text-center text-gray-700">
            <p className="mb-4">Enjoy the holiday season!</p>
            <Snowflake className="inline-block text-blue-500 animate-bounce" size={32} />
          </div>
        </CardContent>
      </Card>
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          key={index}
          className="absolute text-white text-opacity-80 animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          ❄
        </div>
      ))}
    </main>
  );
}
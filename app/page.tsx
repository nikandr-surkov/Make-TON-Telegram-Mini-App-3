'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { Snowflake } from 'lucide-react';
import ReferralSystem from '@/components/ReferralSystem';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link href={href} className="text-white hover:text-red-300 transition-colors duration-200">
    {children}
  </Link>
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`bg-white bg-opacity-90 shadow-xl rounded-lg overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

export default function Home() {
  const [initData, setInitData] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [startParam, setStartParam] = useState<string>('');

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
    <main className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: 'url("/christmas_bg.jpeg")' }}>
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 w-64 h-64 perspective-500">
        <div className="w-full h-full animate-tree-sway transform-style-3d">
          <img
            src="/christmas_tree.png"
            alt="Swaying Christmas Tree"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}
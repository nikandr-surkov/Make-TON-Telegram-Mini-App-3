'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { Snowflake, Gift, Bell } from 'lucide-react';

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
    <main className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-red-700 to-green-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <Snowflake
            key={i}
            className="text-white opacity-50 absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
          
        ))}
        {[...Array(20)].map((_, i) => (
          <Gift
            key={i}
            className="text-yellow-400 opacity-50 absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Christmas Tree */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-3/4 h-3/4 max-w-3xl max-h-3xl perspective-[1000px]">
          <div className="w-full h-full animate-tree-rotate [transform-style:preserve-3d]">
            <div className="absolute w-full h-full backface-hidden">
              <img
                src="/christmas_tree.png"
                alt="Christmas Tree Front"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)]">
              <img
                src="/christmas_tree.png"
                alt="Christmas Tree Back"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Bell className="text-yellow-400" />
          <span className="font-bold text-lg">Merry Christmas!</span>
        </div>
        <nav className="flex space-x-4">
          <NavLink href="/friends">Friends</NavLink>
          <NavLink href="/tasks">Tasks</NavLink>
        </nav>
      </footer>
    </main>
  );
}
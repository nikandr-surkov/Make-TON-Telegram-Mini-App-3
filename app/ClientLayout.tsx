'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Users, CheckSquare } from 'lucide-react';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`flex items-center space-x-2 ${isActive ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`}>
      {children}
    </Link>
  );
};

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  
  // Track loading state to avoid showing access denied prematurely
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    // Check if the user is on a mobile device
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    // Set access permission based on mobile detection
    setIsAllowed(isMobile);
    
    // Once the check is done, stop loading
    setIsLoading(false);
  }, []);

  // While checking, show a loading screen to avoid flashing Access Denied
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  // If the user is not allowed (not on mobile), show Access Denied
  if (!isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
        <div className="p-4 bg-red-800 text-white rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p>This web app can only be accessed on a mobile device.</p>
        </div>
      </div>
    );
  }

  // If the user is on mobile, render the app
  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-grow ${isMainPage ? '' : 'overflow-auto pb-20'}`}>
        {children}
      </main>
      <footer className="bg-red-900 text-white py-4 px-6 flex justify-between items-center fixed bottom-0 left-0 right-0">
        <div className="flex items-center space-x-4">
          <Bell className="text-yellow-400" />
          <Link href="/">
            <span className="font-bold text-4xl cursor-pointer">🎅</span>
          </Link>
        </div>
        <nav className="flex space-x-8">
          <NavLink href="/friends">
            <Users size={24} />
            <span className="text-lg">Friends</span>
          </NavLink>
          <NavLink href="/tasks">
            <CheckSquare size={24} />
            <span className="text-lg">Tasks</span>
          </NavLink>
        </nav>
      </footer>
    </div>
  );
};

export default ClientLayout;

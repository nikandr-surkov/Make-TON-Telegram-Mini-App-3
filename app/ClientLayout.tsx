'use client';

import React from 'react';
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-grow ${isMainPage ? '' : 'overflow-auto pb-20'}`}>
        {children}
      </main>
      <footer className="bg-red-900 text-white py-4 px-6 flex justify-between items-center fixed bottom-0 left-0 right-0">
        <div className="flex items-center space-x-4">
          <Bell className="text-yellow-400" />
          <Link href="/">
            {/* Increased font size of the Santa emoji */}
            <span className="font-bold text-4xl cursor-pointer">🎅</span>
          </Link>
        </div>
        <nav className="flex space-x-8"> {/* Increased space between nav links */}
          <NavLink href="/friends">
            <Users size={24} /> {/* Increased icon size for consistency */}
            <span className="text-lg">Friends</span> {/* Made text slightly larger */}
          </NavLink>
          <NavLink href="/tasks">
            <CheckSquare size={24} /> {/* Increased icon size for consistency */}
            <span className="text-lg">Tasks</span> {/* Made text slightly larger */}
          </NavLink>
        </nav>
      </footer>
    </div>
  );
};

export default ClientLayout;

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
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow overflow-auto pb-20">
        {children}
      </main>
      <footer className="bg-red-900 text-white py-4 px-6 flex justify-between items-center fixed bottom-0 left-0 right-0">
        <div className="flex items-center space-x-4">
          <Bell className="text-yellow-400" />
          <Link href="/">
            <span className="font-bold text-lg cursor-pointer">Merry Christmas!</span>
          </Link>
        </div>
        <nav className="flex space-x-6">
          <NavLink href="/friends">
            <Users size={20} />
            <span>Friends</span>
          </NavLink>
          <NavLink href="/tasks">
            <CheckSquare size={20} />
            <span>Tasks</span>
          </NavLink>
        </nav>
      </footer>
    </div>
  );
};

export default ClientLayout;
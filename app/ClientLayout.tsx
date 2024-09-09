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
    <div className="flex flex-col h-screen">
      <main className="flex-grow overflow-hidden">
        {children}
      </main>
      <footer className="bg-red-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Bell className="text-yellow-400" />
          <span className="font-bold text-lg">Merry Christmas!</span>
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

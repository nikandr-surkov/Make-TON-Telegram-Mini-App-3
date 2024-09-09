'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Users, CheckSquare } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Winter Wonderland",
  description: "A festive winter game",
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`flex items-center space-x-2 ${isActive ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`}>
      {children}
    </Link>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-grow">
          {children}
        </main>
        {/* Footer */}
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
      </body>
    </html>
  );
}

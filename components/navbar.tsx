'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark-secondary border-b border-neon-purple/20 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">StreamArena</span>
          </Link>

          <div className="hidden md:flex gap-6">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-neon-cyan transition">
                  Dashboard
                </Link>
                <Link href="/games" className="text-gray-300 hover:text-neon-cyan transition">
                  Games
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-gray-300">Hi, {session.user?.name}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-neon-purple/20">
            {session ? (
              <>
                <Link href="/dashboard" className="block py-2 text-gray-300 hover:text-neon-cyan">
                  Dashboard
                </Link>
                <Link href="/games" className="block py-2 text-gray-300 hover:text-neon-cyan">
                  Games
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left py-2 text-gray-300 hover:text-neon-cyan"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="block py-2 text-gray-300">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-tertiary border border-neon-purple/20 rounded-lg backdrop-blur-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">StreamArena</h1>
          <p className="text-neon-cyan mb-8">Turn Your Twitch Chat Into The Game</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">Authentication error: {error}</p>
            </div>
          )}

          <button
            onClick={() => signIn('twitch', { callbackUrl: '/dashboard' })}
            className="w-full bg-gradient-neon hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 mb-4"
          >
            Sign in with Twitch
          </button>

          <p className="text-center text-gray-400 text-sm mt-6">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

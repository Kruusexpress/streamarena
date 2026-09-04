'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-tertiary border border-red-500/20 rounded-lg backdrop-blur-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Error</h1>
          <p className="text-red-400 mb-6">{error || 'An error occurred during authentication.'}</p>
          <Link
            href="/auth/signin"
            className="inline-block bg-gradient-neon hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}

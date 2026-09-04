'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-neon-purple/20 text-neon-purple border border-neon-purple/40',
    success: 'bg-green-500/20 text-green-400 border border-green-500/40',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
    error: 'bg-red-500/20 text-red-400 border border-red-500/40',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};

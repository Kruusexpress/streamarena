'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-dark-tertiary border border-neon-purple/20 rounded-lg backdrop-blur-xl p-6 shadow-xl ${
        hover ? 'hover:border-neon-purple/50 transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

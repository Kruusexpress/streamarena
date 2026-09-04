import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#a855f7',
        'neon-pink': '#ec4899',
        'neon-cyan': '#06b6d4',
        'dark-bg': '#0f0f0f',
        'dark-secondary': '#1a1a1a',
        'dark-tertiary': '#2a2a2a',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      },
      backdropBlur: {
        'xl': '20px',
      },
    },
  },
  plugins: [],
};

export default config;

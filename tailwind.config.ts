import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#f8f2e8',
        ink: '#1f1a17',
      },
      boxShadow: {
        glow: '0 25px 80px rgba(89, 62, 23, 0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config;

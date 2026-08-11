import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['"Rozha One"', '"Yatra One"', '"Tiro Devanagari Hindi"', 'serif'],
        devanagari: ['"Gotu"', '"Tiro Devanagari Hindi"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
      },
      colors: {
        cream: '#fbf6ec',
        'cream-dim': 'rgba(251, 246, 236, 0.75)',
        'cream-faint': 'rgba(251, 246, 236, 0.4)',
        'online-green': '#34d399',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};

export default config;

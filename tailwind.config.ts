import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'coin-reveal': {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(10deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '0' },
        },
        burst: {
          '0%': { transform: 'scale(0) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(-50px)', opacity: '0' },
        },
      },
      animation: {
        'fall': 'fall linear infinite',
        'bounce': 'bounce 1s ease-in-out infinite',
        'coin-reveal': 'coin-reveal 2s ease-out forwards',
        'burst': 'burst 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
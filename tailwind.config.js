/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0a0e1a',
          900: '#0f1424',
          850: '#141a2e',
          800: '#1a2138',
          700: '#232c4a',
          600: '#2f3a5e',
        },
        gold: {
          400: '#ffd35c',
          500: '#f5b83d',
          600: '#e09a1f',
        },
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(245,184,61,0.55)',
        card: '0 10px 30px -10px rgba(0,0,0,0.6)',
        tile: '0 4px 0 0 rgba(0,0,0,0.35)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.06)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floaty: 'floaty 3s ease-in-out infinite',
        pop: 'pop 0.35s cubic-bezier(.2,.9,.3,1.3)',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};

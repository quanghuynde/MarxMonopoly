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
        display: ['Fraunces', 'system-ui', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0a0e1a',
          900: '#0f1424',
          850: '#151b30',
          800: '#1a2138',
          700: '#232c4a',
          600: '#2f3a5e',
        },
        brass: {
          300: '#e9c785',
          400: '#d4a24e',
          500: '#c8933f',
          600: '#a4711f',
        },
        seal: {
          500: '#c23b2f',
        },
        paper: {
          100: '#f3e9d2',
        },
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(200,147,63,0.55)',
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

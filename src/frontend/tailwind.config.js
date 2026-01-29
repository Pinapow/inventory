/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Newsreader', 'Georgia', 'serif'],
      },

      colors: {
        surface: {
          base: '#0C0A09',
          card: '#1C1917',
          elevated: '#292524',
          overlay: '#44403C',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
      },

      boxShadow: {
        'premium': '0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
        'premium-hover': '0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 20px 50px -20px rgba(0, 0, 0, 0.5)',
        'glow-amber': '0 0 30px -5px rgba(245, 158, 11, 0.4)',
        'glow-lime': '0 0 20px -5px rgba(132, 204, 22, 0.3)',
        'glow-red': '0 0 20px -5px rgba(248, 113, 113, 0.3)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'shimmer': 'shimmer 2s infinite linear',
        'glow-pulse': 'glow-pulse 2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}

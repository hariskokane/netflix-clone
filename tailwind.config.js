/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'netflix-black': '#141414',
        'netflix-dark': '#181818',
        'netflix-gray': '#808080',
        'netflix-light-gray': '#b3b3b3',
        success: {
          DEFAULT: '#2ecc71',
          dark: '#27ae60',
        },
        warning: {
          DEFAULT: '#f39c12',
          dark: '#e67e22',
        },
        error: {
          DEFAULT: '#e74c3c',
          dark: '#c0392b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
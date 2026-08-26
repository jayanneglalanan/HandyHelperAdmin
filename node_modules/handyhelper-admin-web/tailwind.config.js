/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E5E5E5',
          300: '#D5D5D5',
          400: '#8A8A8A',
          500: '#666666',
          600: '#444444',
          700: '#333333',
          800: '#1A1A1A',
          900: '#111111',
          950: '#0A0A0A',
        },
        accent: {
          DEFAULT: '#5B4BDB',
          light: '#EDE9FE',
          hover: '#4A3BC9',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
};

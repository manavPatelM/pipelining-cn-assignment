/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': {
          50: '#e6f0ff',
          100: '#b3d4ff',
          200: '#80b8ff',
          300: '#4d9cff',
          400: '#1a80ff',
          500: '#0066e6',
          600: '#0052b3',
          700: '#003d80',
          800: '#00294d',
          900: '#001a33',
          950: '#000d1a',
        },
        'professional': {
          dark: '#000000',
          darker: '#000000',
          accent: '#1e40af',
          'accent-light': '#3b82f6',
          'accent-dark': '#1e3a8a',
        }
      },
      backgroundImage: {
        'professional-gradient': 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(30, 58, 138, 0.1) 100%)',
      },
      boxShadow: {
        'professional': '0 4px 20px rgba(30, 64, 175, 0.3)',
        'professional-lg': '0 10px 40px rgba(30, 64, 175, 0.4)',
      }
    },
  },
  plugins: [],
}

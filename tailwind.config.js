/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6df',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        warm: {
          50: '#fdfbf7',
          100: '#f7f2ea',
          200: '#ede2d1',
          300: '#e0ceb3',
          400: '#d1b58f',
          800: '#544636',
          900: '#2e251c',
        }
      },
    },
  },
  plugins: [],
}

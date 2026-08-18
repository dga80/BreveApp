/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        // Stitch Color Palette
        primary: {
          DEFAULT: '#005c55',
          container: '#0f766e',
          fixed: '#9cf2e8',
          'fixed-dim': '#80d5cb',
        },
        surface: {
          DEFAULT: '#f9f9f8',
          dim: '#dadad9',
          container: '#eeeeed',
          'container-low': '#f4f4f3',
          'container-lowest': '#ffffff',
          'container-highest': '#e2e2e2',
          variant: '#e2e2e2',
        },
        'on-surface': {
          DEFAULT: '#1a1c1c',
          variant: '#3e4947',
        },
        tertiary: {
          container: '#a84f37',
          'fixed-dim': '#ffb4a1',
        },
        stitch: {
          teal: '#0f766e',
          mint: '#80d5cb',
          darkTeal: '#005c55',
          bg: '#f9f9f8',
          card: '#f4f4f3',
          terracotta: '#a84f37',
          charcoal: '#1a1c1c',
          grayText: '#6e7977',
          lightMint: '#a3faef',
        },
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

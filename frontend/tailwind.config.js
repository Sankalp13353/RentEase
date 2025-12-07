/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#fafbff',
          dark: '#0f1118', // Main dark background
          primary: '#4f6df5', // Main brand color
          secondary: '#88a2ff', // Dark mode accent
          accent: '#6f85ff', // Hover state
          surface: {
            light: '#ffffff',
            dark: '#1a1d26', // Card/Navbar background
          },
          text: {
            main: '#1f1f1f',
            muted: '#5f5f5f',
            dark: '#eaeaea',
            darkMuted: '#b3b3b3',
          }
        }
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        gradientShift: 'gradientShift 10s ease infinite',
        fadeIn: 'fadeIn 0.3s ease',
      }
    },
  },
  plugins: [],
}

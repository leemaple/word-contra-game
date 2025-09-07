/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        'pixel': {
          'black': '#000000',
          'dark-gray': '#3C3C3C',
          'gray': '#5A5A5A',
          'light-gray': '#A8A8A8',
          'white': '#FFFFFF',
          'red': '#FF0000',
          'dark-red': '#800000',
          'green': '#00FF00',
          'dark-green': '#008000',
          'blue': '#0000FF',
          'dark-blue': '#000080',
          'yellow': '#FFFF00',
          'orange': '#FFA500',
          'purple': '#800080',
        }
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'shake': 'shake 0.5s',
        'flash': 'flash 0.2s',
        'pixelFade': 'pixelFade 0.3s step-end',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        flash: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },
        },
        pixelFade: {
          '0%': { opacity: '0' },
          '33%': { opacity: '0.33' },
          '66%': { opacity: '0.66' },
          '100%': { opacity: '1' },
        }
      },
      boxShadow: {
        'pixel': '2px 2px 0px rgba(0, 0, 0, 1)',
        'pixel-lg': '4px 4px 0px rgba(0, 0, 0, 1)',
        'pixel-inset': 'inset 2px 2px 0px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
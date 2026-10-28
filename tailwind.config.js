/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#14243A',
          800: '#203750',
          700: '#2b4766',
        },
        forest: {
          800: '#1b523d',
          700: '#246B50',
          600: '#2c8362',
        },
        ivory: {
          DEFAULT: '#F7F5F0',
          50: '#FCFBF9',
          100: '#F7F5F0',
          200: '#EDE9DE',
        },
        gold: {
          DEFAULT: '#C6A15B',
          light: '#D4B574',
          dark: '#B08C45',
        },
        ink: {
          primary: '#202B38',
          secondary: '#697586',
          muted: '#9AA4B2',
        },
        border: '#E5E7EB',
        status: {
          success: '#237A57',
          warning: '#B7791F',
          error: '#B42318',
          info: '#2F5F9F',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'classic': '0 4px 20px -2px rgba(20, 36, 58, 0.06), 0 2px 6px -1px rgba(20, 36, 58, 0.04)',
        'elevated': '0 10px 30px -4px rgba(20, 36, 58, 0.1), 0 4px 10px -2px rgba(20, 36, 58, 0.05)',
      }
    },
  },
  plugins: [],
}

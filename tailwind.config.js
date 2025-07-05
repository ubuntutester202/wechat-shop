/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
        'nunito': ['Nunito Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#004CFF',
          50: '#E6F0FF',
          100: '#CCE0FF',
          500: '#004CFF',
          600: '#0040D9',
          700: '#0035B3',
        },
        accent: {
          DEFAULT: '#8BC6FF',
          light: '#A8D2FF',
          dark: '#5982DA',
        },
        text: {
          primary: '#202020',
          secondary: '#666666',
          light: '#F3F3F3',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F9F9F9',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0px 3px 8px 0px rgba(0, 0, 0, 0.16)',
      }
    },
  },
  plugins: [],
} 
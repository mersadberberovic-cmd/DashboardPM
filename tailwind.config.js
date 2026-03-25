/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          200: '#b9ccff',
          300: '#86a8ff',
          400: '#4d7bff',
          500: '#2155f5',
          600: '#1440e8',
          700: '#1133cc',
          800: '#142ba6',
          900: '#162983',
        },
      },
    },
  },
  plugins: [],
}


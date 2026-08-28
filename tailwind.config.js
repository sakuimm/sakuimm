/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          primary: '#7A0C1E',   // IMM Crimson Maroon
          secondary: '#0097A7', // BCA Syariah Cyan
          accent: '#1D4ED8',    // Saldo Royal Blue
          bg: '#F8F9FA',        // Off-White Canvas
        },
        imm: {
          maroon: '#7A0C1E',
          maroonHover: '#600917',
          maroonActive: '#8A1224',
          cyan: '#0097A7',
          blue: '#1D4ED8',
          green: '#2E7D32',
          red: '#C05621',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
}

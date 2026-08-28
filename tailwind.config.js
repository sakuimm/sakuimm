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
          primary: '#2D3748',   // Soft Dark Slate
          secondary: '#81B29A', // Pastel Sage Green
          accent: '#F4A261',    // Pastel Warm Peach
          bg: '#F8F9FA',        // Off-White Canvas
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

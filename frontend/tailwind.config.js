/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0C',
        panel: '#141416',
        gold: {
          DEFAULT: '#C6A15B',
          light: '#E4CD97',
          dark: '#8E6F35'
        },
        cream: '#F3EFE4',
        fern: '#3F5B45'
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Jost"', 'sans-serif']
      },
      letterSpacing: {
        widest2: '0.35em'
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          2: 'rgb(var(--color-surface-2) / <alpha-value>)'
        },
        gold: {
          DEFAULT: 'rgb(var(--color-gold) / <alpha-value>)',
          light: 'rgb(var(--color-gold-light) / <alpha-value>)',
          dark: 'rgb(var(--color-gold-dark) / <alpha-value>)'
        },
        yellow: {
          DEFAULT: 'rgb(var(--color-yellow) / <alpha-value>)',
          light: 'rgb(var(--color-yellow-light) / <alpha-value>)',
          dark: 'rgb(var(--color-yellow-dark) / <alpha-value>)'
        },
        cream: 'rgb(var(--color-cream) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        muted2: 'rgb(var(--color-muted2) / <alpha-value>)',
        fern: 'rgb(var(--color-fern) / <alpha-value>)',
        rose: 'rgb(var(--color-rose) / <alpha-value>)',
        glass: 'rgb(var(--color-glass) / <alpha-value>)'
      },
      boxShadow: {
        gold: '0 20px 60px -15px rgb(var(--color-gold) / 0.35)',
        'gold-sm': '0 8px 24px -8px rgb(var(--color-gold) / 0.45)',
        yellow: '0 20px 60px -15px rgb(var(--color-yellow) / 0.4)',
        'yellow-sm': '0 8px 24px -8px rgb(var(--color-yellow) / 0.5)',
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
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

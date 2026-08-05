/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // These reference the CSS custom properties defined in :root at the
        // top of src/index.css — that's the single place to change colors.
        // The rgb(var(...) / <alpha-value>) format is Tailwind's documented
        // pattern for CSS-variable-driven colors that still support opacity
        // modifiers like bg-gold/10 or border-gold/20.
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        gold: {
          DEFAULT: 'rgb(var(--color-gold) / <alpha-value>)',
          light: 'rgb(var(--color-gold-light) / <alpha-value>)',
          dark: 'rgb(var(--color-gold-dark) / <alpha-value>)'
        },
        cream: 'rgb(var(--color-cream) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        muted2: 'rgb(var(--color-muted2) / <alpha-value>)',
        fern: 'rgb(var(--color-fern) / <alpha-value>)'
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

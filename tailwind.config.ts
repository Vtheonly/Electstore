import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-days-one)', 'sans-serif'],
      },
      colors: {
        'brand-blue': '#a2d2ff', // Bleu céleste
        'brand-blue-light': '#bce0ff', // Bleu clair
        'brand-blue-dark': '#001e4c', // Maintaining dark for contrast
        'brand-orange': '#ff6b6b', // Keeping as accent if needed, or we can use another color later
        'brand-gray': '#f4f4f4',
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(26, 42, 108, 0.1), 0 12px 10px -6px rgba(26, 42, 108, 0.1)',
        'premium-hover': '0 20px 40px -5px rgba(26, 42, 108, 0.15), 0 12px 15px -8px rgba(26, 42, 108, 0.15)',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}
export default config
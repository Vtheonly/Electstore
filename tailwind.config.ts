import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1a2a6c',
        'brand-blue-light': '#b21f1f',
        'brand-blue-dark': '#001e4c',
        'brand-orange': '#ff6b6b',
        'brand-gray': '#f4f4f4',
      },
    },
  },
  plugins: [],
}
export default config
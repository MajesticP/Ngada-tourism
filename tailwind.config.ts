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
        // Brand palette — earthy Flores tropical
        ngada: {
          50:  '#fdf8f0',
          100: '#faefd8',
          200: '#f4dcad',
          300: '#ecc578',
          400: '#e3a842',
          500: '#dc911f',
          600: '#c87315',
          700: '#a65813',
          800: '#864617',
          900: '#6d3a17',
          950: '#3b1c09',
        },
        forest: {
          50:  '#f1f8f1',
          100: '#deeddf',
          200: '#beddc2',
          300: '#92c49a',
          400: '#63a56e',
          500: '#418851',
          600: '#316c40',
          700: '#285635',
          800: '#21442b',
          900: '#1b3924',
          950: '#0d1f13',
        },
        terra: {
          50:  '#fdf5f0',
          100: '#fae8dd',
          200: '#f5cdb8',
          300: '#eeaa8a',
          400: '#e57e58',
          500: '#dc6038',
          600: '#ca4929',
          700: '#a83724',
          800: '#882f24',
          900: '#6f2a22',
          950: '#3c1310',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.8s ease forwards',
        'slide-right': 'slideRight 0.5s ease forwards',
        'parallax-slow': 'parallaxSlow linear forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grain': "url('/images/grain.png')",
        'hero-gradient': 'linear-gradient(135deg, #1b3924 0%, #285635 30%, #3b1c09 100%)',
      },
    },
  },
  plugins: [],
}
export default config

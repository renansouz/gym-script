/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#ffffff',
          900: '#f9fafb',
          800: '#f3f4f6',
          700: '#e5e7eb',
          600: '#6b7280'
        },
        accent: {
          DEFAULT: '#16a34a',
          dim: '#15803d',
          soft: '#dcfce7'
        },
        danger: '#dc2626'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 24px 0 rgba(57, 255, 136, 0.25)'
      }
    }
  },
  plugins: []
}

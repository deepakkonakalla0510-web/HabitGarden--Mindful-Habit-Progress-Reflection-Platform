/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        botanical: {
          50: '#F4F7F4',
          100: '#E8F0E6',
          200: '#D1E1CE',
          300: '#A8C3A0',
          400: '#7FA575',
          500: '#608056',
          600: '#4A7C43',
          700: '#2D5A27',
          800: '#1C3E18',
          900: '#142E10',
          dark: '#1C2E1A',
        },
        oatmeal: {
          50: '#FDFBF9',
          100: '#FAF7F2',
          200: '#F4EFE6',
          300: '#EFE8DC',
          400: '#E5DECF',
          500: '#D5CBB8',
        },
        terracotta: {
          50: '#FDF7F5',
          100: '#F9EBE6',
          200: '#F2D5CB',
          300: '#E8B6A5',
          400: '#E58B6D',
          500: '#D97757',
          600: '#C66547',
          700: '#A64F35',
        },
        moss: {
          light: '#E2E8DF',
          DEFAULT: '#9AAFA0',
          dark: '#586A5E',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        botanical: '0 4px 20px -2px rgba(45, 90, 39, 0.08), 0 2px 6px -1px rgba(45, 90, 39, 0.04)',
        'botanical-lg': '0 10px 30px -4px rgba(45, 90, 39, 0.12), 0 4px 10px -2px rgba(45, 90, 39, 0.06)',
        calm: '0 4px 25px -4px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'gentle-pulse': 'gentlePulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-float': 'subtleFloat 6s ease-in-out infinite',
      },
      keyframes: {
        gentlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};


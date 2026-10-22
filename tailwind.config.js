/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        adec: {
          blue: {
            DEFAULT: '#139BD7',
            50: '#F0F9FF',
            100: '#E0F2FE',
            200: '#BAE6FD',
            300: '#7DD3FC',
            400: '#38BDF8',
            500: '#139BD7',
            600: '#0284C7',
            700: '#0369A1',
            800: '#075985',
            900: '#0B4A6F',
            dark: '#0B72A2',
            light: '#E8F5FB',
          },
          orange: {
            DEFAULT: '#EA580C',
            50: '#FFF7ED',
            100: '#FFEDD5',
            200: '#FED7AA',
            300: '#FDBA74',
            400: '#FB923C',
            500: '#EA580C',
            600: '#D95304',
            700: '#C2410C',
            hover: '#D95304',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'adec-sm': '0 2px 8px -1px rgba(19, 155, 215, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'adec-md': '0 6px 20px -2px rgba(19, 155, 215, 0.12), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'adec-lg': '0 12px 32px -4px rgba(19, 155, 215, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'adec-card': '0 4px 24px 0 rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
};

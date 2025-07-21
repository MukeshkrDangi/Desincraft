/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#2563EB',
        accent: '#3B82F6',
        glass: 'rgba(255, 255, 255, 0.1)',
        'bg-light': 'rgba(59,130,246,0.3)',
        'bg-dark': 'rgba(168,85,247,0.5)',
      },
      boxShadow: {
        'xl-soft': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        glow: '0 0 10px rgba(255, 255, 255, 0.4)', // ✅ subtitle glow
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        madelyn: ['Madelyn', 'cursive'], // ✅ added Madelyn font
        bitcount: ['"Bitcount Grid Double"', 'system-ui'],



      },
      animation: {
        fade: 'fadeIn 0.8s ease-in-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        tilt: 'tiltMove 10s infinite linear',
        'fade-in-up': 'fadeInUp 1s ease-out',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite', // ✅ subtitle soft glow
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        tiltMove: {
          '0%, 100%': { transform: 'rotateZ(0deg)' },
          '50%': { transform: 'rotateZ(0.5deg)' },
        },
        pulseGlow: {
          '0%, 100%': {
            textShadow: '0 0 4px rgba(255,255,255,0.3)',
          },
          '50%': {
            textShadow: '0 0 12px rgba(255,255,255,0.6)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

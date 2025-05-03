module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(20px)' },
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)' },
          '50%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.8)' },
          '100%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)' },
        },
        twinkle: {
          '0%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '100%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        pulse: {
          '0%': { opacity: '0.4', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '0.4', transform: 'scale(0.9)' },
        },
        shootingStar: {
          '0%': { transform: 'translateX(0) translateY(0)', opacity: '0' },
          '5%': { opacity: '1' },
          '95%': { opacity: '1' },
          '100%': { transform: 'translateX(-120px) translateY(120px)', opacity: '0' }
        },
        moveCloud: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        fadeOut: 'fadeOut 0.3s ease-in forwards',
        slideIn: 'slideIn 0.6s ease-out',
        slideOut: 'slideOut 0.4s ease-in forwards',
        heartBeat: 'heartBeat 2s infinite',
        glow: 'glow 2s infinite',
        twinkle: 'twinkle 2s infinite',
        'twinkle-slow': 'twinkle 2.5s infinite',
        'twinkle-fast': 'twinkle 1.5s infinite',
        pulse: 'pulse 3s infinite',
        'pulse-slow': 'pulse 5s infinite',
        'pulse-fast': 'pulse 2s infinite',
      },
      colors: {
        'nebula-dark': '#0f0f1a',
        'nebula-purple': '#2d0a31',
        'nebula-blue': '#0a192f',
        'nebula-cyan': '#0a3240'
      },
      boxShadow: {
        'star': '0 0 4px 2px rgba(255, 255, 255, 0.8)',
        'glow-sm': '0 0 5px rgba(99, 102, 241, 0.25)',
        'glow-md': '0 0 12px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 20px rgba(99, 102, 241, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
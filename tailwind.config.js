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
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 4px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 10px rgba(99, 102, 241, 0.6)' },
          '100%': { boxShadow: '0 0 4px rgba(99, 102, 241, 0.4)' },
        },
        twinkle: {
          '0%': { opacity: '0.4', transform: 'scale(0.9)' },
          '50%': { opacity: '0.9', transform: 'scale(1.1)' },
          '100%': { opacity: '0.4', transform: 'scale(0.9)' },
        },
        'twinkle-cluster': {
          '0%': { opacity: '0.6', transform: 'scale(0.8)' },
          '50%': { opacity: '0.9', transform: 'scale(1.2)' },
          '100%': { opacity: '0.6', transform: 'scale(0.8)' },
        },
        pulse: {
          '0%': { opacity: '0.5', transform: 'scale(0.95)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
          '100%': { opacity: '0.5', transform: 'scale(0.95)' },
        },
        shootingStar: {
          '0%': { transform: 'translateX(0) translateY(0)', opacity: '0' },
          '5%': { opacity: '0.8' },
          '95%': { opacity: '0.8' },
          '100%': { transform: 'translateX(-100px) translateY(100px)', opacity: '0' },
        },
        moveCloud: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        orbit: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(2px, -2px)' },
          '50%': { transform: 'translate(0, 0)' },
          '75%': { transform: 'translate(-2px, 2px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        fadeOut: 'fadeOut 0.3s ease-in forwards',
        slideIn: 'slideIn 0.6s ease-out',
        slideOut: 'slideOut 0.4s ease-in forwards',
        heartBeat: 'heartBeat 2.5s infinite',
        glow: 'glow 2.5s infinite',
        twinkle: 'twinkle 3s infinite',
        'twinkle-slow': 'twinkle 4s infinite',
        'twinkle-fast': 'twinkle 2s infinite',
        'twinkle-cluster': 'twinkle-cluster 2.5s infinite',
        pulse: 'pulse 4s infinite',
        'pulse-slow': 'pulse 6s infinite',
        'pulse-fast': 'pulse 3s infinite',
        shootingStar: 'shootingStar 4s infinite',
        moveCloud: 'moveCloud 260s linear infinite',
        orbit: 'orbit 10s linear infinite',
      },
      colors: {
        'nebula-dark': '#0f0f1a',
        'nebula-purple': '#2d0a31',
        'nebula-blue': '#0a192f',
        'nebula-cyan': '#0a3240',
      },
      boxShadow: {
        'star': '0 0 3px 1px rgba(255, 255, 255, 0.6)',
        'glow-sm': '0 0 4px rgba(99, 102, 241, 0.2)',
        'glow-md': '0 0 8px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 12px rgba(99, 102, 241, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
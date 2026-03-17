import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        neon: '#00ff88',
        'neon-dim': 'rgba(0, 255, 136, 0.2)',
        surface: '#111111',
        'surface-hover': '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 255, 136, 0.4)',
        'glow-hover': '0 0 30px rgba(0, 255, 136, 0.6)',
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
      }
    },
  },
  plugins: [],
} satisfies Config

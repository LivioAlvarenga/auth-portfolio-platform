import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

import {
  backgroundImage,
  borderRadius,
  colors,
  fontFamily,
  animation as personalAnimation,
  keyframes as personalKeyframes,
  transitionDuration,
} from './src/styles/theme/tokens'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    extend: {
      colors,
      fontFamily,
      borderRadius,
      transitionDuration,
      backgroundImage,
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        ...personalKeyframes,
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        ...personalAnimation,
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addUtilities }) {
      const wrapper = {
        '.wrapper': {
          'max-width': '1280px',
          'padding-left': '1rem',
          'padding-right': '1rem',
          'margin-left': 'auto',
          'margin-right': 'auto',
          '@media (min-width: 768px)': {
            'padding-left': '1.5rem',
            'padding-right': '1.5rem',
          },
        },
      }

      addUtilities(wrapper)
    }),
  ],
} satisfies Config
export default config

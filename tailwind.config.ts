import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        black: "#000",
        "lime-yellow": "#d2f960",
        "posted-yellow": "#edffa4",
        "light-blue": "#81c2f2",
        "undp-blue": "#0368b1",
        "component-colors-utility-gray-utility-gray-50": "#f9fafb",
        "component-colors-utility-gray-utility-gray-200": "#e4e7ec",
        "component-colors-utility-gray-utility-gray-700": "#344054"
      },
      spacing: {
        "spacing-md": "8px",
        "spacing-xxs": "2px"
      },
      "borderRadius": {
          "9980xl": "9999px",
          "radius-full": "9999px"
      },
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'], 
        'noto-sans': ['Noto Sans', 'sans-serif'],
        'space-mono': ['Space Mono', 'monospace'],
      },
    },
    fontSize: {
      // Desktop sizes
      'h1-desktop': ['62px', { lineHeight: '68px' }],
      'h2-desktop': ['36px', { lineHeight: '46px' }],
      'h3-desktop': ['22px', { lineHeight: '30px' }],
      'small-title-desktop': ['20px', { lineHeight: '28px' }],
      'paragraph-desktop': ['18px', { lineHeight: '28px' }],
      'big-numbers-desktop': ['42px', { lineHeight: '48px' }],
      'button-desktop': ['18px', { lineHeight: '32px' }],
      
      // Mobile sizes
      'h1-mobile': ['40px', { lineHeight: '50px' }],
      'h2-mobile': ['28px', { lineHeight: '38px' }],
      'h3-mobile': ['21px', { lineHeight: '28px' }],
      'small-title-mobile': ['18px', { lineHeight: '26px' }],
      'paragraph-mobile': ['16px', { lineHeight: '26px' }],
      'big-numbers-mobile': ['32px', { lineHeight: '38px' }],
      'button-mobile': ['16px', { lineHeight: '24px' }],
    },
    fontWeight: {
      'regular': '400',
      'medium': '500',
      'bold': '700',
      'extra-bold': '900',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Newsreader"', '"Playfair Display"', '"Merriweather"', '"Georgia"', '"Cambria"', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        paper: {
          DEFAULT: '#fdfbf2',
          surface: '#ffffff',
          subtle: '#fef9e8',
          rule: '#f3e8c8',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        ink: {
          DEFAULT: '#1c1917',
          secondary: '#44403c',
          muted: '#78716c',
          faint: '#a8a29e',
        },
        bronze: {
          DEFAULT: '#854d0e',
          dark: '#713f12',
          light: '#b45309',
          faint: '#fef9ee',
        },
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36abf8',
          500: '#0c8ee9',
          600: '#0270c7',
          700: '#0359a1',
          800: '#074b85',
          900: '#0c3f6e',
          950: '#082849',
        },
        navy: {
          800: '#14213d',
          900: '#0b1325',
          950: '#060b17',
        },
        accent: {
          DEFAULT: '#d97706',
          dark: '#b45309',
          light: '#f59e0b',
        }
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;

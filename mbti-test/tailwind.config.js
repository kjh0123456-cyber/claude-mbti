/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper:   '#F5F2EC',
        surface: '#EDEAE2',
        ink:     '#1A1916',
        muted:   '#918D87',
        accent:  '#E8DC4A',
        line:    '#D0CBC0',
      },
      fontFamily: {
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FFFEF9',
        coral: '#E8927C',
        'watercolor-green': '#7EB8A6',
        'rose-gray': '#C88B9E',
        lavender: '#9B8EC4',
        'watercolor-yellow': '#E8C87C',
        'sky-blue': '#7CAED4',
        'caramel': '#D4A57C',
        'ink': '#3D3D3D',
        'coral-pink': '#F0B8B8',
        'mint': '#A8D8C8',
        'warm-gray': '#B8B0A8',
        'cream': '#F5E6C8',
        'peach': '#E8B8A0',
        'ice-blue': '#A8D0E8',
        'gold': '#E8D47C',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        hand: ['ZCOOL KuaiLe', 'Ma Shan Zheng', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sticker': '16px',
      },
      boxShadow: {
        'doodle': '2px 3px 0px rgba(61,61,61,0.1)',
        'sticker': '0 2px 12px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}

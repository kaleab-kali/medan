/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'love-pink': '#ff69b4',
        'love-purple': '#da70d6',
        'love-red': '#ff1493',
        'chat-bg': '#f8fafc'
      },
      animation: {
        'bounce-soft': 'bounce 1s infinite',
        'pulse-heart': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
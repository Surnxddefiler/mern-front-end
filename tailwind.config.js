/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#090a0f',
        secondary: "rgba(103, 118, 253, 0.60)",
        third: "rgba(158,202,211,0.60)",
        fourth: "rgba(17,188,242,255)",
        fifth: "rgba(254,56,117,255)",
        input: 'rgba(254,255,255,0.8)'
      }
    },
  },
  plugins: [],
}


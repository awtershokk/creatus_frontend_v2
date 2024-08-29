/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        },
        swingTop: {
          '0%': { transform: 'rotate(0deg)', transformOrigin: 'top center' },
          '20%': { transform: 'rotate(-10deg)', transformOrigin: 'top center' },
          '40%': { transform: 'rotate(10deg)', transformOrigin: 'top center' },
          '60%': { transform: 'rotate(-10deg)', transformOrigin: 'top center' },
          '80%': { transform: 'rotate(10deg)', transformOrigin: 'top center' },
          '100%': { transform: 'rotate(0deg)', transformOrigin: 'top center' },
        },
      },
      animation: {
        blink: 'blink 1s infinite alternate',
        swingTop: 'swingTop 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

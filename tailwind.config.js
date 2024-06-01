/** @type {import('tailwindcss').Config} */
export default {
  darkMode:'class',
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customRed: '#E33439',
      },
    },
  },
  plugins: [],
}


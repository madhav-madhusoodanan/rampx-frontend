/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
  	  "./index.html",
    	"./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Syne"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'neutral-custom-900': '#100f0f',
        'primary-500': "#D0F603",
        'primary-700': "#5E6F01",
        'primary-900': "#232418"
      },
    },
  },
  plugins: [],
}


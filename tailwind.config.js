const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  theme: {
    fontFamily :{
      'roboto': ['Roboto', 'sans-serif'],
      'pressStart': ['"Press Start 2P"', 'cursive'],
    },
    extend: {},
  },
  plugins: [
    flowbite.plugin()
  ],
}
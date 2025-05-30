/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'biaukai': ['BiauKai', '標楷體', 'serif'],
        'playfair': ['"Playfair Display"', 'serif'],
        'patrick': ['"Patrick Hand"', 'cursive'],
      },
}

  },
  plugins: [],
}

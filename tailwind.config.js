/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar';
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
  plugins: [scrollbar],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      fontFamily: {
        sans: ['Josefin Sans', 'sans-serif'],
      },
      colors:{
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",

      }
    },
  },
  plugins: [],
}
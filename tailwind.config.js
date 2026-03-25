/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Slate/Zinc profesional tipo plomo
        slate: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        zinc: {
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        }
      },
    },
  },
  plugins: [],
}

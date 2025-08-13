/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts,tsx}",
    "../packages/pantanal-grid/src/**/*.{vue,ts,tsx}" // inclui o pacote da lib
  ],
  theme: {
    extend: {
      colors: {
        grid: {
          bg: "var(--grid-bg, #fff)",
          border: "var(--grid-border, #e5e7eb)",
          text: "var(--grid-text, #0f172a)",
          header: "var(--grid-header, #f8fafc)",
          accent: "var(--grid-accent, #18a058)"
        }
      }
    }
  },
  plugins: [],
}


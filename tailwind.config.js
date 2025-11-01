/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#223e6f",
        accent: "#8ad759",
        secondary: "#c8c8c8",
        background: "#ffffff",
        highlight: "#72cad4",
        // optional aliases matching your original names (use if helpful)
        "primary-blue": "#223e6f",
        "accent-green": "#8ad759",
        "secondary-grey": "#c8c8c8",
        "background-white": "#ffffff",
        "highlight-cyan": "#72cad4",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"], // body
        heading: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],     // headings
        brand: ["Momo Trust Display", "Inter", "sans-serif"],               // branding
      },
    },
  },
  plugins: [],
}


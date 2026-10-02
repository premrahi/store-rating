/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      boxShadow: {
        soft: "0 20px 60px -25px rgba(15, 23, 42, 0.18)"
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "corporate"],
    logs: false
  }
};

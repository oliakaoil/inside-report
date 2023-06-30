/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "theme-bg-gray": "#2f3740",
        "theme-bg-black": "#0d1520",
        "theme-bg-hover-gray": "#1E2530",
        "theme-border-gray": "#4c4a4a",
        "theme-text-gray": "#b1b5bc",
        "theme-text-white": "#fff",
        "theme-button-purple": "#6565ff",
        "theme-bg-input-gray": "#1E2530",
      },
    },
  },
  plugins: [],
};

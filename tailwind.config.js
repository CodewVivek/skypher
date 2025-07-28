/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        "tt-norms": ["TT Norms", "Inter", "system-ui", "sans-serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        launch: {
          "0%": { transform: "translateY(0) scale(1)", opacity: 1 },
          "30%": { transform: "translateY(-10px) scale(1.1)", opacity: 1 },
          "100%": { transform: "translateY(-25px) scale(0.9)", opacity: 0 },
        },
      },
      animation: {
        launch: "launch 0.8s ease-out",
      },
    },
  },
  plugins: [],
};

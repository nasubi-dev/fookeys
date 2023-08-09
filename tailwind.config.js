/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/*.html", "./src/**/*.{vue,ts}", "./src/views/**/*.{vue,ts}", "./src/components/**/*.{vue,ts}"],
  theme: {
    extend: {
      animation: {
        "slide-in-top": "slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
      },
      keyframes: {
        "slide-in-top": {
          "0%": {
            transform: "translateY(-1000px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};

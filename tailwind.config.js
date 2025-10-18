/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ habilita el modo oscuro controlado por React
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#001F3F", // Azul oscuro de tus diseños
        accent: "#FFD700",  // Amarillo para highlights
      },
    },
  },
  plugins: [],
};

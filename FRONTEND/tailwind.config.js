// tailwind.config.js
import flowbite from 'flowbite/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite/**/*.js" // Incluye los archivos de Flowbite
  ],
  theme: {
    extend: {
      screens: {
        xl: '1300px', // Cambia el breakpoint 'xl' a 1350px
      },
    },
  },
  plugins: [flowbite], // Agrega Flowbite como plugin
};


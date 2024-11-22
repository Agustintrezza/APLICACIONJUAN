// tailwind.config.js
import flowbite from 'flowbite/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite/**/*.js" // Incluye los archivos de Flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite], // Agrega Flowbite como plugin
};


// src/components/selectfilters/InfoButtons.jsx
import { FaHeart, FaBell, FaDownload } from 'react-icons/fa';

const InfoButtons = () => {
  return (
    <div className="sticky-sidebar border shadow-lg rounded-lg p-2 flex items-center justify-between mb-3">
      {/* Botón de Favoritos */}
      <button
        className="relative flex items-center shadow-lg justify-center bg-transparent border rounded-full p-2 hover:scale-105 transition-transform"
      >
        <FaHeart className="text-[#293e68]" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">1</span>
      </button>

      {/* Botón de Notificaciones */}
      <button
        className="relative flex items-center shadow-lg justify-center bg-transparent border rounded-full p-2 hover:scale-105 transition-transform"
      >
        <FaBell className="text-[#293e68]" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">2</span>
      </button>

      {/* Botón de Descargas */}
      <button
        className="relative flex items-center shadow-lg justify-center bg-transparent border rounded-full p-2 hover:scale-105 transition-transform"
      >
        <FaDownload className="text-[#293e68]" />
      </button>
    </div>
  );
};

export default InfoButtons;

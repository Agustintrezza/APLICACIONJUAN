import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHome, FaPlus, FaBars, FaTimes, FaPowerOff, FaFileAlt } from 'react-icons/fa';

const SidebarResponsive = ({ isAuthenticated, logout, user }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Bloquear el scroll del body cuando el sidebar está abierto
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto'; // Restaurar scroll cuando se desmonta
    };
  }, [isSidebarOpen]);

  if (!isAuthenticated) return null;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Cambia el estado al contrario
  };

  const handleLinkClick = () => {
    setIsSidebarOpen(false); // Cierra el Sidebar al hacer clic en un enlace
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar el Sidebar */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-3 bg-[#337cf9] border border-blue-400 text-white p-3 rounded-lg z-50"
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20}/>}
      </button>

      {/* Overlay del Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-60 bg-[#293e68] text-white flex flex-col p-0 z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {user && <div className="py-4 p-4 font-bold">{user.email}</div>}

        <nav className="space-y-4 p-2">
        <SidebarLink
          to="/listas"
          icon={<FaPlus />}
          label="Listas"
          currentPath={location.pathname}
          onClick={handleLinkClick} // Asegúrate de pasar esta función
          className="font-medium"
        />
          <SidebarLink to="/" icon={<FaHome />} label="Curriculums" currentPath={location.pathname} onClick={handleLinkClick} className="font-medium"/>
          <SidebarLink to="/crear-cv" icon={<FaFileAlt />} label="Ingresar Curriculm" currentPath={location.pathname} onClick={handleLinkClick} className="font-medium"/>
        </nav>

        <button onClick={logout} className="mt-auto bg-red-600 px-4 py-2 rounded flex items-center justify-center">
          <FaPowerOff />
          <span className="ml-2">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );
};

const SidebarLink = ({ to, icon, label, currentPath, onClick }) => {
  const isActive = currentPath === to;

  return (
    <Link
      to={to}
      onClick={onClick} // Llama a la función para cerrar el Sidebar
      className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
        isActive ? 'bg-blue-100 text-[#293e68]' : 'hover:bg-blue-100 hover:text-[#293e68]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

SidebarResponsive.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
};

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  currentPath: PropTypes.string.isRequired,
  onClick: PropTypes.func, // Nueva prop para manejar clics en los enlaces
};

export default SidebarResponsive;

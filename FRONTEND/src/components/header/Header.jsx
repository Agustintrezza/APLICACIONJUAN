import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Navbar, Button, Dropdown } from 'flowbite-react';
import { FaUserCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <Navbar fluid rounded className="bg-blue-700 px-4">
      <div className="flex justify-between items-center w-full">
        {/* Columna 1: Logo */}
        <Navbar.Brand href="/" className="text-white text-xl font-semibold">
          Mi Aplicación
        </Navbar.Brand>

        {/* Columna 2: Enlaces de navegación */}
        <div className="hidden lg:flex space-x-8">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/formulario" className="text-white hover:text-gray-300">Ingresar CV</Link>
        </div>

        {/* Columna 3: Avatar con correo y botón de Cerrar Sesión */}
        <div className="flex items-center space-x-4">
          {/* Correo electrónico del usuario */}
          <span className="text-white hidden lg:block">{user?.email}</span>

          {/* Dropdown del Avatar */}
          <Dropdown
            label={
              <div className="flex items-center space-x-1 text-white text-2xl cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                <FaUserCircle />
              </div>
            }
            inline
            arrowIcon={false}
            placement="bottom-start" // Abre el dropdown hacia abajo
          >
            <Dropdown.Item>
              <Link to="/perfil">Perfil</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to="/generales">Generales</Link>
            </Dropdown.Item>
          </Dropdown>

          {/* Botón de Cerrar Sesión */}
          <Button
            onClick={logout}
            color="light"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;

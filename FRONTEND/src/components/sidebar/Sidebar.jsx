import PropTypes from 'prop-types'
import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { FaPlus, FaUser, FaChevronLeft, FaChevronRight, FaPowerOff, FaFileAlt } from 'react-icons/fa'
import avatarImg from '../../assets/imagenes/avatarimg.webp'

const Sidebar = () => {
  const { isAuthenticated, logout, isSidebarExpanded, toggleSidebar, user } = useContext(AppContext)
  const location = useLocation()

  if (!isAuthenticated) return null

  return (
    <div
      className={`h-screen ${isSidebarExpanded ? 'w-56' : 'w-16'} text-white flex flex-col py-4 transition-all duration-150 font-sans`}
      style={{
        alignItems: isSidebarExpanded ? 'flex-start' : 'center',
        backgroundColor: '#293e68',
        boxShadow: '4px 0px 12px rgba(0, 0, 0, 0.4)',
        zIndex: 10,
      }}
    >
      <button
        onClick={toggleSidebar}
        className={`text-white text-lg hover:text-gray-300 transition-all duration-150 ${isSidebarExpanded ? 'self-end mr-2' : 'mb-8'}`}
      >
        {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {isSidebarExpanded && user && (
        <div className="flex items-center space-x-2 px-4 py-4 w-full">
          <img
            src={avatarImg}
            alt="User avatar"
            className="rounded-full h-12 w-12 border border-gray-500"
          />
          <span className="text-sm text-grey-200 font-semibold">{user.email}</span>
        </div>
      )}

      <nav className="space-y-6 w-full mt-4">
        <SidebarLink to="/listas" icon={<FaPlus />} label="Listas" isSidebarExpanded={isSidebarExpanded} currentPath={location.pathname} className="font-medium" />
        <SidebarLink to="/" icon={<FaUser />} label="Curriculums" isSidebarExpanded={isSidebarExpanded} currentPath={location.pathname} className="font-medium" />
        <SidebarLink to="/crear-cv" icon={<FaFileAlt />} label="Ingresar Curriculum" isSidebarExpanded={isSidebarExpanded} currentPath={location.pathname} className="font-medium" />
      </nav>

      <button
        onClick={logout}
        className="mt-auto flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white w-full transition-all duration-150 justify-center"
      >
        <FaPowerOff className="text-2xl" />
        {isSidebarExpanded && <span className="text-sm font-semibold">Cerrar Sesión</span>}
      </button>
    </div>
  )
}

const SidebarLink = ({ to, icon, label, isSidebarExpanded, currentPath, showCount }) => {
  const isActive = currentPath === to
  const iconSize = isSidebarExpanded ? 'text-xl' : 'text-3xl'

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-2 w-full relative transition-all duration-150 ${
        isActive ? 'bg-blue-100 text-[#293e68] font-semibold' : 'hover:bg-blue-100 hover:text-[#293e68] font-semibold'
      }`}
    >
      <span className={`relative ${iconSize} transition-colors duration-150`} style={{ color: 'inherit' }}>
        {icon}
        {to === '/favoritos' && showCount && (
          <span className="absolute -top-3 -right-1 bg-red-500 text-white rounded-full px-1.5 text-xs z-20">
            {showCount}
          </span>
        )}
      </span>
      {isSidebarExpanded && <span className="whitespace-nowrap text-sm">{label}</span>}
    </Link>
  )
}

Sidebar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  isSidebarExpanded: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
}

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  isSidebarExpanded: PropTypes.bool.isRequired,
  currentPath: PropTypes.string.isRequired,
  showCount: PropTypes.number,
}

export default Sidebar

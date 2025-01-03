import { useContext, useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'
import SidebarResponsive from '../sidebar/SidebarResponsive'
import FloatingButtonCategories from '../floating-buttons/FloatingButtonCategories'
import FloatingButtonListas from '../floating-buttons/FloatingButtonListas'
import { Sidebar as FlowbiteSidebar } from 'flowbite-react'
import FormularioListas from '../listas/FormularioListas'
import { AppContext } from '../../context/AppContext'

const Layout = () => {
  const { isAuthenticated, logout, isSidebarExpanded, toggleSidebar, user } = useContext(AppContext)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isListasOpen, setIsListasOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleCategories = (isOpen) => {
    setIsCategoriesOpen(isOpen)
  }

  const toggleListas = (isOpen) => {
    setIsListasOpen(isOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {isDesktop ? (
        <Sidebar
          isAuthenticated={isAuthenticated}
          logout={logout}
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          user={user}
        />
      ) : (
        <SidebarResponsive
          isAuthenticated={isAuthenticated}
          logout={logout}
          user={user}
        />
      )}
      <main className="flex-1 p-4 bg-gray-100 overflow-auto relative">
        {!isDesktop && location.pathname === '/' && (
          <FloatingButtonCategories onToggle={toggleCategories} />
        )}
        {!isDesktop && location.pathname === '/listas' && (
          <FloatingButtonListas onToggle={toggleListas} />
        )}
        <Outlet context={{ isCategoriesOpen, isListasOpen }} />
      </main>

      {/* Sidebar para listas */}
      {isListasOpen && (
        <div className="fixed inset-0 z-50 bg-blue-300">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsListasOpen(false)}
          />
          <FlowbiteSidebar className="absolute right-0 w-80 flowbite-sidebar shadow-lg">
            <FormularioListas
              onCreate={(newLista) => {
                console.log('Nueva lista creada:', newLista)
                setIsListasOpen(false) // Cerrar el sidebar después de crear
              }}
              onUpdate={() => setIsListasOpen(false)}
            />
          </FlowbiteSidebar>
        </div>
      )}
    </div>
  )
}

export default Layout

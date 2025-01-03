import { useContext, useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'
import SidebarResponsive from '../sidebar/SidebarResponsive'
import FloatingButtonCategories from '../floating-buttons/FloatingButtonCategories'
import { AppContext } from '../../context/AppContext'

const Layout = () => {
  const { isAuthenticated, logout, isSidebarExpanded, toggleSidebar, user } = useContext(AppContext)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const location = useLocation() // Detecta la ruta actual

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleCategories = (isOpen) => {
    setIsCategoriesOpen(isOpen)
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
        {/* Mostrar el botón flotante solo en la ruta '/' */}
        {!isDesktop && location.pathname === '/' && (
          <FloatingButtonCategories onToggle={toggleCategories} />
        )}
        <Outlet context={{ isCategoriesOpen }} />
      </main>
    </div>
  )
}

export default Layout

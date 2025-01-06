import { useState, useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import PropTypes from "prop-types"

const FloatingButtonCvDetail = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  if (isDesktop) return null // No mostrar el botón flotante en escritorio

  return (
    <>
      <button
        onClick={onToggleSidebar}
        className={`fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg z-50 ${
          isSidebarOpen ? "opacity-50 cursor-not-allowed" : "opacity-100"
        }`}
        title="Abrir Asignaciones"
        disabled={isSidebarOpen}
      >
        <FaPlus size={24} />
      </button>
    </>
  )
}

FloatingButtonCvDetail.propTypes = {
    onToggleSidebar: PropTypes.func.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired, // Prop obligatoria
  };

export default FloatingButtonCvDetail

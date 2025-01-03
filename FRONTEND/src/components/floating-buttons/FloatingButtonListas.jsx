import { useState, useEffect } from 'react'
import { FaEdit } from 'react-icons/fa'
import PropTypes from 'prop-types'
import FormularioListas from '../listas/FormularioListas'

const FloatingButtonEdit = ({ listaToEdit, onUpdate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isSidebarOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <>
      {/* Botón flotante para editar */}
      <button
        onClick={toggleSidebar}
        className="fixed bg-[#293e68] mt-3 top-2 right-16 text-white p-2 rounded-md shadow-lg z-50"
        title="Editar Lista"
      >
        <FaEdit size={18} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-500 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-blue-100 shadow-lg p-4 z-50 transform transition-transform duration-500 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Editar Lista</h3>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
            title="Cerrar"
          >
            ✖
          </button>
        </div>
        <FormularioListas
          listaToEdit={listaToEdit}
          onUpdate={(updatedLista) => {
            console.log('Lista actualizada:', updatedLista)
            onUpdate(updatedLista)
            toggleSidebar() // Cerrar el sidebar después de actualizar
          }}
        />
      </div>
    </>
  )
}

FloatingButtonEdit.propTypes = {
  listaToEdit: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
}

export default FloatingButtonEdit

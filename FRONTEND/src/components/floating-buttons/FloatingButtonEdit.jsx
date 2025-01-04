import { useState, useEffect, useContext } from "react"
import { FaEdit } from "react-icons/fa"
import PropTypes from "prop-types"
import FormularioListas from "../listas/FormularioListas"
import { AppContext } from "../../context/AppContext"
import { useToast } from "@chakra-ui/react"

const FloatingButtonEdit = ({ listaToEdit, onForceFetch }) => {
  const { updateList } = useContext(AppContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toast = useToast()

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isSidebarOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const handleUpdate = async (updatedLista) => {
    try {
      console.log("FloatingButtonEdit: Intentando actualizar la lista:", updatedLista)
      await updateList(updatedLista._id, updatedLista)
  
      if (onForceFetch) {
        await onForceFetch() // Sincronización global después de la actualización
      }
  
      toggleSidebar()
      toast({
        title: "Lista actualizada",
        description: "La lista se actualizó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error("FloatingButtonEdit: Error al actualizar lista:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la lista.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }
  
  

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed bg-[#293e68] mt-3 top-2 right-16 text-white p-2 rounded-md shadow-lg z-50"
        title="Editar Lista"
      >
        <FaEdit size={20} />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-blue-100 shadow-lg p-4 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <FormularioListas
          listaToEdit={listaToEdit}
          onUpdate={handleUpdate}
          onCreate={() => {}}
          toast={toast}
        />
      </div>
    </>
  )
}

FloatingButtonEdit.propTypes = {
  listaToEdit: PropTypes.object.isRequired,
  onForceFetch: PropTypes.func, // Ahora se espera como prop
}

export default FloatingButtonEdit

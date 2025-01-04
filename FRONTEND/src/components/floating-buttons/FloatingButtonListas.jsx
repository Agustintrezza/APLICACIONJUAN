import { useState, useEffect, useContext } from "react"
import { FaPlus } from "react-icons/fa"
import PropTypes from "prop-types"
import FormularioListas from "../listas/FormularioListas"
import { AppContext } from "../../context/AppContext"
import { useToast } from "@chakra-ui/react"

const FloatingButtonListas = () => {
  const { createList } = useContext(AppContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [creationStatus, setCreationStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isSidebarOpen])

  const toggleSidebar = () => {
    console.log("Sidebar toggled")
    setIsSidebarOpen((prev) => !prev)
    setCreationStatus(null) // Limpia el estado tras abrir/cerrar el sidebar
  }

  const handleCreate = async (newLista) => {
    if (isLoading) {
      console.log("Solicitud bloqueada porque isLoading es true en FloatingButtonListas")
      return
    }

    setIsLoading(true)
    console.log("Iniciando creación de lista en FloatingButtonListas con datos:", newLista)

    try {
      console.log("Llamando a createList con:", newLista)
      await createList(newLista)
      console.log("Lista creada con éxito en FloatingButtonListas")
      setCreationStatus({ type: "success", message: "Lista creada con éxito" })

      // Mostrar el toast de éxito
      toast({
        title: "Lista creada",
        description: "La lista se creó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      // Cierra el sidebar automáticamente
      setIsSidebarOpen(false)
    } catch (error) {
      console.error("Error al crear la lista en FloatingButtonListas:", error)
      setCreationStatus({ type: "error", message: error.message || "Error al crear la lista" })

      // Mostrar el toast de error
      toast({
        title: "Error al crear la lista",
        description: "Hubo un problema al intentar crear la lista.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
      console.log("Estado isLoading actualizado a false en FloatingButtonListas")
    }
  }

  return (
    <>
      <button
        disabled={isLoading}
        onClick={toggleSidebar}
        className={`fixed bg-[#293e68] mt-3 top-2 right-16 text-white p-2 rounded-md shadow-lg z-50 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Crear Lista"
      >
        <FaPlus size={18} />
      </button>

      {isSidebarOpen && (
        <div>
          {/* Fondo oscuro para cerrar */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-500"
            onClick={toggleSidebar}
          ></div>

          {/* Sidebar */}
          <div
            className={`fixed top-0 right-0 h-full w-72 bg-blue-100 shadow-lg p-4 z-50 transform transition-transform duration-500 ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Crear Lista</h3>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700"
                title="Cerrar"
              >
                ✖
              </button>
            </div>

            <FormularioListas onCreate={handleCreate} />
          </div>
        </div>
      )}
    </>
  )
}

FloatingButtonListas.propTypes = {
  onCreate: PropTypes.func,
}

export default FloatingButtonListas

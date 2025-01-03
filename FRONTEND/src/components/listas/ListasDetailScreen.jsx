import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { API_URL } from "../../config"
import ListaDetail from "../listas/ListasDetail"
import FormularioListas from "../listas/FormularioListas"
import LayoutDosContenedores from "../listas/LayoutDosContenedores"
import FloatingButtonEdit from "../floating-buttons/FloatingButtonEdit"
import { Spinner, Button } from "@chakra-ui/react"

const ListaDetailScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [lista, setLista] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchLista = async () => {
      try {
        const response = await fetch(`${API_URL}/api/listas/${id}`)
        if (!response.ok) throw new Error("Error al cargar la lista")
        const data = await response.json()
        setLista(data)
      } catch (error) {
        console.error("Error al cargar lista:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLista()
  }, [id])

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleBack = () => navigate(location.state?.from || "/listas")

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="xl" color="blue.500" />
      </div>
    )
  }

  if (!lista) {
    return (
      <div className="text-center">
        <p className="text-red-500 font-bold">No se encontró la lista</p>
        <Button colorScheme="blue" onClick={handleBack}>
          Volver a Listas
        </Button>
      </div>
    )
  }

  return (
    <>
      {isDesktop ? (
        <LayoutDosContenedores
          leftContent={<ListaDetail lista={lista} onBack={handleBack} />}
          rightContent={
            <FormularioListas
              listaToEdit={lista}
              onUpdate={(updatedLista) => setLista(updatedLista)}
              onCreate={() => {}}
            />
          }
        />
      ) : (
        <div className="relative">
          <ListaDetail lista={lista} onBack={handleBack} />
          <FloatingButtonEdit
  listaToEdit={lista} // Asegúrate de pasar la lista cargada
  onUpdate={(updatedLista) => {
    setLista(updatedLista) // Actualiza la lista en el estado
  }}
/>
          {isSidebarOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={toggleSidebar}
              ></div>

              {/* Sidebar */}
              <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-4 z-50 transform transition-transform duration-300 ${
                  isSidebarOpen ? "translate-x-0" : "translate-x-full"
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
                  listaToEdit={lista}
                  onUpdate={(updatedLista) => {
                    setLista(updatedLista)
                    toggleSidebar()
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ListaDetailScreen

import { useState, useEffect } from "react"
import Listas from "../components/listas/Listas"
import ListaDetail from "../components/listas/ListasDetail"
import FormularioListas from "../components/listas/FormularioListas"
import FloatingButtonListas from "../components/floating-buttons/FloatingButtonListas"
import { API_URL } from "../config"

const ListasContainerScreen = () => {
  const [listas, setListas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLista, setSelectedLista] = useState(null)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const fetchListas = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/listas`)
      if (!response.ok) throw new Error("Error al cargar las listas")
      const data = await response.json()
      setListas(data)
    } catch (error) {
      console.error("Error al cargar listas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchListas()
  }, [])

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const handleCreate = async () => {
    await fetchListas()
    toggleSidebar() // Cierra el sidebar al crear una nueva lista
  }

  const handleUpdate = async () => {
    await fetchListas()
    toggleSidebar() // Cierra el sidebar al actualizar una lista
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/listas/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar la lista")

      await fetchListas()

      if (selectedLista && selectedLista._id === id) {
        setSelectedLista(null)
      }
    } catch (error) {
      console.error("Error al eliminar lista:", error)
    }
  }

  const handleSelectLista = (lista) => {
    setSelectedLista(lista)
    if (!isDesktop) toggleSidebar() // Abre el sidebar en responsive
  }

  const handleBackToList = () => {
    setSelectedLista(null)
    fetchListas()
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">Listas</h2>
      </div>

      {isDesktop ? (
        // Vista para Desktop
        <div className="flex space-x-2">
          <div className="w-4/5">
            {selectedLista ? (
              <ListaDetail lista={selectedLista} onBack={handleBackToList} />
            ) : (
              <Listas
                listas={listas}
                onEdit={handleSelectLista}
                onDelete={handleDelete}
                isLoading={isLoading}
                onSelectLista={handleSelectLista}
              />
            )}
          </div>
          <div className="w-2/5">
            <FormularioListas
              onCreate={handleCreate}
              listaToEdit={selectedLista || null}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      ) : (
        // Vista para Responsive
        <div className="relative">
          <FloatingButtonListas onToggle={toggleSidebar} />
          {isSidebarOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={toggleSidebar}
              ></div>

              {/* Sidebar */}
              <div
                className={`fixed top-0 right-0 h-full w-72 bg-blue-300 shadow-lg p-4 z-50 transform transition-transform duration-300 ${
                  isSidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="flex justify-between items-center mb-4 flowbite-sidebar bg-blue-300">
                  <h3 className="text-lg font-semibold text-gray-800">Crear/Editar Lista</h3>
                  <button
                    onClick={toggleSidebar}
                    className="text-gray-500 hover:text-gray-700"
                    title="Cerrar"
                  >
                    ✖
                  </button>
                </div>
                <FormularioListas
                  onCreate={handleCreate}
                  listaToEdit={selectedLista || null}
                  onUpdate={handleUpdate}
                />
              </div>
            </>
          )}

          {/* Listas siempre visibles en responsive */}
          <Listas
            listas={listas}
            onEdit={handleSelectLista}
            onDelete={handleDelete}
            isLoading={isLoading}
            onSelectLista={handleSelectLista}
          />
        </div>
      )}
    </div>
  )
}

export default ListasContainerScreen

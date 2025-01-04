import { useEffect, useContext, useState } from "react"
import Listas from "../components/listas/Listas"
import ListaDetail from "../components/listas/ListasDetail"
import FormularioListas from "../components/listas/FormularioListas"
import FloatingButtonListas from "../components/floating-buttons/FloatingButtonListas"
import { useToast } from "@chakra-ui/react"
import { AppContext } from "../context/AppContext"

const ListasContainerScreen = () => {
  const { listas, loadLists, updateList, createList } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLista, setSelectedLista] = useState(null)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await loadLists() // Cargar las listas al montar el componente
      } catch (error) {
        console.error("Error al cargar listas desde el contexto:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [loadLists])

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const handleUpdate = async (updatedLista) => {
    try {
      console.log("ListasContainerScreen: Actualizando lista con datos:", updatedLista)
      await updateList(updatedLista._id, updatedLista)
      console.log("ListasContainerScreen: Lista actualizada correctamente.")
      toast({
        title: "Lista actualizada",
        description: "La lista se actualizó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error("ListasContainerScreen: Error al actualizar lista:", error)
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mt-1">Listas</h2>
      {isDesktop ? (
        <div className="flex space-x-2">
          <div className="w-4/5">
            {selectedLista ? (
              <ListaDetail lista={selectedLista} onBack={() => setSelectedLista(null)} />
            ) : (
              <Listas listas={listas} isLoading={isLoading} onEdit={setSelectedLista} />
            )}
          </div>
          <div className="w-2/5">
            <FormularioListas
              listaToEdit={selectedLista}
              onUpdate={handleUpdate}
              toast={toast}
              onCreate={createList}
            />
          </div>
        </div>
      ) : (
        <div className="relative">
          <FloatingButtonListas onToggle={toggleSidebar} />
          {isSidebarOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={toggleSidebar}
              ></div>
              <div
                className={`fixed top-0 right-0 h-full w-72 bg-blue-300 shadow-lg p-4 z-50 transform transition-transform duration-300 ${
                  isSidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <FormularioListas onCreate={() => {}} onUpdate={handleUpdate} />
              </div>
            </>
          )}
          <Listas listas={listas} isLoading={isLoading} />
        </div>
      )}
    </div>
  )
}

export default ListasContainerScreen

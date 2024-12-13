import { useState, useEffect } from "react"
import Listas from "../components/listas/Listas"
import ListaDetail from "../components/listas/ListasDetail"
import FormularioListas from "../components/listas/FormularioListas"
import { API_URL } from "../config"

const ListasContainerScreen = () => {
  const [listas, setListas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLista, setSelectedLista] = useState(null)

  useEffect(() => {
    const fetchListas = async () => {
      try {
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

    fetchListas()
  }, [])

  const handleCreate = (newLista) => {
    setListas((prev) => [...prev, newLista])
  }

  const handleUpdate = (updatedLista) => {
    setListas((prev) =>
      prev.map((lista) => (lista._id === updatedLista._id ? updatedLista : lista))
    )
    setSelectedLista(updatedLista) // Mantener seleccionado
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/listas/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar la lista")
      setListas((prev) => prev.filter((lista) => lista._id !== id))
      setSelectedLista(null)
    } catch (error) {
      console.error("Error al eliminar lista:", error)
    }
  }

  const handleSelectLista = (lista) => {
    setSelectedLista(lista)
  }

  const handleBackToList = () => {
    setSelectedLista(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">Listas</h2>
      </div>
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
            listaToEdit={selectedLista || null} // Pasar null cuando no hay lista seleccionada
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  )
}

export default ListasContainerScreen

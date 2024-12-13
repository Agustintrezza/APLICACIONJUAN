import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { API_URL } from "../../config"
import ListaDetail from "../listas/ListasDetail"
import FormularioListas from "../listas/FormularioListas"
import LayoutDosContenedores from "../listas/LayoutDosContenedores"
import { Spinner, Button } from "@chakra-ui/react"

const ListaDetailScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [lista, setLista] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const handleBack = () => {
    const fallbackRoute = "/listas"
    navigate(location.state?.from || fallbackRoute)
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
        <Button colorScheme="blue" onClick={() => navigate("/listas")}>
          Volver a Listas
        </Button>
      </div>
    )
  }

  return (
    <LayoutDosContenedores
      leftContent={
        <ListaDetail lista={lista} onBack={handleBack} />
        
      }
      rightContent={
        <FormularioListas
          listaToEdit={lista}
          onUpdate={(updatedLista) => setLista(updatedLista)}
          onCreate={() => {}}
        />
      }
    />
  )
}

export default ListaDetailScreen

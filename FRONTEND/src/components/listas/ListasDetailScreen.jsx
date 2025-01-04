import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { API_URL } from "../../config"
import ListaDetail from "../listas/ListasDetail"
import FormularioListas from "../listas/FormularioListas"
import LayoutDosContenedores from "../listas/LayoutDosContenedores"
import FloatingButtonEdit from "../floating-buttons/FloatingButtonEdit"
import { Spinner, Button, useToast } from "@chakra-ui/react"

const ListaDetailScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [lista, setLista] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const toast = useToast()
  const [isFetching, setIsFetching] = useState(false)

  const fetchLista = async () => {
    if (isFetching) return
    setIsFetching(true)
    console.log("ListaDetailScreen: Iniciando fetchLista. ID:", id)
    try {
      const response = await fetch(`${API_URL}/api/listas/${id}`)
      if (!response.ok) throw new Error("Error al cargar la lista")
      const data = await response.json()
      console.log("ListaDetailScreen: Lista cargada desde el backend:", data)
      setLista(data)
    } catch (error) {
      console.error("ListaDetailScreen: Error al cargar lista:", error)
    } finally {
      setIsFetching(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("ListaDetailScreen: useEffect ejecutado para fetchLista. ID:", id)
    fetchLista()
  }, [id])

  useEffect(() => {
    const handleResize = () => {
      console.log("ListaDetailScreen: Cambio de tamaño detectado. isDesktop:", window.innerWidth >= 1026)
      setIsDesktop(window.innerWidth >= 1026)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleBack = () => {
    console.log("ListaDetailScreen: Navegando hacia atrás.")
    navigate(location.state?.from || "/listas")
  }

  const handleUpdate = async (updatedLista) => {
    console.log("ListaDetailScreen: Intentando actualizar la lista:", updatedLista)
    try {
      const response = await fetch(`${API_URL}/api/listas/${updatedLista._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLista),
      })
      if (!response.ok) throw new Error("Error al actualizar la lista")

      const updatedData = await response.json()
      console.log("ListaDetailScreen: Datos actualizados recibidos:", updatedData)

      setLista(updatedData)
      console.log("ListaDetailScreen: Estado 'lista' actualizado:", updatedData)

      toast({
        title: "Lista actualizada",
        description: "La lista se actualizó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error("ListaDetailScreen: Error al actualizar la lista:", error)
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la lista.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const onForceFetch = async () => {
    console.log("ListaDetailScreen: Ejecutando onForceFetch para recargar datos.")
    await fetchLista()
  }

  if (isLoading) {
    console.log("ListaDetailScreen: Cargando estado inicial.")
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="xl" color="blue.500" />
      </div>
    )
  }

  if (!lista) {
    console.log("ListaDetailScreen: No se encontró la lista.")
    return (
      <div className="text-center">
        <p className="text-red-500 font-bold">No se encontró la lista</p>
        <Button colorScheme="blue" onClick={handleBack}>
          Volver a Listas
        </Button>
      </div>
    )
  }

  console.log("ListaDetailScreen: Renderizando contenido con lista:", lista)

  return (
    <>
      {isDesktop ? (
        <LayoutDosContenedores
          leftContent={<ListaDetail lista={lista} onBack={handleBack} onForceFetch={onForceFetch} />}
          rightContent={
            <FormularioListas
              listaToEdit={lista}
              onUpdate={handleUpdate}
              toast={toast}
            />
          }
        />
      ) : (
        <div className="relative">
          <ListaDetail lista={lista} onBack={handleBack} onForceFetch={onForceFetch} />
          <FloatingButtonEdit
  listaToEdit={lista}
  onUpdate={handleUpdate}
  onForceFetch={onForceFetch} // Pasa esta función explícitamente
/>
        </div>
      )}
    </>
  )
}

export default ListaDetailScreen
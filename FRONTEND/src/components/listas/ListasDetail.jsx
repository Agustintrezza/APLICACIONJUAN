import PropTypes from "prop-types"
import {
  Button,
  // useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import { FaArrowLeft, FaTrash } from "react-icons/fa"
import { useState, useEffect } from "react"
import { API_URL } from "../../config"

const ListaDetail = ({ lista, onBack, onForceFetch }) => {
  const [localLista, setLocalLista] = useState({ ...lista })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  // const toast = useToast()

  useEffect(() => {
    if (JSON.stringify(lista) !== JSON.stringify(localLista)) {
      setLocalLista({ ...lista }) // Sincroniza correctamente el estado local con las props
    }
  }, [lista])
  
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      console.log(`Eliminando lista con ID: ${localLista._id}`)
      const response = await fetch(`${API_URL}/api/listas/${localLista._id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Error al eliminar la lista")
      console.log("Lista eliminada correctamente.")
      onBack()
      await onForceFetch() // Refresca datos globales tras eliminar
    } catch (error) {
      console.error("Error al eliminar lista:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  console.log("ListaDetail: Renderizando con lista:", localLista)

  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-[#293e68]">{localLista.cliente}</h3>
        <div className="flex gap-4">
          <Button
            leftIcon={<FaArrowLeft />}
            onClick={() => {
              console.log("ListaDetail: Botón 'Volver' presionado.")
              onBack()
            }}
            bg="#293e68"
            color="white"
            _hover={{ bg: "#1f2d4b" }}
            fontSize={15}
          >
            Volver
          </Button>
          <Button
            leftIcon={<FaTrash />}
            onClick={() => setIsDialogOpen(true)}
            bg="red.500"
            color="white"
            _hover={{ bg: "red.600" }}
            fontSize={15}
          >
            Eliminar Lista
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-600">Color:</span>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: localLista.color,
              borderRadius: "50%",
            }}
          ></div>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Comentario:</span>
          <p className="text-md text-gray-800">{localLista.comentario || "Sin comentario"}</p>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Fecha de creación:</span>
          <p className="text-md text-gray-800">
            {new Date(localLista.fechaDeCreacion).toLocaleDateString()}
          </p>
        </div>
      </div>

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={() => {}}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar eliminación
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar esta lista? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isDeleting}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  )
}

ListaDetail.propTypes = {
  lista: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    cliente: PropTypes.string.isRequired,
    comentario: PropTypes.string,
    color: PropTypes.string,
    fechaDeCreacion: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onForceFetch: PropTypes.func.isRequired,
}

export default ListaDetail
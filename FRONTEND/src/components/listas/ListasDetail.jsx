import PropTypes from "prop-types"
import { Button, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react"
import { FaArrowLeft, FaTrash } from "react-icons/fa"
import { useState, useRef } from "react"

const ListaDetail = ({ lista, onBack }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelRef = useRef()
  const toast = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/listas/${lista._id}`, { method: "DELETE" })

      if (!response.ok) {
        throw new Error("Error al eliminar la lista")
      }

      toast({
        title: "Éxito",
        description: "La lista se eliminó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      })

      onBack() // Regresar a la página anterior
    } catch {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la lista.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      })
    } finally {
      setIsDeleting(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-[#293e68]">{lista.cliente}</h3>
        <div className="flex gap-4">
          <Button
            leftIcon={<FaArrowLeft />}
            onClick={onBack}
            bg="#293e68"
            color="white"
            _hover={{ bg: "#1f2d4b" }}
          >
            Volver
          </Button>
          <Button
            leftIcon={<FaTrash />}
            onClick={() => setIsDialogOpen(true)}
            bg="red.500"
            color="white"
            _hover={{ bg: "red.600" }}
          >
            Eliminar Lista
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Color de la lista */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-600">Color:</span>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: lista.color,
              borderRadius: "50%",
            }}
          ></div>
        </div>

        {/* Otros detalles */}
        <div>
          <span className="text-sm font-semibold text-gray-600">Posición:</span>
          <p className="text-md text-gray-800">{lista.posicion || "Sin posición"}</p>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Comentario:</span>
          <p className="text-md text-gray-800">{lista.comentario || "Sin comentario"}</p>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Fecha de creación:</span>
          <p className="text-md text-gray-800">
            {new Date(lista.fechaDeCreacion).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Fecha límite:</span>
          <p className="text-md text-gray-800">
            {lista.fechaLimite
              ? new Date(lista.fechaLimite).toLocaleDateString()
              : "Sin fecha límite"}
          </p>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Curriculums asociados:</span>
          {lista.curriculums.length > 0 ? (
            <ul className="list-disc pl-4">
              {lista.curriculums.map((cv) => (
                <li key={cv._id} className="text-gray-800">
                  <a
                    href={`/ver-cv/${cv._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {cv.nombre} {cv.apellido} ({cv.email})
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-md text-gray-800">No hay curriculums asociados</p>
          )}
        </div>
      </div>

      {/* Diálogo de confirmación */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
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
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
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
    posicion: PropTypes.string,
    comentario: PropTypes.string,
    color: PropTypes.string,
    fechaDeCreacion: PropTypes.string.isRequired,
    fechaLimite: PropTypes.string,
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        apellido: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onBack: PropTypes.func.isRequired,
}

export default ListaDetail

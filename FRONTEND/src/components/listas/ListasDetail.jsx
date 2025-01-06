import PropTypes from "prop-types"
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import { FaArrowLeft, FaTrash } from "react-icons/fa"
import Skeleton from "react-loading-skeleton"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "react-loading-skeleton/dist/skeleton.css"
import { API_URL } from "../../config"

const ListaDetail = ({ lista, onBack, onForceFetch }) => {
  const [localLista, setLocalLista] = useState({ ...lista })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setLocalLista({ ...lista }) // Sincroniza correctamente el estado local con las props
    setIsLoading(false)
  }, [lista])

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`${API_URL}/api/listas/${localLista._id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar la lista")
      onBack()
      await onForceFetch()
    } catch (error) {
      console.error("Error al eliminar lista:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-start md:justify-between gap-3 mb-4">
        <h3 className="text-2xl font-bold text-[#293e68]">
          {isLoading ? <Skeleton width={200} /> : localLista.cliente}
        </h3>
        <div className="flex gap-4">
          {isDesktop ? (
            <>
              <Button
                leftIcon={<FaArrowLeft />}
                onClick={onBack}
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
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onBack}
                className="p-2 bg-blue-500 text-white rounded-full"
                title="Volver"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="p-2 bg-red-500 text-white rounded-full"
                title="Eliminar"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detalles de la lista */}
      <div className="space-y-4">
        {/* Color */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-600">Color:</span>
          {isLoading ? (
            <Skeleton circle={true} height={20} width={20} />
          ) : (
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: localLista.color,
                borderRadius: "50%",
              }}
            ></div>
          )}
        </div>

        {/* Comentario */}
        <div>
          <span className="text-sm font-semibold text-gray-600">Comentario:</span>
          <p className="text-md text-gray-800">
            {isLoading ? <Skeleton width={300} /> : localLista.comentario || "Sin comentario"}
          </p>
        </div>

        {/* Fecha de creación */}
        <div>
          <span className="text-sm font-semibold text-gray-600">Fecha de creación:</span>
          <p className="text-md text-gray-800">
            {isLoading ? (
              <Skeleton width={150} />
            ) : (
              new Date(localLista.fechaDeCreacion).toLocaleDateString()
            )}
          </p>
        </div>

        {/* Currículums asociados */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700">Currículums asociados:</h4>
          {isLoading ? (
            <Skeleton count={3} />
          ) : localLista.curriculums && localLista.curriculums.length > 0 ? (
            <ul className="list-disc pl-5">
              {localLista.curriculums.map((curriculum) => (
                <li key={curriculum._id} className="text-blue-500 underline">
                  <Link to={`/ver-cv/${curriculum._id}`}>{`${curriculum.nombre} ${curriculum.apellido}`}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay currículums asociados a esta lista.</p>
          )}
        </div>
      </div>

      {/* Diálogo de Confirmación */}
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
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        apellido: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onForceFetch: PropTypes.func.isRequired,
}

export default ListaDetail

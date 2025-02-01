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
import { FaArrowLeft, FaTrash, FaWhatsapp } from "react-icons/fa"
import Skeleton from "react-loading-skeleton"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "react-loading-skeleton/dist/skeleton.css"
import { API_URL } from "../../config"
import { useToast } from "@chakra-ui/react"

const ListaDetail = ({ lista, onBack, onForceFetch }) => {
  const [localLista, setLocalLista] = useState({ ...lista })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

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
      
      toast({
        title: "Éxito",
        description: "La lista fue eliminada correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-center",
      })
      
      onBack()
      await onForceFetch()
    } catch (error) {
      console.error("Error al eliminar lista:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la lista.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-center",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const formatWhatsappMessage = () => {
    if (!localLista) return "";
  
    let message = `*Lista: ${localLista.cliente}*\n\n`;
    
    if (localLista.curriculums && localLista.curriculums.length > 0) {
      message += "*Postulantes:*\n";
      localLista.curriculums.forEach((curriculum, index) => {
        message += `${index + 1}. ${curriculum.nombre} ${curriculum.apellido}\n`;
      });
    } else {
      message += "❌ No hay postulantes en esta lista.";
    }
  
    return encodeURIComponent(message); // 🔥 Codificar para URL
  };

  const handleWhatsappShare = () => {
    const message = formatWhatsappMessage();
    if (!message) return;
  
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };
  
  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-lg">
      {/* Encabezado */}
      <div className="flex items-start justify-start md:justify-between gap-3 mb-4">
        <h3 className="text-2xl font-bold text-[#293e68] max-w-[150px] break-words">
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
                rightIcon={<FaTrash />}
                onClick={() => setIsDialogOpen(true)}
                bg="red.500"
                color="white"
                _hover={{ bg: "red.600" }}
                fontSize={15}
              >
                Eliminar Lista
              </Button>
              <Button
                colorScheme="green"
                onClick={handleWhatsappShare}
                className="flex justify-center items-center"
                rightIcon={<FaWhatsapp className="w-6 h-6 m-0" />} // Si usas FontAwesome, sino usa otro icono
              >
                Compartir
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onBack}
                className="p-2 bg-blue-500 text-white rounded-full"
                title="Volver"
              >
                <FaArrowLeft size={18} />
              </button>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="p-2 bg-red-500 text-white rounded-full"
                title="Eliminar"
              >
                <FaTrash size={18}/>
              </button>
              <Button
  colorScheme="green"
  onClick={handleWhatsappShare}
  className="flex justify-center items-center p-3 rounded-full"
>
  <FaWhatsapp className="w-6 h-6 flex-shrink-0" />
</Button>
            </div>
          )}
        </div>
      </div>

      {/* Detalles de la lista */}
      <div className="space-y-4">
        {/* Color */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-600"></span>
          {isLoading ? (
            <Skeleton circle={true} height={40} width={40} />
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

       {/* Rubro, Subrubro y Puesto de la Lista */}
{/* Rubro, Subrubro y Puesto de la Lista */}
<div className="flex flex-col items-start gap-x-4 text-md text-gray-800">
  {(localLista.rubro || localLista.subrubro || localLista.puesto) ? (
    <div className="flex flex-wrap items-center gap-3">
      {localLista.rubro && (
        <>
          <span className="text-sm font-semibold text-gray-600">Rubro:</span>
          <p className="font-bold text-gray-600">{localLista.rubro}</p>
        </>
      )}

      {localLista.subrubro && (
        <>
          <span className="text-sm font-semibold text-gray-600">Subrubro:</span>
          <p className="font-bold text-gray-600">{localLista.subrubro}</p>
        </>
      )}

      {localLista.puesto && (
        <>
          <span className="text-sm font-semibold text-gray-600">Puesto:</span>
          <p className="font-bold text-gray-600">{localLista.puesto}</p>
        </>
      )}
    </div>
  ) : (
    <p className="text-gray-600 italic text-sm">La lista no tiene asignado un rubro.</p>
  )}

  {/* 🔹 Comentario ahora está separado y siempre se mostrará si existe */}
  {localLista.comentario ? (
    <div className="flex flex-wrap items-center gap-3 mt-2">
      <span className="text-sm font-semibold text-gray-600">Comentario:</span>
      <p className="font-bold text-gray-600">{localLista.comentario}</p>
    </div>
  ) : (
    <p className="text-gray-600 italic text-sm">La lista no tiene asignado un comentario.</p>
  )}
</div>



        {/* Currículums asociados */}
        <div>
  <h4 className="text-lg font-semibold text-gray-700">Currículums asociados:</h4>
  {isLoading ? (
    <Skeleton count={3} />
  ) : localLista.curriculums && localLista.curriculums.length > 0 ? (
    <ul className="list-none pl-0">
  {localLista.curriculums.map((curriculum) => (
    <li key={curriculum._id} className="text-gray-800 flex flex-wrap items-center gap-x-2">
      <Link to={`/ver-cv/${curriculum._id}`} className="font-semibold text-blue-500 hover:underline">
        {`${curriculum.nombre} ${curriculum.apellido}`}
      </Link>
      {curriculum.rubro && <span className="text-sm font-semibold text-gray-600 italic">- {curriculum.rubro}</span>}
      {curriculum.subrubro && <span className="text-sm font-semibold text-gray-600 italic">- {curriculum.subrubro}</span>}
      {curriculum.puesto && <span className="text-sm font-semibold text-gray-600 italic">- {curriculum.puesto}</span>}
    </li>
  ))}
</ul>
  ) : (
    <p className="text-gray-600 italic">No hay currículums asociados a esta lista.</p>
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
    rubro: PropTypes.string.isRequired,
    subrubro: PropTypes.string,
    puesto: PropTypes.string.isRequired,
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        apellido: PropTypes.string.isRequired,
        rubro: PropTypes.string.isRequired,
        subrubro: PropTypes.string,
        puesto: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onForceFetch: PropTypes.func.isRequired,
}


export default ListaDetail

  import { useState, useEffect, useRef } from "react"
  import { useNavigate } from "react-router-dom"
  import PropTypes from "prop-types"
  import Skeleton from "react-loading-skeleton"
  import "react-loading-skeleton/dist/skeleton.css"
  import { FaArrowLeft, FaShareAlt } from "react-icons/fa"
  import {
    Button,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Tag,
    TagLabel,
  } from "@chakra-ui/react"

  const CvDetail = ({ cv }) => {
    const [isDataLoading, setIsDataLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdatingNoLlamar, setIsUpdatingNoLlamar] = useState(false)
    const [isNoLlamarDialogOpen, setIsNoLlamarDialogOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const cancelRef = useRef()
    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsDataLoading(false)
      }, 1500)

      return () => clearTimeout(timer)
    }, [cv])

    const toggleNoLlamar = async () => {
      setIsUpdatingNoLlamar(true)
      try {
        const response = await fetch(`/api/curriculums/${cv._id}/no-llamar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noLlamar: !cv.noLlamar }),
        })
  
        if (!response.ok) {
          throw new Error('Error al actualizar el estado de No Llamar')
        }
  
        const updatedCv = await response.json()
        toast({
          title: 'Éxito',
          description: `El CV ahora está marcado como ${updatedCv.noLlamar ? 'No Llamar' : 'Disponible para llamar'}.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        })
  
        navigate(0) // Recargar la página para reflejar cambios
      } catch {
        toast({
          title: 'Error',
          description: 'Hubo un problema al actualizar el estado de No Llamar.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        })
      } finally {
        setIsUpdatingNoLlamar(false)
        setIsNoLlamarDialogOpen(false)
      }
    }

    const getValueOrDefault = (value) =>
      value !== undefined && value !== null && value !== "" ? value : "-"

    const isImage = (url) => /\.(jpg|jpeg|png)$/i.test(url)
    const isPDF = (url) => /\.pdf$/i.test(url)

    const getPDFThumbnail = (url) => {
      if (isPDF(url)) {
        const parts = url.split("/upload/")
        return `${parts[0]}/upload/w_150,h_150,c_fit/${parts[1].replace(".pdf", ".jpg")}`
      }
      return null
    }

    const onBack = () => {
      navigate("/curriculums") // Navega a la ruta '/curriculums'
    }

    const handleDeleteCv = async () => {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/curriculums/${cv._id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Error al eliminar el CV")
        }

        toast({
          title: "Éxito",
          description: "El CV se eliminó correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        })

        navigate("/")
      } catch {
        toast({
          title: "Error",
          description: "Hubo un problema al eliminar el CV.",
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

    const handleListTagClick = (listId) => {
      navigate(`/listas/${listId}`, { state: { from: `/ver-cv/${cv._id}` } })
    }

    const formatWhatsappMessage = () => {
          const message = `
      🚀 *Curriculum Vitae* 🚀
      ${getValueOrDefault(cv.nombre) }
      ${getValueOrDefault(cv.apellido) }
      ${getValueOrDefault(cv.imagen)}
          `
          return encodeURIComponent(message.trim())
        }

        const handleWhatsappShare = () => {
          const message = formatWhatsappMessage()
          const whatsappUrl = `https://wa.me/1132368312?text=${message}`
          window.open(whatsappUrl, "_blank")
        }

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-300 w-5/5">
        {/* Encabezado con título y botones */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#293e68]">
            {isDataLoading ? (
              <Skeleton width={200} />
            ) : (
              `${getValueOrDefault(cv.nombre)} ${getValueOrDefault(cv.apellido)}`
            )}
          </h2>
          <div className="flex gap-4">
            {isDataLoading ? (
              <>
                <Skeleton width={100} height={40} />
                <Skeleton width={100} height={40} />
                <Skeleton width={100} height={40} /> {/* Esqueleto para el botón Volver */}
                <Skeleton width={100} height={40} /> {/* Esqueleto para el botón Whatsapp */}
                <Skeleton width={100} height={40} /> {/* Esqueleto para el botón Whatsapp */}
              </>
            ) : (
              <>
                <Button
                  leftIcon={<FaArrowLeft />}
                  onClick={onBack}
                  bg="#293e68"
                  color="white"
                  _hover={{ bg: "#1f2d4b" }}
                  className="px-4 py-2 text-sm rounded-lg shadow hover:bg-[#1f2d4b]"
                >
                  Volver
                </Button>
                <button
                  className="px-4 py-2 bg-[#293e68] text-white text-sm rounded-lg shadow hover:bg-[#1f2d4b]"
                  onClick={() => navigate(`/editar-cv/${cv._id}`)}
                >
                  Editar
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg shadow hover:bg-red-600"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Eliminar
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg shadow hover:bg-green-600 flex items-center gap-2"
                  onClick={handleWhatsappShare}
                >
                  <FaShareAlt />
                  WhatsApp
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg shadow hover:bg-red-600 flex items-center gap-2"
                  onClick={() => setIsNoLlamarDialogOpen(true)}
                >
                  {cv.noLlamar ? 'Quitar No Llamar' : 'Marcar No Llamar'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Diálogo de confirmación para No Llamar */}
      <AlertDialog
        isOpen={isNoLlamarDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsNoLlamarDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {cv.noLlamar ? 'Quitar No Llamar' : 'Marcar No Llamar'}
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro que deseas {cv.noLlamar ? 'quitar' : 'marcar'} este CV como {cv.noLlamar ? '`No' : '`No'} Llamar´?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsNoLlamarDialogOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={toggleNoLlamar} ml={3} isLoading={isUpdatingNoLlamar}>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

        {/* Información de listas asignadas */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#293e68] mb-2">Listas Asignadas</h3>
          {isDataLoading ? (
            <Skeleton count={3} height={30} className="mb-2" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {cv.listas.length > 0 ? (
                cv.listas.map((list) => (
                  <Tag
                    size="lg"
                    key={list._id}
                    bg={list.color}
                    color="white"
                    borderRadius="full"
                    className="flex items-center cursor-pointer"
                    onClick={() => handleListTagClick(list._id)}
                  >
                    <TagLabel>{list.cliente || "Sin nombre"}</TagLabel>
                  </Tag>
                ))
              ) : (
                <p className="text-sm text-gray-600">No asignado a ninguna lista.</p>
              )}
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            {isDataLoading ? (
              <Skeleton count={7} height={20} className="mb-2" />
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  <strong>Edad:</strong> {getValueOrDefault(cv.edad)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Género:</strong> {getValueOrDefault(cv.genero)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Teléfono Fijo:</strong> {getValueOrDefault(cv.telefonoFijo)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Celular:</strong> {getValueOrDefault(cv.celular)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {getValueOrDefault(cv.email)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>País:</strong> {getValueOrDefault(cv.pais)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Provincia:</strong> {getValueOrDefault(cv.provincia)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Rubro:</strong> {getValueOrDefault(cv.rubro)}
                </p>
                {cv.rubro === "Gastronomía" && cv.subrubro && (
                  <p className="text-sm text-gray-600">
                    <strong>Subrubro:</strong> {getValueOrDefault(cv.subrubro)}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <strong>Puesto:</strong> {getValueOrDefault(cv.puesto)}
                </p>
              </>
            )}
          </div>

          <div>
            {isDataLoading ? (
              <Skeleton count={7} height={20} className="mb-2" />
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  <strong>Localidad:</strong> {getValueOrDefault(cv.localidad)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Zona:</strong> {getValueOrDefault(cv.zona)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Calificación:</strong> {getValueOrDefault(cv.calificacion)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Nivel de Estudios:</strong> {getValueOrDefault(cv.nivelEstudios)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Experiencia:</strong> {getValueOrDefault(cv.experiencia)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Idiomas:</strong>{" "}
                  {getValueOrDefault(cv.idiomas.filter((i) => i).join(", "))}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Comentarios:</strong> {getValueOrDefault(cv.comentarios)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Renderización del archivo */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-[#293e68] mb-4">Archivo</h3>
          {isDataLoading ? (
            <Skeleton height={240} width={240} borderRadius="8px" />
          ) : (
            <>
              {isImage(cv.imagen) && (
                <div className="w-3/12">
                  <a href={cv.imagen} target="_blank" rel="noopener noreferrer">
                    <img
                      src={cv.imagen}
                      alt="Archivo del CV"
                      className="w-80 h-60 object-center rounded-md shadow-md transition-transform transform hover:scale-105 cursor-pointer"
                    />
                  </a>
                </div>
              )}
              {isPDF(cv.imagen) && (
                <a href={cv.imagen} target="_blank" rel="noopener noreferrer">
                  <img
                    src={getPDFThumbnail(cv.imagen)}
                    alt="Archivo PDF del CV"
                    className="w-60 h-60 object-cover rounded-md shadow-md transition-transform transform hover:scale-105 cursor-pointer"
                  />
                </a>
              )}
            </>
          )}
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
                ¿Estás seguro de que deseas eliminar este CV? Esta acción no se puede deshacer.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteCv}
                  ml={3}
                  isLoading={isDeleting}
                >
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    )
  }

  CvDetail.propTypes = {
    cv: PropTypes.object.isRequired,
  }

  export default CvDetail

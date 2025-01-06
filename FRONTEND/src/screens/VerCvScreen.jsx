import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../config'
import CvDetail from '../components/cvs/CvDetail'
import Asignaciones from '../components/cvs/Asignaciones'
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button } from '@chakra-ui/react'

const VerCvScreen = () => {
  const { id } = useParams() // El ID del CV
  const [cv, setCv] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const cancelRef = useState(null)

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const response = await fetch(`${API_URL}/api/curriculums/${id}`)
        if (!response.ok) throw new Error('No se pudo cargar el CV')
        const data = await response.json()
        setCv(data)
      } catch (error) {
        console.error('Error al obtener el CV:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCv()
  }, [id])

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleUpdateCvLists = (updatedLists) => {
    setCv((prevCv) => ({
      ...prevCv,
      listas: updatedLists,
    }))
  }

  const handleToggleNoLlamar = async () => {
    if (!cv) return
    const updatedNoLlamar = !cv.noLlamar

    try {
      const response = await fetch(`${API_URL}/api/curriculums/${cv._id}/no-llamar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noLlamar: updatedNoLlamar }),
      })

      if (!response.ok) throw new Error('Error al actualizar el estado de No Llamar')

      setCv((prevCv) => ({
        ...prevCv,
        noLlamar: updatedNoLlamar,
      }))
    } catch (error) {
      console.error('Error al actualizar el estado de No Llamar:', error)
    } finally {
      setIsDialogOpen(false) // Cierra el diálogo
    }
  }

  return (
    <div className="w-full mx-auto space-y-4 relative">
      <div className="flex flex-row space-x-4">
        <div className={`${isDesktop ? 'w-4/5' : 'w-full'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#293e68] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <CvDetail cv={cv} onToggleNoLlamar={() => setIsDialogOpen(true)} />
          )}
        </div>
        {isDesktop && cv && (
          <Asignaciones
            curriculumId={cv._id}
            onUpdateCvLists={handleUpdateCvLists}
          />
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
              {cv?.noLlamar ? "Quitar No Llamar" : "Marcar No Llamar"}
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de que deseas {cv?.noLlamar ? "quitar" : "marcar"} este CV como {cv?.noLlamar ? "`No Llamar`" : "`No Llamar`"}?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleToggleNoLlamar} ml={3}>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  )
}

export default VerCvScreen

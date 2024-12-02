import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../config'
import CvDetail from '../components/cvs/CvDetail'
import Asignaciones from '../components/cvs/Asignaciones'
// import { FaArrowLeft } from 'react-icons/fa'

const VerCvScreen = () => {
  const { id } = useParams() // El ID del CV
  // const navigate = useNavigate()
  const [cv, setCv] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const response = await fetch(`${API_URL}/api/curriculums/${id}`)
        if (!response.ok) throw new Error('No se pudo cargar el CV')
        const data = await response.json()
        setCv(data)
      } catch (error) {
        console.error('Error:', error)
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

  // Función para actualizar las listas en tiempo real
  const handleUpdateCvLists = (updatedLists) => {
    setCv((prevCv) => ({
      ...prevCv,
      listas: updatedLists,
    }))
  }

  return (
    <div className="w-full mx-auto space-y-4 relative">
      {/* <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="text-[#293e68] hover:text-blue-600 text-xl"
          title="Volver a Home"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Curriculum</h2>
      </div> */}

      <div className="flex flex-row space-x-4">
        <div className={`${isDesktop ? 'w-4/5' : 'w-full'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#293e68] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <CvDetail cv={cv} />
          )}
        </div>
        {isDesktop && cv && (
          <Asignaciones
            curriculumId={cv._id}
            onUpdateCvLists={handleUpdateCvLists} // Pasamos la función
          />
        )}
      </div>
    </div>
  )
}

export default VerCvScreen

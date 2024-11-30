import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaHeart } from 'react-icons/fa'
import { MdEdit, MdDelete } from 'react-icons/md'
import SelectFilters from '../selectfilters/SelectFilters'
import Categories from '../../components/categories/Categories'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { API_URL } from '../../config'

const removeAccents = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const limitText = (text, limit) => (text.length > limit ? `${text.slice(0, limit)}...` : text)

const TableMain = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    genero: '',
    edad: '',
    pais: '',
    provincia: '',
    localidad: '',
    idioma: '',
    calificacion: '',
    nivelEducacion: '',
    experienciaAnios: '',
  })
  const [cvData, setCvData] = useState([])
  const [isLoading, setIsLoading] = useState(true) // Skeleton control
  const [favoriteIds, setFavoriteIds] = useState([])
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/curriculums`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const data = await response.json()
        setCvData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false) // Skeleton stops when data is loaded or an error occurs
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleFavorite = (id) => {
    setFavoriteIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((favId) => favId !== id) : [...prevIds, id]
    )
  }

  const handleResetSearch = () => setSearchTerm('')
  const handleResetFilters = () => {
    setFilters({
      genero: '',
      edad: '',
      pais: '',
      provincia: '',
      localidad: '',
      idioma: '',
      calificacion: '',
      nivelEducacion: '',
      experienciaAnios: '',
    })
  }

  const hasCategoryFilters = Object.values(filters).some((value) => value !== '')

  const filteredData = cvData
    .filter((user) =>
      removeAccents(`${user.nombre} ${user.apellido}`)
        .toLowerCase()
        .includes(removeAccents(searchTerm.toLowerCase()))
    )
    .filter((user) => {
      return (
        (filters.genero === '' || user.genero === filters.genero) &&
        (filters.edad === '' || parseInt(user.edad, 10) >= parseInt(filters.edad, 10)) &&
        (filters.pais === '' || user.pais === filters.pais) &&
        (filters.provincia === '' || user.provincia === filters.provincia) &&
        (filters.localidad === '' || user.localidad === filters.localidad) &&
        (filters.idioma === '' || user.idiomas.includes(filters.idioma)) &&
        (filters.calificacion === '' || user.calificacion === filters.calificacion) &&
        (filters.nivelEducacion === '' || user.nivelEstudios === filters.nivelEducacion) &&
        (filters.experienciaAnios === '' || user.experiencia === filters.experienciaAnios)
      )
    })

  return (
    <div className="w-full mx-auto space-y-4 relative">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Curriculums ({filteredData.length})
          </h2>
          {isDesktop ? (
            <Link
              to="/crear-cv"
              className="flex items-center bg-[#293e68] text-white px-4 py-2 rounded-lg hover:bg-blue-800 shadow-lg"
            >
              <FaPlus className="mr-2" /> Ingresar CV
            </Link>
          ) : (
            <Link
              to="/crear-cv"
              className="fixed bottom-6 right-6 bg-[#293e68] text-white p-4 rounded-full shadow-lg hover:bg-blue-800 z-50"
              title="Ingresar CV"
            >
              <FaPlus />
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-row space-x-4">
        <div className={`${isDesktop ? 'w-4/5' : 'w-full'}`}>
          {isDesktop && (
            <SelectFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleResetSearch={handleResetSearch}
              filters={filters}
              setFilters={setFilters}
              handleResetFilters={handleResetFilters}
              hasSearchTerm={searchTerm.trim() !== ''}
              hasCategoryFilters={hasCategoryFilters}
            />
          )}

          {isLoading ? (
            <div className="grid gap-4 mt-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 18 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 p-4"
                >
                  <Skeleton height={20} width="80%" className="mb-2" />
                  <Skeleton height={15} width="60%" />
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton height={30} width="30%" />
                    <Skeleton circle={true} height={30} width={30} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 mt-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 relative"
                  >
                    <Link to={`/ver-cv/${user._id}`} className="block">
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-[#293e68]">
                          {user.nombre} {user.apellido}, {user.edad}
                        </h3>
                        <p className="text-sm text-gray-600">{limitText(user.comentarios, 70)}</p>
                      </div>
                    </Link>
                    <div className="flex justify-between items-center bg-gray-100 px-4 py-2">
                      <div className="flex gap-2">
                        <button className="text-[#293e68] hover:text-blue-600">
                          <MdEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <MdDelete />
                        </button>
                      </div>
                      <button
                        onClick={() => toggleFavorite(user._id)}
                        className={`${
                          favoriteIds.includes(user._id)
                            ? 'text-red-500'
                            : 'text-gray-500'
                        } hover:text-red-600`}
                      >
                        <FaHeart />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  No se encontraron resultados.
                </div>
              )}
            </div>
          )}
        </div>

        {isDesktop && <Categories filters={filters} setFilters={setFilters} />}
      </div>
    </div>
  )
}

export default TableMain

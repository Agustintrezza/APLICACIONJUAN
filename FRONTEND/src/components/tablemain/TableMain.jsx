import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaTimes } from 'react-icons/fa'
import SelectFilters from '../selectfilters/SelectFilters'
import Categories from '../../components/categories/Categories'
import FloatingButtonCategories from '../floating-buttons/FloatingButtonCategories'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { API_URL } from '../../config'

const removeAccents = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '')

const TableMain = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    genero: '',
    edad: '',
    pais: '',
    provincia: '',
    zona: '',
    localidad: '',
    idioma: '',
    calificacion: '',
    nivelEducacion: '',
    experienciaAnios: '',
    lista: '',
  })
  const [cvData, setCvData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1400) // Verifica si es una pantalla grande (>1400px)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(isLargeScreen ? 12 : isDesktop ? 9 : 8) // Ajustar el número de items por página

  useEffect(() => {
    const fetchData = async () => {
      const sanitizedFilters = Object.fromEntries(
        Object.entries(filters).filter(([value]) => value !== '')
      )
      const query = new URLSearchParams(sanitizedFilters).toString()

      try {
        const response = await fetch(`${API_URL}/api/curriculums?${query}`)
        if (!response.ok) throw new Error('Error al obtener currículums')
        const data = await response.json()
        console.log('Datos filtrados de la API:', data);
        
        // Ordena los datos por fecha (creación) antes de almacenarlos
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCvData(sortedData);
      } catch (error) {
        console.error('Error al cargar currículums:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1026)
      setIsLargeScreen(width >= 1400) // Verifica si la pantalla es mayor a 1400px

      if (width >= 1400) {
        setItemsPerPage(12) // 12 items para pantallas grandes
      } else if (width >= 1026) {
        setItemsPerPage(9) // 9 items para pantallas de escritorio
      } else {
        setItemsPerPage(8) // 8 items para pantallas móviles
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleResetSearch = () => setSearchTerm('')
  const handleResetFilters = () => {
    setFilters({
      genero: '',
      edad: '',
      pais: '',
      provincia: '',
      zona: '',
      localidad: '',
      idioma: '',
      calificacion: '',
      nivelEducacion: '',
      experienciaAnios: '',
      lista: '',
    })
  }

  const hasCategoryFilters = Object.values(filters).some((value) => value !== '')

  // Filtrado de los datos en función del searchTerm y los filtros aplicados
  const filteredData = cvData.filter((user) => {
    console.log("Filtros actuales:", filters); // Log de los filtros aplicados
    return (
      // Filtro por búsqueda de nombre o apellido
      removeAccents(`${user.nombre} ${user.apellido}`).toLowerCase().includes(removeAccents(searchTerm.toLowerCase())) &&
      // Filtro por zona
      (!filters.zona || user.zona === filters.zona) &&
      // Filtro por provincia
      (!filters.provincia || user.provincia === filters.provincia) &&
      // Filtro por país
      (!filters.pais || user.pais === filters.pais) &&
      // Agregar más filtros según sea necesario (nivelEducacion, experienciaAnios, etc.)
      (!filters.nivelEducacion || user.nivelEstudios === filters.nivelEducacion) &&
      (!filters.experienciaAnios || user.experiencia === filters.experienciaAnios)
    );
  });

  const handleToggleCategories = () => {
    setIsCategoriesOpen((prev) => !prev)
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
              <FaPlus className="mr-2" /> Ingresar Curriculum
            </Link>
          ) : (
            <Link
              to="/crear-cv"
              className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-800 z-50"
              title="Ingresar Curriculum"
            >
              <FaPlus size={22}/>
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
            <div className={`grid gap-2 mt-4 ${isDesktop ? 'md:grid-cols-3 grid-cols-3' : 'grid-cols-2'}`}>
              {Array.from({ length: isDesktop ? 9 : 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 p-4"
                >
                  <Skeleton height={20} width="80%" className="mb-2" /> {/* Nombre */}
                  <Skeleton height={15} width="40%" className="mb-2" /> {/* Edad */}
                  <Skeleton height={15} width="60%" className="mb-2" /> {/* Listas */}
                  <Skeleton height={20} width="30%" className="mt-2" /> {/* No llamar */}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-2 mt-4 container-custom-agus">
              <div className="container-interno-agus">
                {currentData.length > 0 ? (
                  currentData.map((user) => (
                    <div key={user._id}>
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 card-custom-agus">
                        <Link to={`/ver-cv/${user._id}`} className="block">
                        <div className="py-2 px-2"> 
  <p className="text-md font-bold line-height-custom text-[#293e68]">
    {user.nombre} {user.apellido}
  </p>
  <p className="text-sm mb-1 font-bold text-[#293e68]">
    {user.edad && `${user.edad} años`}
  </p>
  
  {/* Mostrar rubro, subrubro y puesto siempre que existan */}
  <p className="text-sm font-bold fuente-custom-rubro-card text-[#293e68]">
  {user.rubro ? (
    user.rubro === 'Gastronomía' 
      ? `${user.rubro} ${user.puesto?`/ ${user.puesto} /` : ''}${user.subrubro}`
      : `${user.rubro} / ${user.puesto}`
  ) : '-'}
</p>

  <ul className="text-sm text-gray-800 list-inside list-disc">
  {user.listas?.length > 3 ? (
    <li>Asociado a más de 4 listas</li>
  ) : (
    user.listas?.map((lista) => (
      <li key={lista._id} className="flex fuente-custom-lista-card items-center space-x-2">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ backgroundColor: lista.color || '#cccccc' }}
        ></span>
        <span>{lista.cliente}</span>
      </li>
    ))
  )}
</ul>

  
  {user.noLlamar && (
    <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mt-2">
      No Llamar
    </span>
  )}
</div>

                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    No se encontraron resultados.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <nav>
              <ul className="flex space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`px-4 py-2 rounded-lg border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {isDesktop && <Categories filters={filters} setFilters={setFilters} />}
      </div>

      {!isDesktop && (
        <>
          <FloatingButtonCategories onToggle={handleToggleCategories} />
          {isCategoriesOpen && (
            <div className="fixed inset-0 clase bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-blue-50 rounded-lg px-4 py-4 w-11/12 h-5/6 overflow-auto">
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
                <Categories filters={filters} setFilters={setFilters} />
                <button
                  onClick={handleToggleCategories}
                  className="absolute top-8 mt-2 right-4 bg-red-600 text-white p-2 rounded-lg shadow-lg z-50"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TableMain;

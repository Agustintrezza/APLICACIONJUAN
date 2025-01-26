import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaTimes } from 'react-icons/fa'
import SelectFilters from '../selectfilters/SelectFilters'
import Categories from '../../components/categories/Categories'
import FloatingButtonCategories from '../floating-buttons/FloatingButtonCategories'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { API_URL } from '../../config'

// const removeAccents = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '')

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
    rubro: '',
    subrubro: '',
    puesto: '',
    noLlamar: '',
  })
  const [cvData, setCvData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1400)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(isLargeScreen ? 12 : isDesktop ? 9 : 8)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const query = new URLSearchParams({
          ...filters,
          searchTerm,  // <-- Asegúrate de incluir esto
          page: currentPage,
          limit: itemsPerPage
        }).toString()
  
        console.log("🔍 Consulta enviada a la API:", query) // DEBUG
  
        const response = await fetch(`${API_URL}/api/curriculums?${query}`)
        if (!response.ok) throw new Error('Error al obtener currículums')
  
        const result = await response.json()
        console.log(`📌 Respuesta de la API (Página ${currentPage}):`, result)
  
        if (!result || typeof result !== 'object' || !Array.isArray(result.data)) {
          console.error('⚠️ Respuesta inesperada de la API:', result)
          setCvData([])
          setTotalPages(1)
          setTotalRecords(0)
          return
        }
  
        setCvData(result.data)
        setTotalPages(result.totalPages || 1)
        setTotalRecords(result.totalRecords || 0)
  
        if (result.data.length === 0 && currentPage > 1) {
          console.warn(`⚠️ Página vacía (${currentPage}), retrocediendo a la anterior...`)
          setCurrentPage(prev => Math.max(1, prev - 1))
        }
      } catch (error) {
        console.error('❌ Error al cargar currículums:', error)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchData()
  }, [filters, searchTerm, currentPage, itemsPerPage]) // 🔹 Agrega `searchTerm` como dependencia
  

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1) // ✅ Solo resetea si la página actual es inválida
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1026)
      setIsLargeScreen(width >= 1400)

      if (width >= 1400) {
        setItemsPerPage(12)
      } else if (width >= 1026) {
        setItemsPerPage(9)
      } else {
        setItemsPerPage(8)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleResetSearch = () => {
    setSearchTerm("") // ✅ Limpia el estado
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchTerm: undefined // ✅ Asegura que se elimine de la consulta
    }))
    setCurrentPage(1)
  }
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
      rubro: '',
      subrubro: '',
      puesto: '',
      noLlamar: '',
    })
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      console.log("Cambiando a página:", newPage) // ✅ Depuración
      setCurrentPage(newPage)
    }
  }

  const hasCategoryFilters = Object.values(filters).some((value) => value !== '')
  
  // const filteredData = Array.isArray(cvData)
  //   ? cvData.filter((user) =>
  //       removeAccents(`${user.nombre} ${user.apellido}`)
  //         .toLowerCase()
  //         .includes(removeAccents(searchTerm.toLowerCase())) &&
  //       (!filters.rubro || user.rubro === filters.rubro) &&
  //       (!filters.puesto || user.puesto === filters.puesto) &&
  //       (!filters.subrubro || user.subrubro === filters.subrubro) &&
  //       (!filters.noLlamar || (filters.noLlamar === 'true' ? user.noLlamar : !user.noLlamar)) &&
  //       (!filters.zona || user.zona === filters.zona) &&
  //       (!filters.provincia || user.provincia === filters.provincia) &&
  //       (!filters.pais || user.pais === filters.pais) &&
  //       (!filters.nivelEducacion || user.nivelEstudios === filters.nivelEducacion) &&
  //       (!filters.experienciaAnios || user.experiencia === filters.experienciaAnios)
  //     )
  //   : []

  const handleToggleCategories = () => {
    setIsCategoriesOpen((prev) => !prev)
  }

  const currentData = cvData

  const truncateText = (text, maxLength) => {
    if (!text) return '' // Manejo seguro si el texto es undefined o null
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="w-full mx-auto space-y-4 relative">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800">
              Curriculums ({totalRecords})
            </h2>
            {(Object.values(filters).some(value => value !== '')) && (
              <p className="text-md font-bold text-red-500">* Tienes filtros activos</p>
            )}
          </div>

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
              <FaPlus size={22} />
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
                  <Skeleton height={isDesktop ? 20 : 10} width="80%" className="mb-2" />
                  <Skeleton height={isDesktop ? 15 : 10} width="40%" className="mb-2" />
                  <Skeleton height={isDesktop ? 15 : 10} width="60%" className="mb-2" />
                  <Skeleton height={isDesktop ? 20 : 10} width="30%" className="mt-2" />
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
                            <p className="edad-custom mb-1 font-bold text-[#293e68]">
                              {user.edad && `${user.edad} años`}
                            </p>

                            <p className="text-sm font-bold fuente-custom-rubro-card text-[#293e68]">
                              {user.rubro ? (
                                user.rubro === 'Gastronomía'
                                  ? `${user.rubro} ${user.puesto ? `/ ${user.puesto} /` : ''}${user.subrubro}`
                                  : `${user.rubro} / ${user.puesto}`
                              ) : '-'}
                            </p>

                            <ul className="text-sm text-gray-800 list-inside list-disc">
                              {user.listas?.length > 2 ? (
                                <li>Asociado a más de 2 listas</li>
                              ) : user.listas?.length > 0 ? (
                                user.listas.map((lista) => (
                                  <li key={lista._id} className="flex fuente-custom-lista-card items-center space-x-2">
                                    <span
                                      className="inline-block w-3 h-3 rounded-full"
                                      style={{ backgroundColor: lista.color || '#cccccc' }}
                                    ></span>
                                    <span title={lista.cliente}>
                                      {truncateText(lista.cliente, 20)}
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500 italic">Aún no asociado a ninguna lista</li>
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
                  <div className="col-span-full text-center text-gray-500">No se encontraron resultados.</div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4 paginacion-custom">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border bg-white text-blue-500"
            >
              Anterior
            </button>

            <span className="px-4 py-2">{currentPage} de {totalPages}</span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 rounded-lg border bg-white text-blue-500"
            >
              Siguiente
            </button>
          </div>
        </div>

        {isDesktop && <Categories filters={filters} setFilters={setFilters} />}
      </div>

      {!isDesktop && (
        <>
          <FloatingButtonCategories onToggle={handleToggleCategories} />
          {isCategoriesOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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

export default TableMain


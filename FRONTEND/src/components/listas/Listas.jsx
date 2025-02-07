import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import { Skeleton } from "@chakra-ui/react"

const Listas = ({ listas, isLoading }) => {
  const navigate = useNavigate()

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth >= 1026 ? 9 : 6)

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1026 ? 9 : 6)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Calcular índices para la paginación
  const totalPages = Math.ceil(listas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentListas = listas.slice(startIndex, endIndex)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-lg">
            <Skeleton height="30px" width="70%" className="mb-4" />
            <Skeleton height="19px" width="90%" className="mb-2" />
            <Skeleton height="19px" width="50%" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-transparent rounded-lg px-2">
      {/* Contenedor fijo para listas */}
      <div className="grid gap-2 mt container-listas-custom-agus">
        <div className="container-listas-interno-agus">
          {currentListas.length > 0 ? (
            currentListas.map((lista) => (
              <div
                key={lista._id}
                className="bg-white rounded-lg shadow-md p-2 flex flex-col items-start cursor-pointer hover:shadow-xl card-listas-custom-agus"
                onClick={() => navigate(`/listas/${lista._id}`)}
              >
                <div className="px-2">
                  {/* Cliente y color */}
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-md font-bold line-height-custom text-[#293e68]">
                      {lista.cliente}
                    </p>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        backgroundColor: lista.color || "#ccc",
                        borderRadius: "50%",
                      }}
                    ></div>
                  </div>

                  {/* Rubro y puesto */}
                  <p className="text-sm font-bold fuente-custom-rubro-card text-[#293e68]">
                    {lista.rubro ? (
                      lista.rubro === 'Gastronomía'
                        ? `${lista.rubro} ${lista.puesto ? `/ ${lista.puesto} /` : ''}${lista.subrubro}`
                        : `${lista.rubro} / ${lista.puesto}`
                    ) : '-'}
                  </p>

                  {/* Fecha de creación y postulantes */}
                  <ul className="text-sm text-[#293e68] list-inside list-disc">
                    <li>
                      <strong>Postulantes:</strong> {lista.curriculums.length}
                    </li>
                    <li>
                      <strong>Creado:</strong> {new Date(lista.fechaDeCreacion).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No se encontraron resultados.</div>
          )}
        </div>
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
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
      )}
    </div>
  )
}

Listas.propTypes = {
  listas: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      cliente: PropTypes.string.isRequired,
      rubro: PropTypes.string,
      puesto: PropTypes.string,
      subrubro: PropTypes.string,
      fechaDeCreacion: PropTypes.string.isRequired,
      color: PropTypes.string,
      curriculums: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default Listas

import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { Skeleton } from "@chakra-ui/react"

const Listas = ({ listas, isLoading }) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-lg">
            <Skeleton height="20px" width="70%" className="mb-4" />
            <Skeleton height="14px" width="90%" className="mb-2" />
            <Skeleton height="14px" width="50%" />
          </div>
        ))}
      </div>
    )
  }

  if (!listas.length) {
    return <p className="text-center text-gray-600">No hay listas creadas</p>
  }

  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {listas.map((lista) => (
          <div
            key={lista._id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-start cursor-pointer"
            onClick={() => navigate(`/listas/${lista._id}`)}
          >
            <div className="flex items-center space-x-2 mb-4">
              <h4 className="text-lg font-semibold text-[#293e68]">{lista.cliente}</h4>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: lista.color,
                  borderRadius: "50%",
                }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <p><strong>Rubro:</strong> {lista.rubro || "Sin rubro"}</p>
              <p><strong>Puesto:</strong> {lista.puesto || "Sin puesto"}</p>
              {lista.rubro === "Gastronomía" && (
                <p><strong>Subrubro:</strong> {lista.subrubro || "Sin subrubro"}</p>
              )}
              <p><strong>Fecha de creación:</strong> {new Date(lista.fechaDeCreacion).toLocaleDateString()}</p>
              <p><strong>Postulantes:</strong> {lista.curriculums.length}</p>
              <p><strong>Comentario:</strong> {lista.comentario || "Sin comentario"}</p>
            </div>
          </div>
        ))}
      </div>
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

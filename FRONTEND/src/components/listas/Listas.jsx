import PropTypes from "prop-types"
import { Skeleton } from "@chakra-ui/react"

const Listas = ({ listas, isLoading, onSelectLista }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
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
      <h3 className="text-lg font-bold text-[#293e68] mb-4">Listas</h3>
      <div className="grid grid-cols-2 gap-4">
        {listas.map((lista) => (
          <div
            key={lista._id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-start cursor-pointer"
            onClick={() => onSelectLista(lista)}
          >
            {/* Título de la lista */}
            <div className="flex items-center space-x-2 mb-4">
              <h4 className="text-md font-semibold text-[#293e68]">{lista.cliente}</h4>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: lista.color,
                  borderRadius: "50%",
                }}
              ></div>
            </div>

            {/* Detalles de la lista */}
            <div className="text-sm text-gray-600 mb-2">
              <p>
                <strong>Posición:</strong> {lista.posicion || "Sin posición"}
              </p>
              <p>
                <strong>Fecha de creación:</strong>{" "}
                {new Date(lista.fechaDeCreacion).toLocaleDateString()}
              </p>
              <p>
                <strong>Fecha límite:</strong>{" "}
                {lista.fechaLimite
                  ? new Date(lista.fechaLimite).toLocaleDateString()
                  : "Sin fecha límite"}
              </p>
              <p>
                <strong>Postulantes:</strong> {lista.curriculums.length}
              </p>
              <p>
                <strong>Comentario:</strong> {lista.comentario || "Sin comentario"}
              </p>
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
      posicion: PropTypes.string,
      comentario: PropTypes.string,
      color: PropTypes.string,
      fechaDeCreacion: PropTypes.string.isRequired,
      fechaLimite: PropTypes.string,
      curriculums: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelectLista: PropTypes.func.isRequired,
}

export default Listas

import PropTypes from "prop-types"
import { Button } from "@chakra-ui/react"
import { FaArrowLeft } from "react-icons/fa"

const ListaDetail = ({ lista, onBack }) => {
  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-[#293e68]">{lista.cliente}</h3>
        <Button
            leftIcon={<FaArrowLeft />}
            onClick={onBack}
            bg="#293e68"
            color="white"
            _hover={{ bg: "#1f2d4b" }}
            >
            Volver
            </Button>
      </div>

      <div className="space-y-4">
        {/* Color de la lista */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-600">Color:</span>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: lista.color,
              borderRadius: "50%",
            }}
          ></div>
        </div>

        {/* Posición */}
        <div>
          <span className="text-sm font-semibold text-gray-600">Posición:</span>
          <p className="text-md text-gray-800">{lista.posicion || "Sin posición"}</p>
        </div>

        {/* Comentario */}
        <div>
          <span className="text-sm font-semibold text-gray-600">Comentario:</span>
          <p className="text-md text-gray-800">{lista.comentario || "Sin comentario"}</p>
        </div>

        {/* Fecha de creación */}
        <div>
          <span className="text-sm font-semibold text-gray-600">Fecha de creación:</span>
          <p className="text-md text-gray-800">
            {new Date(lista.fechaDeCreacion).toLocaleDateString()}
          </p>
        </div>

        {/* Fecha límite */}
        <div>
          <span className="text-sm font-semibold text-gray-600">Fecha límite:</span>
          <p className="text-md text-gray-800">
            {lista.fechaLimite
              ? new Date(lista.fechaLimite).toLocaleDateString()
              : "Sin fecha límite"}
          </p>
        </div>

        {/* Curriculums asociados */}
        <div>
          <span className="text-sm font-semibold text-gray-600">Curriculums asociados:</span>
          {lista.curriculums.length > 0 ? (
            <ul className="list-disc pl-4">
              {lista.curriculums.map((cv) => (
                <li key={cv._id} className="text-gray-800">
                  <a
                    href={`/ver-cv/${cv._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {cv.nombre} {cv.apellido} ({cv.email})
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-md text-gray-800">No hay curriculums asociados</p>
          )}
        </div>
      </div>
    </div>
  )
}

ListaDetail.propTypes = {
  lista: PropTypes.shape({
    cliente: PropTypes.string.isRequired,
    posicion: PropTypes.string,
    comentario: PropTypes.string,
    color: PropTypes.string,
    fechaDeCreacion: PropTypes.string.isRequired,
    fechaLimite: PropTypes.string,
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        apellido: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onBack: PropTypes.func.isRequired,
}

export default ListaDetail

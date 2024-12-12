import PropTypes from "prop-types"
import { Skeleton, Button } from "@chakra-ui/react"

const Listas = ({ listas, onEdit, onDelete, isLoading, onSelectLista }) => {
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
            <p className="text-sm text-gray-600 mb-4">{lista.comentario}</p>
            <div className="flex space-x-2 w-full">
              <Button
                size="sm"
                bg="#293e68"
                color="white"
                _hover={{ bg: "#1f2d4b" }}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(lista)
                }}
              >
                Editar
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(lista._id)
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

Listas.propTypes = {
  listas: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelectLista: PropTypes.func.isRequired,
}

export default Listas

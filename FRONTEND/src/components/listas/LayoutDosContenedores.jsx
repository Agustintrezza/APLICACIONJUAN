import PropTypes from "prop-types"

const LayoutDosContenedores = ({ leftContent, rightContent }) => {
  return (
    <div className="flex space-x-2 ">
      {/* Contenedor izquierdo */}
      <div
        className="w-full md:w-4/6 bg-white border rounded-lg shadow-lg p-4 overflow-auto"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {leftContent}
      </div>
      
      {/* Contenedor derecho */}
      <div
        className="w-full md:w-1/3 bg-white border rounded-lg shadow-lg p-4 overflow-auto"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {rightContent}
      </div>
    </div>
  )
}

LayoutDosContenedores.propTypes = {
  leftContent: PropTypes.node.isRequired,
  rightContent: PropTypes.node.isRequired,
}

export default LayoutDosContenedores

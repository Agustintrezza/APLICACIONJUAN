import { useState } from 'react'
import PropTypes from 'prop-types'

const CvDetail = ({ cv }) => {
  const [isFileLoading, setIsFileLoading] = useState(true)

  if (!cv) {
    return (
      <div className="text-center text-gray-500">
        No se encontró información del CV seleccionado.
      </div>
    )
  }

  const getValueOrDefault = (value) => (value && value.length > 0 ? value : '-')

  const isImage = (url) => /\.(jpg|jpeg|png)$/i.test(url)
  const isPDF = (url) => /\.pdf$/i.test(url)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300">
      {/* Encabezado con título y botones */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold text-[#293e68]">
          {getValueOrDefault(cv.nombre)} {getValueOrDefault(cv.apellido)}
        </h2>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow hover:bg-blue-600"
            onClick={() => alert('Editar función en construcción')}
          >
            Editar
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg shadow hover:bg-red-600"
            onClick={() => alert('Eliminar función en construcción')}
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div>
          <p className="text-sm text-gray-600">
            <strong>Edad:</strong> {getValueOrDefault(cv.edad)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Género:</strong> {getValueOrDefault(cv.genero)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Teléfono Fijo:</strong> {getValueOrDefault(cv.telefonoFijo)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Celular:</strong> {getValueOrDefault(cv.celular)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {getValueOrDefault(cv.email)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>País:</strong> {getValueOrDefault(cv.pais)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Provincia:</strong> {getValueOrDefault(cv.provincia)}
          </p>
        </div>

        {/* Columna derecha */}
        <div>
          <p className="text-sm text-gray-600">
            <strong>Localidad:</strong> {getValueOrDefault(cv.localidad)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Zona:</strong> {getValueOrDefault(cv.zona)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Calificación:</strong> {getValueOrDefault(cv.calificacion)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Nivel de Estudios:</strong> {getValueOrDefault(cv.nivelEstudios)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Experiencia:</strong> {getValueOrDefault(cv.experiencia)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Idiomas:</strong> {getValueOrDefault(cv.idiomas.filter((i) => i).join(', '))}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Comentarios:</strong> {getValueOrDefault(cv.comentarios)}
          </p>
        </div>
      </div>

      {/* Renderización del archivo */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#293e68]">Archivo:</h3>
        {isFileLoading && (
          <div className="flex justify-center items-center h-48">
            <div className="w-12 h-12 border-4 border-[#293e68] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {isImage(cv.imagen) ? (
          <a href={cv.imagen} target="_blank" rel="noopener noreferrer">
            <img
              src={cv.imagen}
              alt="Archivo del CV"
              className="w-40 h-40 object-cover rounded-md shadow-md mt-2 transition-transform transform hover:scale-105 cursor-pointer"
              onLoad={() => setIsFileLoading(false)}
              onError={() => setIsFileLoading(false)}
            />
          </a>
        ) : isPDF(cv.imagen) ? (
            <>
           <div className='flex gap-4'>
          <iframe
            src={cv.imagen}
            className="w-6/12 iframe-cv border border-gray-300 rounded-md"
            title="Vista previa del PDF"
            onLoad={() => setIsFileLoading(false)}
            onError={() => setIsFileLoading(false)}
          />
           <div>
           <a
              href={cv.imagen}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow hover:bg-blue-600"
            >
              Abrir Archivo
            </a>
           </div>
           </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">Formato de archivo no compatible</p>
        )}
      </div>
    </div>
  )
}

CvDetail.propTypes = {
  cv: PropTypes.object.isRequired,
}

export default CvDetail

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const CvDetail = ({ cv }) => {
  const [isDataLoading, setIsDataLoading] = useState(true)

  useEffect(() => {
    // Simula un tiempo de carga para mostrar los skeletons
    const timer = setTimeout(() => {
      setIsDataLoading(false)
    }, 1500) // Simulación de 1.5 segundos de carga

    return () => clearTimeout(timer)
  }, [cv])

  const getValueOrDefault = (value) => (value && value.length > 0 ? value : '-')

  const isImage = (url) => /\.(jpg|jpeg|png)$/i.test(url)
  const isPDF = (url) => /\.pdf$/i.test(url)

  const getPDFThumbnail = (url) => {
    if (isPDF(url)) {
      const parts = url.split('/upload/')
      return `${parts[0]}/upload/w_150,h_150,c_fit/${parts[1].replace('.pdf', '.jpg')}`
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300">
      {/* Encabezado con título y botones */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold text-[#293e68]">
          {isDataLoading ? <Skeleton width={250} /> : `${getValueOrDefault(cv.nombre)} ${getValueOrDefault(cv.apellido)}`}
        </h2>
        <div className="flex gap-4">
          {isDataLoading ? (
            <>
              <Skeleton width={100} height={40} />
              <Skeleton width={100} height={40} />
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 bg-[#293e68] text-white text-sm rounded-lg shadow hover:bg-[#1f2d4b]"
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
            </>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          {isDataLoading ? (
            <Skeleton count={7} height={20} className="mb-2" />
          ) : (
            <>
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
            </>
          )}
        </div>

        <div>
          {isDataLoading ? (
            <Skeleton count={7} height={20} className="mb-2" />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Renderización del archivo */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#293e68] mb-4">Archivo</h3>
        {isDataLoading ? (
          <Skeleton height={160} width={160} borderRadius="8px" />
        ) : (
          <>
            {isImage(cv.imagen) ? (
              <a href={cv.imagen} target="_blank" rel="noopener noreferrer">
                <img
                  src={cv.imagen}
                  alt="Archivo del CV"
                  className="w-40 h-40 object-cover rounded-md shadow-md transition-transform transform hover:scale-105 cursor-pointer"
                />
              </a>
            ) : isPDF(cv.imagen) ? (
              <a href={cv.imagen} target="_blank" rel="noopener noreferrer">
                <img
                  src={getPDFThumbnail(cv.imagen)}
                  alt="Archivo PDF del CV"
                  className="w-40 h-40 object-cover rounded-md shadow-md transition-transform transform hover:scale-105 cursor-pointer"
                />
              </a>
            ) : (
              <p className="text-sm text-gray-600">Formato de archivo no compatible</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

CvDetail.propTypes = {
  cv: PropTypes.object.isRequired,
}

export default CvDetail

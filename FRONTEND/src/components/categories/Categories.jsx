import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { API_URL } from '../../config'

const ZONAS_LOCALIDADES = {
  "Zona Norte": [
    "San Isidro", "Vicente López", "San Martín", "San Fernando", "Tigre",
    "Escobar", "Pilar", "José C. Paz", "Malvinas Argentinas", "San Miguel",
  ],
  "Zona Sur": [
    "Almirante Brown", "Avellaneda", "Berazategui", "Esteban Echeverría",
    "Ezeiza", "Florencio Varela", "Lanús", "Lomas de Zamora", "Quilmes", "San Vicente",
  ],
  "Zona Oeste": [
    "La Matanza", "Tres de Febrero", "Hurlingham", "Morón", "Ituzaingó",
    "Merlo", "Moreno", "General Rodríguez", "Marcos Paz",
  ],
  CABA: [
    "Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo",
    "Caballito", "Chacarita", "Coghlan", "Colegiales", "Constitución",
    "Flores", "Floresta", "La Boca", "La Paternal", "Liniers", "Mataderos",
    "Monte Castro", "Monserrat", "Nueva Pompeya", "Núñez", "Palermo",
    "Parque Avellaneda", "Parque Chacabuco", "Parque Chas", "Parque Patricios",
    "Puerto Madero", "Recoleta", "Retiro", "Saavedra", "San Cristóbal",
    "San Nicolás", "San Telmo", "Vélez Sársfield", "Versalles", "Villa Crespo",
    "Villa del Parque", "Villa Devoto", "Villa General Mitre", "Villa Lugano",
    "Villa Luro", "Villa Ortúzar", "Villa Pueyrredón", "Villa Real",
    "Villa Riachuelo", "Villa Santa Rita", "Villa Soldati", "Villa Urquiza",
  ],
}

const PROVINCIAS_ARGENTINA = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa",
  "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
  "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Santiago del Estero", "Tierra del Fuego", "Tucumán", "CABA",
]

const Categories = ({ filters, setFilters }) => {
  const [listas, setListas] = useState([])

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/listas`)
        if (!response.ok) throw new Error('Error al obtener listas')
        const data = await response.json()
        setListas(data)
      } catch (error) {
        console.error('Error al obtener listas:', error)
      }
    }

    fetchListas()
  }, [])

  const handleFilterChange = (e, filterType) => {
    const value = e.target.value
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [filterType]: value }

      // Reiniciar valores dependientes
      if (filterType === 'pais') {
        newFilters.provincia = ''
        newFilters.localidad = ''
      } else if (filterType === 'provincia') {
        newFilters.localidad = ''
      }

      return newFilters
    })
  }

  return (
    <div
      className="w-2/5"
      style={{ position: 'sticky', top: '-16px', maxHeight: '100vh', overflowY: 'auto' }}
    >
      <div
        className="border border-blue-300 bg-[#e9f0ff] rounded-lg p-4 shadow-lg"
        style={{
          boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4 text-[#293e68]">Buscar Curriculums</h3>
        <div className="space-y-2">
          {/* Listas */}
          <div>
            <label htmlFor="listas" className="text-md text-[#293e68] mb-1">
              Lista
            </label>
            <select
              id="listas"
              value={filters.lista}
              onChange={(e) => handleFilterChange(e, 'lista')}
              className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
            >
              <option value="">Seleccionar</option>
              {listas.map((lista) => (
                <option key={lista._id} value={lista._id}>
                  {lista.cliente}
                </option>
              ))}
            </select>
          </div>

          {/* País */}
          <div className="space-y-2">
          {/* País */}
          <div>
            <label htmlFor="pais" className="text-md text-[#293e68] mb-1">País</label>
            <select
              id="pais"
              value={filters.pais}
              onChange={(e) => handleFilterChange(e, "pais")}
              className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
            >
              <option value="">Seleccionar</option>
              <option value="Argentina">Argentina</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="Chile">Chile</option>
              <option value="Brasil">Brasil</option>
              <option value="Perú">Perú</option>
            </select>
          </div>

          {/* Provincia */}
          {filters.pais === "Argentina" && (
            <div>
              <label htmlFor="provincia" className="text-md text-[#293e68] mb-1">Provincia</label>
              <select
                id="provincia"
                value={filters.provincia}
                onChange={(e) => handleFilterChange(e, "provincia")}
                className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
              >
                <option value="">Seleccionar</option>
                {PROVINCIAS_ARGENTINA.map(provincia => (
                  <option key={provincia} value={provincia}>{provincia}</option>
                ))}
              </select>
            </div>
          )}

          {/* Localidad */}
          {filters.pais === "Argentina" && filters.provincia === "Buenos Aires" && (
            <div>
              <label htmlFor="localidad" className="text-md text-[#293e68] mb-1">Localidad</label>
              <select
                id="localidad"
                value={filters.localidad}
                onChange={(e) => handleFilterChange(e, "localidad")}
                className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
              >
                <option value="">Seleccionar</option>
                {Object.entries(ZONAS_LOCALIDADES).flatMap(([zona, localidades]) =>
                  localidades.map(localidad => (
                    <option key={localidad} value={localidad}>{`${zona} - ${localidad}`}</option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>


          {/* Calificación */}
          <div>
            <label htmlFor="calificacion" className="text-md text-[#293e68] mb-1">Calificación</label>
            <select
              id="calificacion"
              value={filters.calificacion}
              onChange={(e) => handleFilterChange(e, "calificacion")}
              className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
            >
              <option value="">Seleccionar</option>
              <option value="1- Muy bueno">1- Muy bueno</option>
              <option value="2- Bueno">2- Bueno</option>
              <option value="3- Regular">3- Regular</option>
            </select>
          </div>

          {/* Nivel de Educación */}
          <div>
            <label htmlFor="nivelEducacion" className="text-md text-[#293e68] mb-1">Nivel de Educación</label>
            <select
              id="nivelEducacion"
              value={filters.nivelEducacion}
              onChange={(e) => handleFilterChange(e, "nivelEducacion")}
              className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
            >
              <option value="">Seleccionar</option>
              <option value="Primario">Primario</option>
              <option value="Secundario">Secundario</option>
              <option value="Terciario">Terciario</option>
              <option value="Universitario">Universitario</option>
            </select>
          </div>

          {/* Años de Experiencia */}
          <div>
            <label htmlFor="experienciaAnios" className="text-md text-[#293e68] mb-1">Años de Experiencia</label>
            <select
              id="experienciaAnios"
              value={filters.experienciaAnios}
              onChange={(e) => handleFilterChange(e, "experienciaAnios")}
              className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
            >
              <option value="">Seleccionar</option>
              <option value="Menos de un año">Menos de un año</option>
              <option value="Más de un año">Más de un año</option>
              <option value="Más de 3 años">Más de 3 años</option>
              <option value="Más de 5 años">Más de 5 años</option>
              <option value="Más de 10 años">Más de 10 años</option>
            </select>
          </div>

          {/* Género */}
          <div>
            <label htmlFor="genero" className="text-md text-[#293e68] mb-1">Género</label>
            <select
              id="genero"
              value={filters.genero}
              onChange={(e) => handleFilterChange(e, "genero")}
              className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          {/* Edad */}
          <div>
            <label htmlFor="edad" className="text-md text-[#293e68] mb-1">Edad</label>
            <select
              id="edad"
              value={filters.edad}
              onChange={(e) => handleFilterChange(e, "edad")}
              className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
            >
              <option value="">Seleccionar</option>
              <option value="18">Más de 18</option>
              <option value="30">Más de 30</option>
              <option value="40">Más de 40</option>
              <option value="50">Más de 50</option>
            </select>
          </div>      

          {/* Idiomas */}
          <div>
            <label htmlFor="idioma" className="text-md text-[#293e68] mb-1">Idioma</label>
            <select
              id="idioma"
              value={filters.idioma}
              onChange={(e) => handleFilterChange(e, "idioma")}
              className="form-select rounded bg-[#e9f0ff] p-2 text-base w-full border-[#8bb1ff] focus:border-[#293e68]"
            >
              <option value="">Seleccionar</option>
              <option value="Español">Español</option>
              <option value="Inglés">Inglés</option>
              <option value="Francés">Francés</option>
              <option value="Portugués">Portugués</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

Categories.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
}

export default Categories

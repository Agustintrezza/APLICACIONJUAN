import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { API_URL } from '../../config'

const ZONAS_LOCALIDADES = {
  "Zona Norte": ["San Isidro", "Vicente López", "San Martín", "San Fernando", "Tigre", "Escobar", "Pilar", "José C. Paz", "Malvinas Argentinas", "San Miguel"],
  "Zona Sur": ["Almirante Brown", "Avellaneda", "Berazategui", "Esteban Echeverría", "Ezeiza", "Florencio Varela", "Lanús", "Lomas de Zamora", "Quilmes", "San Vicente"],
  "Zona Oeste": ["La Matanza", "Tres de Febrero", "Hurlingham", "Morón", "Ituzaingó", "Merlo", "Moreno", "General Rodríguez", "Marcos Paz"],
  CABA: ["Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo", "Caballito", "Chacarita", "Coghlan", "Colegiales", "Constitución", "Flores", "Floresta", "La Boca", "La Paternal", "Liniers", "Mataderos", "Monte Castro", "Monserrat", "Nueva Pompeya", "Núñez", "Palermo", "Parque Avellaneda", "Parque Chacabuco", "Parque Chas", "Parque Patricios", "Puerto Madero", "Recoleta", "Retiro", "Saavedra", "San Cristóbal", "San Nicolás", "San Telmo", "Vélez Sársfield", "Versalles", "Villa Crespo", "Villa del Parque", "Villa Devoto", "Villa General Mitre", "Villa Lugano", "Villa Luro", "Villa Ortúzar", "Villa Pueyrredón", "Villa Real", "Villa Riachuelo", "Villa Santa Rita", "Villa Soldati", "Villa Urquiza"],
}

const PROVINCIAS_ARGENTINA = ["Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán", "CABA"]

const RUBROS = {
  "Gastronomía": ["Cocina", "Salón", "Barra"],
  "Industria": ["Metalúrgica", "IT/Programación", "Transporte", "Maquinarias"],
  "Comercio": ["Atención al público", "Encargado de local"],
  "Administración": ["Recursos Humanos", "Administrativo de Compras", "Administrativo de Ventas", "Marketing", "Contable", "Legales"],
}

const PUESTOS = {
  "Cocina": ["Chef", "Jefe de cocina", "Cocinero", "Pizzero", "Sushiman", "Pastelero", "Panadero"],
  "Salón": ["Jefe de sala", "Camarero", "Mozo", "Runner"],
  "Barra": ["Bartender", "Barista", "Cajero", "Encargado"],
}

const Categories = ({ filters, setFilters }) => {
  const [listas, setListas] = useState([])
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026)

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

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleFilterChange = (e, filterType) => {
    const value = e.target.value
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [filterType]: value === '' ? undefined : value }

      if (filterType === "rubro") {
        newFilters.puesto = ""
        newFilters.subrubro = ""
      } else if (filterType === "puesto") {
        newFilters.subrubro = ""
      }

      return newFilters
    })
  }

  return (
    <div className={`${isDesktop ? 'w-1.5/5' : 'w-full'} max-h-screen overflow-y-auto`} style={{ position: 'sticky', top: '-16px' }}>
      <div className="border border-blue-300 bg-[#e9f0ff] rounded-lg p-3 shadow-lg">
        <h3 className="text-lg font-semibold mb-2 text-[#293e68]">Buscar Curriculums</h3>
        <div className="space-y-2">

          {/* Lista */}
          <div>
            <label className="text-sm text-[#293e68] mb-1">Lista</label>
            <select value={filters.lista || ""} onChange={(e) => handleFilterChange(e, 'lista')}
              className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.lista ? 'border-red-400 border-2' : 'border-blue-400'}`}>
              <option value="">Seleccionar</option>
              {listas.map((lista) => <option key={lista._id} value={lista._id}>{lista.cliente}</option>)}
            </select>
          </div>

          {/* No Llamar */}
          <div>
            <label className="text-sm text-[#293e68] mb-1">No Llamar</label>
            <select value={filters.noLlamar || ""} onChange={(e) => handleFilterChange(e, "noLlamar")}
              className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.noLlamar ? 'border-red-400 border-2' : 'border-blue-400'}`}>
              <option value="">Seleccionar</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Rubro */}
          <div>
            <label className="text-sm text-[#293e68] mb-1">Rubro</label>
            <select value={filters.rubro || ""} onChange={(e) => handleFilterChange(e, 'rubro')}
              className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.rubro ? 'border-red-400 border-2' : 'border-blue-400'}`}>
              <option value="">Seleccionar</option>
              {Object.keys(RUBROS).map(rubro => <option key={rubro} value={rubro}>{rubro}</option>)}
            </select>
          </div>

          {/* Puesto */}
          {filters.rubro && (
            <div>
              <label className="text-sm text-[#293e68] mb-1">Puesto</label>
              <select value={filters.puesto || ""} onChange={(e) => handleFilterChange(e, 'puesto')}
                className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.puesto ? 'border-red-400 border-2' : 'border-blue-400'}`}>
                <option value="">Seleccionar</option>
                {RUBROS[filters.rubro].map(puesto => <option key={puesto} value={puesto}>{puesto}</option>)}
              </select>
            </div>
          )}
          {/* Subrubro */}
          {filters.puesto && PUESTOS[filters.puesto] && (
            <div>
              <label className="text-sm text-[#293e68] mb-1">Subrubro</label>
              <select value={filters.subrubro || ""} onChange={(e) => handleFilterChange(e, 'subrubro')}
                className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.subrubro ? 'border-red-400 border-2' : 'border-blue-400'}`}>
                <option value="">Seleccionar</option>
                {PUESTOS[filters.puesto].map(subrubro => <option key={subrubro} value={subrubro}>{subrubro}</option>)}
              </select>
            </div>
          )}

          {/* País */}
          <div>
            <label className="text-sm text-[#293e68] mb-1">País</label>
            <select value={filters.pais || ""} onChange={(e) => handleFilterChange(e, "pais")}
              className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.pais ? 'border-red-400 border-2' : 'border-blue-400'}`}>
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
              <label className="text-sm text-[#293e68] mb-1">Provincia</label>
              <select value={filters.provincia || ""} onChange={(e) => handleFilterChange(e, "provincia")}
                className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.provincia ? 'border-red-400 border-2' : 'border-blue-400'}`}>
                <option value="">Seleccionar</option>
                {PROVINCIAS_ARGENTINA.map(provincia => <option key={provincia} value={provincia}>{provincia}</option>)}
              </select>
            </div>
          )}

          {/* Zona */}
          {filters.provincia === "Buenos Aires" && (
            <div>
              <label className="text-sm text-[#293e68] mb-1">Zona</label>
              <select value={filters.zona || ""} onChange={(e) => handleFilterChange(e, "zona")}
                className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.zona ? 'border-red-400 border-2' : 'border-blue-400'}`}>
                <option value="">Seleccionar</option>
                {Object.keys(ZONAS_LOCALIDADES).map(zona => <option key={zona} value={zona}>{zona}</option>)}
              </select>
            </div>
          )}

          {/* Localidad */}
          {filters.zona && ZONAS_LOCALIDADES[filters.zona] && (
            <div>
              <label className="text-sm text-[#293e68] mb-1">Localidad</label>
              <select value={filters.localidad || ""} onChange={(e) => handleFilterChange(e, "localidad")}
                className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.localidad ? 'border-red-400 border-2' : 'border-blue-400'}`}>
                <option value="">Seleccionar</option>
                {ZONAS_LOCALIDADES[filters.zona].map(localidad => <option key={localidad} value={localidad}>{localidad}</option>)}
              </select>
            </div>
          )}

          {/* Calificación */}
          <div>
            <label className="text-sm text-[#293e68] mb-1">Calificación</label>
            <select value={filters.calificacion || ""} onChange={(e) => handleFilterChange(e, "calificacion")}
              className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.calificacion ? 'border-red-400 border-2' : 'border-blue-400'}`}>
              <option value="">Seleccionar</option>
              <option value="1- Muy bueno">1- Muy bueno</option>
              <option value="2- Bueno">2- Bueno</option>
              <option value="3- Regular">3- Regular</option>
            </select>
          </div>

          {/* Nivel de Educación */}
          <div>
            <label className="text-sm text-[#293e68] mb-1">Nivel de Educación</label>
            <select value={filters.nivelEducacion || ""} onChange={(e) => handleFilterChange(e, "nivelEducacion")}
              className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.nivelEducacion ? 'border-red-400 border-2' : 'border-blue-400'}`}>
              <option value="">Seleccionar</option>
              <option value="Primario">Primario</option>
              <option value="Secundario">Secundario</option>
              <option value="Terciario">Terciario</option>
              <option value="Universitario">Universitario</option>
            </select>
          </div>

          {/* Años de Experiencia */}
          <div>
            <label className="text-sm text-[#293e68] mb-1">Años de Experiencia</label>
            <select value={filters.experienciaAnios || ""} onChange={(e) => handleFilterChange(e, "experienciaAnios")}
              className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.experienciaAnios ? 'border-red-400 border-2' : 'border-blue-400'}`}>
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
            <label className="text-sm text-[#293e68] mb-1">Género</label>
            <select value={filters.genero || ""} onChange={(e) => handleFilterChange(e, "genero")}
              className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.genero ? 'border-red-400 border-2' : 'border-blue-400'}`}>
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          {/* Edad */}
          <div>
            <label className="text-sm text-[#293e68] mb-1">Edad</label>
            <select value={filters.edad || ""} onChange={(e) => handleFilterChange(e, "edad")}
              className={`form-select text-sm py-1 px-2 h-8 w-full border-1 rounded-md ${filters.edad ? 'border-red-400 border-2' : 'border-blue-400'}`}>
              <option value="">Seleccionar</option>
              <option value="18">Más de 18</option>
              <option value="30">Más de 30</option>
              <option value="40">Más de 40</option>
              <option value="50">Más de 50</option>
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

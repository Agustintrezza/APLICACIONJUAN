import PropTypes from 'prop-types';

const Categories = ({ filters, setFilters }) => {
  const handleFilterChange = (e, filterType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: e.target.value,
    }));
  };

  return (
    <div className="w-1/5" style={{ position: 'sticky', top: '-16px', maxHeight: '100vh', overflowY: 'auto' }}>
      <div 
        className="border border-blue-300 bg-[#e9f0ff] rounded-lg p-4 shadow-lg"
        style={{
          boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4 text-[#293e68]">Filtros</h3>
        <div className="space-y-4">
          {/* Calificación */}
          <div>
            <label htmlFor="calificacion" className="text-xs text-gray-600 block mb-1">Calificación</label>
            <select
              id="calificacion"
              value={filters.calificacion}
              onChange={(e) => handleFilterChange(e, "calificacion")}
              className="form-select rounded p-1 text-sm w-full"
            >
              <option value="">Seleccionar</option>
              <option value="1- Muy bueno">1- Muy bueno</option>
              <option value="2- Bueno">2- Bueno</option>
              <option value="3- Regular">3- Regular</option>
            </select>
          </div>

          {/* Nivel de Educación */}
          <div>
            <label htmlFor="nivelEducacion" className="text-xs text-gray-600 block mb-1">Nivel de Educación</label>
            <select
              id="nivelEducacion"
              value={filters.nivelEducacion}
              onChange={(e) => handleFilterChange(e, "nivelEducacion")}
              className="form-select rounded p-1 text-sm w-full"
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
            <label htmlFor="experienciaAnios" className="text-xs text-gray-600 block mb-1">Años de Experiencia</label>
            <select
              id="experienciaAnios"
              value={filters.experienciaAnios}
              onChange={(e) => handleFilterChange(e, "experienciaAnios")}
              className="form-select rounded p-1 text-sm w-full"
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
            <label htmlFor="genero" className="text-xs text-gray-600 block mb-1">Género</label>
            <select
              id="genero"
              value={filters.genero}
              onChange={(e) => handleFilterChange(e, "genero")}
              className="form-select rounded p-1 text-sm w-full"
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          {/* Edad */}
          <div>
            <label htmlFor="edad" className="text-xs text-gray-600 block mb-1">Edad</label>
            <select
              id="edad"
              value={filters.edad}
              onChange={(e) => handleFilterChange(e, "edad")}
              className="form-select rounded p-1 text-sm w-full"
            >
              <option value="">Seleccionar</option>
              <option value="18">Más de 18</option>
              <option value="30">Más de 30</option>
              <option value="40">Más de 40</option>
              <option value="50">Más de 50</option>
            </select>
          </div>

          {/* País */}
          <div>
            <label htmlFor="pais" className="text-xs text-gray-600 block mb-1">País</label>
            <select
              id="pais"
              value={filters.pais}
              onChange={(e) => handleFilterChange(e, "pais")}
              className="form-select rounded p-1 text-sm w-full"
            >
              <option value="">Seleccionar</option>
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="Brasil">Brasil</option>
              <option value="Perú">Perú</option>
            </select>
          </div>

          {/* Provincia */}
          <div>
            <label htmlFor="provincia" className="text-xs text-gray-600 block mb-1">Provincia</label>
            <select
              id="provincia"
              value={filters.provincia}
              onChange={(e) => handleFilterChange(e, "provincia")}
              className="form-select rounded p-1 text-sm w-full"
            >
              <option value="">Seleccionar</option>
              <option value="Buenos Aires">Buenos Aires</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Santa Fe">Santa Fe</option>
            </select>
          </div>

          {/* Localidad */}
          <div>
            <label htmlFor="localidad" className="text-xs text-gray-600 block mb-1">Localidad</label>
            <input
              id="localidad"
              value={filters.localidad}
              onChange={(e) => handleFilterChange(e, "localidad")}
              className="form-input rounded p-1 text-sm w-full border-gray-300"
              placeholder="Ingrese localidad"
            />
          </div>

          {/* Idioma */}
          <div>
            <label htmlFor="idioma" className="text-xs text-gray-600 block mb-1">Idioma</label>
            <select
              id="idioma"
              value={filters.idioma}
              onChange={(e) => handleFilterChange(e, "idioma")}
              className="form-select rounded p-1 text-sm w-full"
            >
              <option value="">Seleccionar</option>
              <option value="Español">Español</option>
              <option value="Inglés">Inglés</option>
              <option value="Francés">Francés</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

Categories.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default Categories;

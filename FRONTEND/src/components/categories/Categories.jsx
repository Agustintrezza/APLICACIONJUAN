// src/components/categories/Categories.jsx
import PropTypes from 'prop-types';
import InfoButtons from '../infobuttons/InfoButtons';

const Categories = ({ selectedCategories, setSelectedCategories, isSidebarExpanded, filters, setFilters }) => {
  const categoriesList = [
    "Chef Ejecutivo",
    "Cocina Internacional",
    "Repostero",
    "Pastelería Fina",
    "Decoración de Tortas",
    "Cocina Molecular",
    "Gourmet",
  ];

  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.categories.includes(category)
      ? selectedCategories.categories.filter((cat) => cat !== category)
      : [...selectedCategories.categories, category];

    const updatedCategories = { ...selectedCategories, categories: newCategories };
    setSelectedCategories(updatedCategories);
  };

  const handleFilterChange = (e, filterType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: e.target.value,
    }));
  };

  const isActive = (filterValue) => filterValue !== "";

  return (
    <div className={`${isSidebarExpanded ? 'w-1/5' : 'w-1/5'}`} style={{ position: 'sticky', top: '-16px', maxHeight: '100vh', overflowY: 'auto' }}>
      <div 
        className="border border-blue-300 bg-[#e9f0ff] rounded-lg p-4 shadow-lg"
        style={{
          boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <InfoButtons />

        {/* Más Filtros */}
        <h3 className="text-lg font-semibold mb-4 text-[#293e68]">Más Filtros</h3>
        <div className="space-y-4">
          
          {/* Nivel de Educación */}
          <div>
            <label htmlFor="nivelEducacion" className="text-xs text-gray-600 block mb-1">Nivel de Educación</label>
            <select
              id="nivelEducacion"
              value={selectedCategories.nivelEducacion}
              onChange={(e) => setSelectedCategories({ ...selectedCategories, nivelEducacion: e.target.value })}
              className={`form-select rounded p-1 text-sm w-full ${isActive(selectedCategories.nivelEducacion) ? 'border-2 border-[#293e68]' : 'border-gray-300'}`}
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
              value={selectedCategories.experienciaAnios}
              onChange={(e) => setSelectedCategories({ ...selectedCategories, experienciaAnios: e.target.value })}
              className={`form-select rounded p-1 text-sm w-full ${isActive(selectedCategories.experienciaAnios) ? 'border-2 border-[#293e68]' : 'border-gray-300'}`}
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
              className={`form-select rounded p-1 text-sm w-full ${isActive(filters.genero) ? 'border-2 border-[#293e68]' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Edad */}
          <div>
            <label htmlFor="edad" className="text-xs text-gray-600 block mb-1">Edad</label>
            <select
              id="edad"
              value={filters.edad}
              onChange={(e) => handleFilterChange(e, "edad")}
              className={`form-select rounded p-1 text-sm w-full ${isActive(filters.edad) ? 'border-2 border-[#293e68]' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar</option>
              <option value="18">Más de 18</option>
              <option value="30">Más de 30</option>
              <option value="40">Más de 40</option>
              <option value="50">Más de 50</option>
              <option value="60">Más de 60</option>
            </select>
          </div>

          {/* País */}
          <div>
            <label htmlFor="pais" className="text-xs text-gray-600 block mb-1">País</label>
            <select
              id="pais"
              value={filters.pais}
              onChange={(e) => handleFilterChange(e, "pais")}
              className={`form-select rounded p-1 text-sm w-full ${isActive(filters.pais) ? 'border-2 border-[#293e68]' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar</option>
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="Brasil">Brasil</option>
              <option value="Perú">Perú</option>
            </select>
          </div>

          {/* Idioma */}
          <div>
            <label htmlFor="idioma" className="text-xs text-gray-600 block mb-1">Idioma</label>
            <select
              id="idioma"
              value={filters.idioma}
              onChange={(e) => handleFilterChange(e, "idioma")}
              className={`form-select rounded p-1 text-sm w-full ${isActive(filters.idioma) ? 'border-2 border-[#293e68]' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar</option>
              <option value="Español">Español</option>
              <option value="Inglés">Inglés</option>
              <option value="Francés">Francés</option>
              <option value="Alemán">Alemán</option>
            </select>
          </div>

          {/* Creación */}
          <div>
            <label htmlFor="creacion" className="text-xs text-gray-600 block mb-1">Creación</label>
            <select
              id="creacion"
              value={filters.creacion}
              onChange={(e) => handleFilterChange(e, "creacion")}
              className={`form-select rounded p-1 text-sm w-full ${isActive(filters.creacion) ? 'border-2 border-[#293e68]' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar</option>
              <option value="1d">Último día</option>
              <option value="3d">Últimos 3 días</option>
              <option value="1w">Última semana</option>
              <option value="1m">Último mes</option>
            </select>
          </div>

          {/* Disponibilidad para Viajar */}
          <div>
            <label htmlFor="disponibilidadViajar" className="text-xs text-gray-600 block mb-1">Disponibilidad para Viajar</label>
            <select
              id="disponibilidadViajar"
              value={selectedCategories.disponibilidadViajar}
              onChange={(e) => setSelectedCategories({ ...selectedCategories, disponibilidadViajar: e.target.value })}
              className={`form-select rounded p-1 text-sm w-full ${isActive(selectedCategories.disponibilidadViajar) ? 'border-2 border-[#293e68]' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        {/* Categorías de Filtro */}
        <h3 className="text-lg font-semibold mt-6 mb-4 text-[#293e68]">Filtrar por Categorías</h3>
        <div className="space-y-2">
          {categoriesList.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="form-checkbox h-4 w-4 text-[#293e68]"
              />
              <span className="text-gray-700 texto-categoria">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

Categories.propTypes = {
  selectedCategories: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    nivelEducacion: PropTypes.string,
    experienciaAnios: PropTypes.string,
    disponibilidadViajar: PropTypes.string,
  }).isRequired,
  setSelectedCategories: PropTypes.func.isRequired,
  isSidebarExpanded: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default Categories;

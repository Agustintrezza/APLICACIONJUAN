import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

const SelectFilters = ({
  searchTerm,
  setSearchTerm,
  handleResetSearch,
  handleResetFilters,
  hasSearchTerm,
  hasCategoryFilters,
}) => {
  return (
    <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-4 mb-3 shadow-lg">
      {/* Contenedor del campo de búsqueda */}
      <div className="flex-1 border border-blue-300 bg-[#e9f0ff] rounded-lg p-2 shadow-md">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="search"
            placeholder="Buscar por nombre o apellido"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="p-2 bg-[#293e68] text-white rounded-r-lg">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Contenedor de botones */}
      <div className="flex px-2 pt-0 pb-2 md:pt-2 flex-wrap gap-2 sm:flex-nowrap sm:space-x-2 sm:items-center">
        <button
          onClick={handleResetSearch}
          disabled={!hasSearchTerm}
          className={`flex-1 p-2 text-sm rounded w-40 ${
            hasSearchTerm
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Limpiar Busqueda
        </button>
        <button
          onClick={handleResetFilters}
          disabled={!hasCategoryFilters}
          className={`flex-1 p-2 text-sm rounded ${
            hasCategoryFilters
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

SelectFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleResetSearch: PropTypes.func.isRequired,
  handleResetFilters: PropTypes.func.isRequired,
  hasSearchTerm: PropTypes.bool.isRequired,
  hasCategoryFilters: PropTypes.bool.isRequired,
};

export default SelectFilters;

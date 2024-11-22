import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockCVData } from '../../mockData';
import { AppContext } from '../../context/AppContext';
import { FaPlus, FaHeart } from 'react-icons/fa';
import { MdEdit, MdDelete } from 'react-icons/md';
import SelectFilters from '../selectfilters/SelectFilters';
import Categories from '../../components/categories/Categories';

const removeAccents = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const limitText = (text, limit) => text.length > limit ? `${text.slice(0, limit)}...` : text;

const TableMain = () => {
  const { isSidebarExpanded } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    genero: "",
    edad: "",
    pais: "",
    idioma: "",
    creacion: "",
  });
  const [selectedCategories, setSelectedCategories] = useState({
    categories: [],
    nivelEducacion: "",
    experienciaAnios: "",
    disponibilidadViajar: ""
  });
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFavorite = (id) => {
    setFavoriteIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((favId) => favId !== id) : [...prevIds, id]
    );
  };

  const handleResetSearch = () => setSearchTerm("");
  const handleResetFilters = () => {
    setFilters({
      genero: "",
      edad: "",
      pais: "",
      idioma: "",
      creacion: "",
    });
    setSelectedCategories({
      categories: [],
      nivelEducacion: "",
      experienciaAnios: "",
      disponibilidadViajar: ""
    });
  };

  const hasCategoryFilters =
    Object.values(filters).some((value) => value !== "") ||
    selectedCategories.categories.length > 0 ||
    selectedCategories.nivelEducacion !== "" ||
    selectedCategories.experienciaAnios !== "" ||
    selectedCategories.disponibilidadViajar !== "";

  const filteredData = mockCVData
    .filter((user) =>
      removeAccents(`${user.nombre} ${user.apellido}`)
        .toLowerCase()
        .includes(removeAccents(searchTerm.toLowerCase()))
    )
    .filter((user) => {
      return (
        (filters.genero === "" || user.genero === filters.genero) &&
        (filters.edad === "" || parseInt(user.edad, 10) >= parseInt(filters.edad, 10)) &&
        (filters.pais === "" || user.pais === filters.pais) &&
        (filters.idioma === "" || user.idiomas.includes(filters.idioma)) &&
        (filters.creacion === "" || new Date() - new Date(user.creacion) <= filters.creacion) &&
        (selectedCategories.categories.length === 0 ||
          selectedCategories.categories.some((category) => user.categorias.includes(category))) &&
        (selectedCategories.nivelEducacion === "" || user.nivelEducacion === selectedCategories.nivelEducacion) &&
        (selectedCategories.experienciaAnios === "" || user.experienciaAnios === selectedCategories.experienciaAnios) &&
        (selectedCategories.disponibilidadViajar === "" || user.disponibilidadViajar === selectedCategories.disponibilidadViajar)
      );
    });

  return (
    <div className="w-full mx-auto space-y-4 relative">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Curriculums ({filteredData.length})
          </h2>
          {isDesktop ? (
            <Link 
              to="/crear-cv" 
              className="flex items-center bg-[#293e68] text-white px-4 py-2 rounded-lg hover:bg-blue-800 shadow-lg"
            >
              <FaPlus className="mr-2" /> Ingresar CV
            </Link>
          ) : (
            <Link 
              to="/crear-cv" 
              className="fixed bottom-6 right-6 bg-[#293e68] text-white p-4 rounded-full shadow-lg hover:bg-blue-800 z-50"
              title="Ingresar CV"
            >
              <FaPlus />
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-row space-x-4">
        <div className={`${isDesktop ? 'w-4/5' : 'w-full'}`}>
          {isDesktop && (
            <SelectFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleResetSearch={handleResetSearch}
              hasSearchTerm={searchTerm.trim() !== ""}
              handleResetFilters={handleResetFilters}
              hasCategoryFilters={hasCategoryFilters}
            />
          )}
          <div className="grid gap-4 mt-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 relative"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#293e68]">
                      {user.nombre} {user.apellido}, {user.edad}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {limitText(user.descripcion, 70)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center bg-gray-100 px-4 py-2">
                    <div className="flex gap-2">
                      <button className="text-[#293e68] hover:text-blue-600">
                        <MdEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <MdDelete />
                      </button>
                    </div>
                    <button
                      onClick={() => toggleFavorite(user.id)}
                      className={`${
                        favoriteIds.includes(user.id)
                          ? "text-red-500"
                          : "text-gray-500"
                      } hover:text-red-600`}
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No se encontraron resultados.
              </div>
            )}
          </div>
        </div>

        {isDesktop && (
          <Categories
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            filters={filters}
            setFilters={setFilters}
            isSidebarExpanded={isSidebarExpanded}
          />
        )}
      </div>
    </div>
  );
};

export default TableMain;

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ListasSelect = ({ selectedLista, setSelectedLista }) => {
  const [listas, setListas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const response = await fetch("/api/listas"); // Ruta para obtener todas las listas
        const data = await response.json();
        setListas(data);
      } catch (error) {
        console.error("Error al cargar las listas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListas();
  }, []);

  return (
    <div className="mb-4">
      <label htmlFor="lista" className="block mb-2 text-sm font-medium text-gray-900">
        Seleccionar Lista
      </label>
      {isLoading ? (
        <Skeleton height={40} />
      ) : (
        <select
          id="lista"
          value={selectedLista}
          onChange={(e) => setSelectedLista(e.target.value)}
          className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
        >
          <option value="">Seleccione una lista</option>
          {listas.map((lista) => (
            <option key={lista._id} value={lista._id}>
              {lista.posicion} - {lista.cliente}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

ListasSelect.propTypes = {
  selectedLista: PropTypes.string.isRequired,
  setSelectedLista: PropTypes.func.isRequired,
};

export default ListasSelect;

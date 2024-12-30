import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
};

const PROVINCIAS_ARGENTINA = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa",
  "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
  "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Santiago del Estero", "Tierra del Fuego", "Tucumán", "CABA",
];

const PaisSelect = ({ formData, setFormData }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      pais: selectedCountry,
      provincia: selectedCountry === "Argentina" ? prevData.provincia : "",
      zona: "",
      localidad: "",
      ubicacionManual: "",
    }));
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData({
      ...formData,
      provincia: selectedProvince,
      zona: "",
      localidad: "",
      ubicacionManual: "",
    });
  };

  const handleZonaChange = (e) => {
    const selectedZona = e.target.value;
    setFormData({
      ...formData,
      zona: selectedZona,
      localidad: "",
    });
  };

  const handleLocalidadChange = (e) => {
    const selectedLocalidad = e.target.value;
    setFormData({
      ...formData,
      localidad: selectedLocalidad,
    });
  };

  const handleUbicacionManualChange = (e) => {
    const manualLocation = e.target.value;
    setFormData({
      ...formData,
      ubicacionManual: manualLocation,
    });
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton height={40} className="mb-2" />
        <Skeleton height={40} className="mb-2" />
        <Skeleton height={40} className="mb-2" />
      </div>
    );
  }

  return (
    <div>
      {/* Campo País */}
      <div>
        <label htmlFor="pais" className="block mb-2 text-sm font-medium text-gray-900">
          País
        </label>
        <select
          id="pais"
          name="pais"
          value={formData.pais}
          onChange={handleCountryChange}
          className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
        >
          <option value="">Seleccione un país</option>
          <option value="Argentina">Argentina</option>
          <option value="Estados Unidos">Estados Unidos</option>
          <option value="Chile">Chile</option>
          <option value="Uruguay">Uruguay</option>
          <option value="Brasil">Brasil</option>
        </select>
      </div>

      {/* Campo Provincia */}
      {formData.pais === "Argentina" && (
        <div className="mt-2">
          <label htmlFor="provincia" className="block mb-2 text-sm font-medium text-gray-900">
            Provincia
          </label>
          <select
            id="provincia"
            name="provincia"
            value={formData.provincia}
            onChange={handleProvinceChange}
            className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
          >
            <option value="">Seleccione una provincia</option>
            {PROVINCIAS_ARGENTINA.map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Campo Zona */}
      {formData.provincia === "Buenos Aires" && (
        <div className="mt-2">
          <label htmlFor="zona" className="block mb-2 text-sm font-medium text-gray-900">
            Zona
          </label>
          <select
            id="zona"
            name="zona"
            value={formData.zona}
            onChange={handleZonaChange}
            className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
          >
            <option value="">Seleccione una zona</option>
            {Object.keys(ZONAS_LOCALIDADES).map((zona) => (
              <option key={zona} value={zona}>
                {zona}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Campo Localidad */}
      {formData.zona && ZONAS_LOCALIDADES[formData.zona] && (
        <div className="mt-2">
          <label htmlFor="localidad" className="block mb-2 text-sm font-medium text-gray-900">
            Localidad
          </label>
          <select
            id="localidad"
            name="localidad"
            value={formData.localidad}
            onChange={handleLocalidadChange}
            className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
          >
            <option value="">Seleccione una localidad</option>
            {ZONAS_LOCALIDADES[formData.zona].map((localidad) => (
              <option key={localidad} value={localidad}>
                {localidad}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Campo Ubicación Manual */}
      {(formData.pais !== "Argentina" || formData.provincia !== "Buenos Aires") && (
        <div className="mt-2">
          <label htmlFor="ubicacionManual" className="block mb-2 text-sm font-medium text-gray-900">
            Ubicación Manual
          </label>
          <input
            type="text"
            id="ubicacionManual"
            name="ubicacionManual"
            value={formData.ubicacionManual}
            onChange={handleUbicacionManualChange}
            className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
          />
        </div>
      )}
    </div>
  );
};

PaisSelect.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default PaisSelect;

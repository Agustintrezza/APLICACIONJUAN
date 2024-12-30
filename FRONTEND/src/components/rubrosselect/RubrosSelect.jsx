import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RubrosSelect = ({ formData, setFormData, errors, handleChange, isLoading }) => {
  const [rubros, setRubros] = useState([]);
  const [puestos, setPuestos] = useState({});
  const [subrubros, setSubrubros] = useState({});

  useEffect(() => {
    // Define the options for Rubros
    setRubros([
      "Gastronomía",
      "Industria",
      "Comercio",
      "Administración"
    ]);

    // Define the available Puestos for each Rubro
    setPuestos({
      "Gastronomía": ["Cocina", "Salón", "Barra"],
      "Industria": ["Metalúrgica", "IT/Programación", "Transporte", "Maquinarias"],
      "Comercio": ["Atención al público", "Encargado de local"],
      "Administración": ["Recursos Humanos", "Administrativo de Compras", "Administrativo de Ventas", "Marketing", "Contable", "Legales"]
    });

    // Define the available Subrubros for each Puesto in Gastronomía
    setSubrubros({
      "Cocina": ["Chef", "Fast Food", "Jefe de cocina", "Cocinero", "Pizzero", "Sushiman", "Ayudante de cocina", "Pastelero", "Panadero", "Laminadores", "Horneros", "Facturistas"],
      "Salón": ["Jefe de sala", "Camarero", "Mozo", "Comis", "Runner"],
      "Barra": ["Bartender", "Barista", "Cajero", "Encargado", "Gerente de local", "Gerente de operaciones"]
    });
  }, []);

  const handleRubroChange = (e) => {
    const selectedRubro = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      rubro: selectedRubro,
      puesto: "", // Reset puesto
      subrubro: "", // Reset subrubro
    }));
  };

  const handlePuestoChange = (e) => {
    const selectedPuesto = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      puesto: selectedPuesto,
      subrubro: "", // Reset subrubro
    }));
  };

  const handleSubrubroChange = (e) => {
    const selectedSubrubro = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      subrubro: selectedSubrubro,
    }));
  };

  // Verificar si subrubro debe ser obligatorio
  const isSubrubroRequired = formData.rubro === "Gastronomía" && !formData.subrubro;

  return (
    <div className="flex flex-col gap-6">
      {/* Rubro */}
      <div className="flex flex-col">
        <label htmlFor="rubro" className="text-sm text-gray-900">Rubro</label>
        {isLoading ? (
          <Skeleton height={40} />
        ) : (
          <select
            id="rubro"
            name="rubro"
            value={formData.rubro || ""}
            onChange={(e) => {
              handleRubroChange(e);
              handleChange(e);
            }}
            className="p-3 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Selecciona un rubro</option>
            {rubros.map((rubro) => (
              <option key={rubro} value={rubro}>
                {rubro}
              </option>
            ))}
          </select>
        )}
        {errors.rubro && <div className="text-red-500 text-sm">{errors.rubro}</div>}
      </div>

      {/* Puesto */}
      {formData.rubro && (
        <div className="flex flex-col">
          <label htmlFor="puesto" className="text-sm text-gray-900">
            {formData.rubro === "Gastronomía" ? "Subrubro" : "Puesto"}
          </label>
          {isLoading ? (
            <Skeleton height={40} />
          ) : (
            <select
              id="puesto"
              name="puesto"
              value={formData.puesto || ""}
              onChange={(e) => {
                handlePuestoChange(e);
                handleChange(e);
              }}
              className="p-3 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Selecciona un puesto</option>
              {puestos[formData.rubro]?.map((puesto) => (
                <option key={puesto} value={puesto}>
                  {puesto}
                </option>
              ))}
            </select>
          )}
          {errors.puesto && <div className="text-red-500 text-sm">{errors.puesto}</div>}
        </div>
      )}

      {/* Subrubro */}
      {formData.rubro === "Gastronomía" && formData.puesto && (
        <div className="flex flex-col">
          <label htmlFor="subrubro" className="text-sm text-gray-900">
            Subrubro
          </label>
          {isLoading ? (
            <Skeleton height={40} />
          ) : (
            <select
              id="subrubro"
              name="subrubro"
              value={formData.subrubro || ""}
              onChange={handleSubrubroChange}
              className="p-3 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Selecciona un subrubro</option>
              {subrubros[formData.puesto]?.map((subrubro) => (
                <option key={subrubro} value={subrubro}>
                  {subrubro}
                </option>
              ))}
            </select>
          )}
          {isSubrubroRequired && (
            <div className="text-red-500 text-sm">El subrubro es obligatorio para el rubro Gastronomía</div>
          )}
        </div>
      )}
    </div>
  );
};

RubrosSelect.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default RubrosSelect;

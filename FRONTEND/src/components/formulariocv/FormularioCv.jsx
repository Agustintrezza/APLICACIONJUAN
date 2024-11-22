import PropTypes from "prop-types";
import PaisSelect from "../paisselect/PaisSelect";

const FormularioCv = ({
  formData,
  errors,
  handleChange,
  handleFileChange,
  handleCheckboxChange,
  handleSubmit,
  setFormData,
}) => {
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="grid grid-cols-2 gap-8">
        {/* Columna 1 */}
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68] ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          {/* Apellido */}
          <div>
            <label htmlFor="apellido" className="block mb-2 text-sm font-medium text-gray-900">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={`w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68] ${
                errors.apellido ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
          </div>

          {/* Género */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Género</label>
            <div className="flex space-x-4">
              {["Masculino", "Femenino"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="genero"
                    value={option}
                    checked={formData.genero === option}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.genero && <p className="text-red-500 text-sm mt-1">{errors.genero}</p>}
          </div>

          {/* Edad */}
          <div>
            <label htmlFor="edad" className="block mb-2 text-sm font-medium text-gray-900">
              Edad
            </label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              className={`w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68] ${
                errors.edad ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.edad && <p className="text-red-500 text-sm mt-1">{errors.edad}</p>}
          </div>

          {/* Teléfonos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefonoFijo" className="block mb-2 text-sm font-medium text-gray-900">
                Teléfono Fijo
              </label>
              <input
                type="text"
                id="telefonoFijo"
                name="telefonoFijo"
                value={formData.telefonoFijo}
                onChange={handleChange}
                className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
              />
            </div>
            <div>
              <label htmlFor="celular" className="block mb-2 text-sm font-medium text-gray-900">
                Teléfono Celular
              </label>
              <input
                type="text"
                id="celular"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className={`w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68] ${
                  errors.celular ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.celular && <p className="text-red-500 text-sm mt-1">{errors.celular}</p>}
            </div>
          </div>

          {/* Ubicación */}
          <PaisSelect formData={formData} setFormData={setFormData} />
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          {/* Nivel de Estudios */}
          <div>
            <label htmlFor="nivelEstudios" className="block mb-2 text-sm font-medium text-gray-900">
              Nivel de Estudios
            </label>
            <select
              id="nivelEstudios"
              name="nivelEstudios"
              value={formData.nivelEstudios}
              onChange={handleChange}
              className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
            >
              <option value="">Seleccione el nivel de estudios</option>
              <option value="Primario">Primario</option>
              <option value="Secundario">Secundario</option>
              <option value="Terciario">Terciario</option>
              <option value="Universitario">Universitario</option>
            </select>
          </div>

          {/* Experiencia */}
          <div>
            <label htmlFor="experiencia" className="block mb-2 text-sm font-medium text-gray-900">
              Años de Experiencia
            </label>
            <select
              id="experiencia"
              name="experiencia"
              value={formData.experiencia}
              onChange={handleChange}
              className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
            >
              <option value="">Seleccione años de experiencia</option>
              <option value="Menos de un año">Menos de un año</option>
              <option value="Más de un año">Más de un año</option>
              <option value="Más de 3 años">Más de 3 años</option>
              <option value="Más de 5 años">Más de 5 años</option>
              <option value="Más de 10 años">Más de 10 años</option>
            </select>
          </div>

          {/* Idiomas */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Idiomas</label>
            <div className="flex space-x-4">
              {["Inglés", "Español", "Portugués", "Italiano", "Francés"].map((language) => (
                <label key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    value={language}
                    checked={formData.idiomas.includes(language)}
                    onChange={() => handleCheckboxChange(language)}
                    className="mr-2"
                  />
                  {language}
                </label>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label htmlFor="imagen" className="block mb-2 text-sm font-medium text-gray-900">
              Adjuntar Imagen
            </label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              onChange={handleFileChange}
              className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
            />
            {errors.imagen && <p className="text-red-500 text-sm mt-1">{errors.imagen}</p>}
          </div>

          {/* Comentarios */}
          <div>
            <label htmlFor="comentarios" className="block mb-2 text-sm font-medium text-gray-900">
              Comentarios
            </label>
            <textarea
              id="comentarios"
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68]"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 text-white bg-[#293e68] hover:bg-[#1f2d4b] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Crear CV
      </button>
    </form>
  );
};

FormularioCv.propTypes = {
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default FormularioCv;

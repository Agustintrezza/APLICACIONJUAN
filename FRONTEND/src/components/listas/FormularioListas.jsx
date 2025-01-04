import { useState, useEffect } from "react"
import { Input, Textarea, Button, FormLabel } from "@chakra-ui/react"
import PropTypes from "prop-types"
import * as Yup from "yup"

const FormularioListas = ({ onCreate = () => {}, listaToEdit, onUpdate }) => {
  const [formData, setFormData] = useState({
    cliente: "",
    comentario: "",
    color: "#E53E3E",
    rubro: "",
    puesto: "",
    subrubro: "",
  })
  const [errors, setErrors] = useState({})

  const [rubros, setRubros] = useState([])
  const [puestos, setPuestos] = useState({})
  const [subrubros, setSubrubros] = useState({})

  const colors = ["#E53E3E", "#3E8FE5", "#FFB042", "#FFF01A", "#51E302", "#8FE3FF"]

  const validationSchema = Yup.object().shape({
    cliente: Yup.string().required("El campo Cliente es obligatorio"),
    rubro: Yup.string(),
    puesto: Yup.string(),
    subrubro: Yup.string(),
    comentario: Yup.string(),
    color: Yup.string().default("#E53E3E"),
  })

  useEffect(() => {
    setRubros(["Gastronomía", "Industria", "Comercio", "Administración"])
    setPuestos({
      Gastronomía: ["Cocina", "Salón", "Barra"],
      Industria: ["Metalúrgica", "IT/Programación", "Transporte", "Maquinarias"],
      Comercio: ["Atención al público", "Encargado de local"],
      Administración: ["Recursos Humanos", "Administrativo de Compras", "Administrativo de Ventas", "Marketing", "Contable", "Legales"],
    })
    setSubrubros({
      Cocina: ["Chef", "Fast Food", "Jefe de cocina", "Cocinero", "Pizzero", "Sushiman", "Ayudante de cocina", "Pastelero", "Panadero"],
      Salón: ["Jefe de sala", "Camarero", "Mozo", "Comis", "Runner"],
      Barra: ["Bartender", "Barista", "Cajero", "Encargado", "Gerente de local", "Gerente de operaciones"],
    })
    if (listaToEdit) {
      setFormData({
        cliente: listaToEdit.cliente || "",
        comentario: listaToEdit.comentario || "",
        color: listaToEdit.color || "#E53E3E",
        rubro: listaToEdit.rubro || "",
        puesto: listaToEdit.puesto || "",
        subrubro: listaToEdit.subrubro || "",
      })
    }
  }, [listaToEdit])

  const handleValidation = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false })
      setErrors({})
      return true
    } catch (validationErrors) {
      const newErrors = {}
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message
      })
      setErrors(newErrors)
      return false
    }
  }

  useEffect(() => {
    if (listaToEdit) {
      setFormData({
        cliente: listaToEdit.cliente || "",
        comentario: listaToEdit.comentario || "",
        color: listaToEdit.color || "#E53E3E",
        rubro: listaToEdit.rubro || "",
        puesto: listaToEdit.puesto || "",
        subrubro: listaToEdit.subrubro || "",
      })
    } else {
      setFormData({
        cliente: "",
        comentario: "",
        color: "#E53E3E",
        rubro: "",
        puesto: "",
        subrubro: "",
      })
    }
  }, [listaToEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("FormularioListas: Datos enviados al manejar submit:", formData)
  
    if (!(await handleValidation())) {
      console.log("FormularioListas: Validación fallida")
      return
    }
  
    try {
      if (listaToEdit && onUpdate) {
        console.log("FormularioListas: Llamando a onUpdate con:", formData)
        await onUpdate({ ...listaToEdit, ...formData })
      } else if (onCreate) {
        console.log("FormularioListas: Llamando a onCreate con:", formData)
        await onCreate(formData) // Esto debe llamar correctamente a createList
      }
    } catch (error) {
      console.error("FormularioListas: Error al procesar la lista:", error)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const inputStyle =
    "p-3 bg-[#e9f0ff] border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"

  return (
    <div className="w-5/5 xl:w-5/5" style={{ position: "sticky", top: "0px", maxHeight: "100vh", overflowY: "auto" }}>
      <div className="border border-blue-300 bg-[#e9f0ff] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#293e68]">
          {listaToEdit ? "Editar Lista" : "Crear nueva Lista"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <FormLabel className="text-sm text-[#293e68]">Cliente/Título del Listado</FormLabel>
            <Input
              placeholder="Cliente"
              value={formData.cliente}
              onChange={(e) => handleInputChange("cliente", e.target.value)}
              borderColor="#8bb1ff"
              focusBorderColor="#293e68"
              className={inputStyle}
            />
            {errors.cliente && <p className="text-red-500 text-sm">{errors.cliente}</p>}
          </div>
          <div>
            <FormLabel className="text-sm text-[#293e68]">Rubro</FormLabel>
            <select
              value={formData.rubro}
              onChange={(e) => handleInputChange("rubro", e.target.value)}
              className={inputStyle}
            >
              <option value="">Selecciona un rubro</option>
              {rubros.map((rubro) => (
                <option key={rubro} value={rubro}>
                  {rubro}
                </option>
              ))}
            </select>
          </div>
          {formData.rubro && (
            <div>
              <FormLabel className="text-sm text-[#293e68]">Puesto</FormLabel>
              <select
                value={formData.puesto}
                onChange={(e) => handleInputChange("puesto", e.target.value)}
                className={inputStyle}
              >
                <option value="">Selecciona un puesto</option>
                {puestos[formData.rubro]?.map((puesto) => (
                  <option key={puesto} value={puesto}>
                    {puesto}
                  </option>
                ))}
              </select>
            </div>
          )}
          {formData.rubro === "Gastronomía" && formData.puesto && (
            <div>
              <FormLabel className="text-sm text-[#293e68]">Subrubro</FormLabel>
              <select
                value={formData.subrubro}
                onChange={(e) => handleInputChange("subrubro", e.target.value)}
                className={inputStyle}
              >
                <option value="">Selecciona un subrubro</option>
                {subrubros[formData.puesto]?.map((subrubro) => (
                  <option key={subrubro} value={subrubro}>
                    {subrubro}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <FormLabel className="text-sm text-[#293e68]">Comentario</FormLabel>
            <Textarea
              placeholder="Comentario"
              value={formData.comentario}
              onChange={(e) => handleInputChange("comentario", e.target.value)}
              borderColor="#8bb1ff"
              focusBorderColor="#293e68"
              className={inputStyle}
            />
          </div>
          <div>
            <FormLabel className="text-sm text-[#293e68]">Color</FormLabel>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={() => handleInputChange("color", color)}
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: color,
                    borderRadius: "50%",
                    border: formData.color === color ? "2px solid black" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            bg="#293e68"
            color="white"
            _hover={{ bg: "#1f2d4b" }}
            className="w-full"
          >
            {listaToEdit ? "Guardar Cambios" : "Crear Lista"}
          </Button>
        </form>
      </div>
    </div>
  )
}

FormularioListas.propTypes = {
  onCreate: PropTypes.func.isRequired,
  listaToEdit: PropTypes.object,
  onUpdate: PropTypes.func,
}

export default FormularioListas

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom" 
import * as Yup from "yup"
import FormularioCv from "../components/formulariocv/FormularioCv"
import { API_URL } from "../config"
import { Spinner, useToast } from "@chakra-ui/react"

const CrearCvScreen = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    genero: "",
    pais: "Argentina",
    provincia: "Buenos Aires",
    zona: "",
    localidad: "",
    ubicacionManual: "",
    telefonoFijo: "",
    celular: "",
    email: "",
    calificacion: "",
    nivelEstudios: "",
    experiencia: "",
    idiomas: [],
    imagen: null,
    comentarios: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false) // Spinner control
  const fileInputRef = useRef(null)
  const toast = useToast()
  const navigate = useNavigate() // Inicializa useNavigate

  // Esquema de validación
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().min(3, "Debe tener al menos 3 caracteres").required("El nombre es obligatorio"),
    apellido: Yup.string().min(2, "Debe tener al menos 2 caracteres").required("El apellido es obligatorio"),
    genero: Yup.string().oneOf(["Masculino", "Femenino", ""], "Opción inválida"),
    edad: Yup.number()
      .transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
      .nullable()
      .typeError("Debe ingresar un número válido")
      .min(18, "Debe ser mayor o igual a 18 años")
      .max(100, "Debe ser menor o igual a 100 años"),
    celular: Yup.string().required("El teléfono celular es obligatorio"),
    pais: Yup.string()
      .required("El país es obligatorio")
      .oneOf(["Argentina", "Estados Unidos", "Chile", "Uruguay", "Brasil"], "Seleccione un país válido"),
    calificacion: Yup.string()
      .oneOf(["1- Muy bueno", "2- Bueno", "3- Regular"], "Opción inválida")
      .required("La calificación es obligatoria"),
    imagen: Yup.mixed()
      .test("fileType", "El archivo debe ser una imagen JPG, JPEG, PNG o un PDF", (value) =>
        !value || ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(value?.type)
      )
      .required("La imagen o archivo es obligatorio"),
    rubro: Yup.string().required("El rubro es obligatorio"), // Solo Rubro es obligatorio
    puesto: Yup.string().required("El puesto es obligatorio"),
    subrubro: Yup.string(), // No requerido
  });

  const handleChange = async (e) => {
    const { name, value } = e.target
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value }
      return newData
    })
  
    try {
      await validationSchema.validateAt(name, { ...formData, [name]: value })
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }))
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      setFormData((prevData) => ({ ...prevData, imagen: null }))
      setErrors((prevErrors) => ({
        ...prevErrors,
        imagen: "La imagen o archivo es obligatorio.",
      }))
      return
    }

    const maxFileSize = 5 * 1024 * 1024 // 5 MB
    if (file.size > maxFileSize) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        imagen: "El archivo es demasiado grande. Máximo 5 MB.",
      }))
      return
    }

    const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    if (!allowedFormats.includes(file.type)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        imagen: "Formato de archivo no permitido. Solo JPG, JPEG, PNG y PDF.",
      }))
      return
    }

    setFormData((prevData) => ({ ...prevData, imagen: file }))
    setErrors((prevErrors) => ({ ...prevErrors, imagen: "" }))
  }

  const handleCheckboxChange = (language) => {
    setFormData((prevData) => {
      const updatedIdiomas = prevData.idiomas.includes(language)
        ? prevData.idiomas.filter((idioma) => idioma !== language)
        : [...prevData.idiomas, language]
      return { ...prevData, idiomas: updatedIdiomas }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
  
    // Validar que el subrubro esté seleccionado si el rubro es 'Gastronomía'
    if (formData.rubro === "Gastronomía" && !formData.subrubro) {
      alert("El subrubro es obligatorio para el rubro 'Gastronomía'.");
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Validación usando el esquema de Yup
      await validationSchema.validate(formData, { abortEarly: false })
  
      // Preparar los datos para el envío (incluyendo archivos)
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "imagen" && value instanceof File) {
          formDataToSend.append("imagen", value)
        } else {
          formDataToSend.append(key, value || "")
        }
      })
  
      // Enviar el formulario a la API
      const response = await fetch(`${API_URL}/api/curriculums`, {
        method: "POST",
        body: formDataToSend,
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error desconocido")
      }
  
      // Mensaje de éxito
      toast({
        title: "Éxito",
        description: "Se creó el CV exitosamente.",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      })
  
      // Restablecer los campos del formulario después del envío
      setFormData({
        nombre: "",
        apellido: "",
        edad: "",
        genero: "",
        pais: "Argentina",
        provincia: "Buenos Aires",
        zona: "",
        localidad: "",
        ubicacionManual: "",
        telefonoFijo: "",
        celular: "",
        email: "",
        calificacion: "",
        nivelEstudios: "",
        experiencia: "",
        idiomas: [],
        imagen: null,
        comentarios: "",
      })
      setErrors({})
      fileInputRef.current.value = ""
      navigate("/") 
    } catch (error) {
      // Manejo de errores de validación
      if (error.name === "ValidationError") {
        const validationErrors = {}
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message
        })
        setErrors(validationErrors)
      } else {
        // Error general
        toast({
          title: "Error",
          description: "Hubo un problema al crear el CV. Inténtelo nuevamente.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mt-1">Ingresar CV</h2>
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
          <Spinner size="xl" color="blue.500" />
        </div>
      )}
      <div className="flex bg-gray-100 py-4">
        <FormularioCv
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleCheckboxChange={handleCheckboxChange}
          handleSubmit={handleSubmit}
          fileInputRef={fileInputRef}
        />
      </div>
    </div>
  )
}

export default CrearCvScreen

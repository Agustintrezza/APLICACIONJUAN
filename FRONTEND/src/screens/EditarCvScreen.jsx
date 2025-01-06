import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import FormularioCv from "../components/formulariocv/FormularioCv"
import { API_URL } from "../config"
import { FaArrowLeft } from "react-icons/fa"
import { Skeleton, Spinner, useToast } from "@chakra-ui/react"

const EditarCvScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    edad: "",
    telefonoFijo: "",
    celular: "",
    pais: "",
    provincia: "",
    zona: "",
    localidad: "",
    ubicacionManual: "",
    calificacion: "",
    nivelEstudios: "",
    experiencia: "",
    idiomas: [],
    imagen: "",
    comentarios: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchCvData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/curriculums/${id}`)
        if (!response.ok) throw new Error("Error al cargar los datos del CV")
        const data = await response.json()
        setFormData(data)
      } catch {
        toast({
          title: "Error",
          description: "Hubo un problema al cargar los datos del CV.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCvData()
  }, [id, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData((prev) => ({
      ...prev,
      imagen: file,
    }))
  }

  const handleCheckboxChange = (language) => {
    setFormData((prev) => ({
      ...prev,
      idiomas: prev.idiomas.includes(language)
        ? prev.idiomas.filter((idioma) => idioma !== language)
        : [...prev.idiomas, language],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "imagen" && typeof value === "object") {
          formDataToSend.append(key, value)
        } else {
          formDataToSend.append(key, value || "")
        }
      })

      const response = await fetch(`${API_URL}/api/curriculums/${id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (!response.ok) throw new Error("Error al actualizar el CV")

      toast({
        title: "Éxito",
        description: "El CV se actualizó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      })

      navigate(`/ver-cv/${id}`)
    } catch {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el CV.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      {/* Título y botón de regresar */}
      <div className="bg-transparent mb-4">
        <div className="flex items-center gap-4">
          {isLoading ? (
            ''
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="text-[#293e68] hover:text-blue-600 text-xl"
            >
              <FaArrowLeft />
            </button>
          )}
          <h1 className="text-2xl font-bold text-[#293e68]">
            {isLoading ? <Skeleton width={250} /> : "Editar Curriculum"}
          </h1>
        </div>
      </div>

      {/* Contenedor del formulario */}
      <div className="w-full bg-white p-6 shadow-md rounded">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton height={50} width={200} />
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={50} width={150} />
          </div>
        ) : isSubmitting ? (
          <div className="flex justify-center">
            <Spinner size="xl" color="blue.500" />
          </div>
        ) : (
          <FormularioCv
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmit={handleSubmit}
            fileInputRef={fileInputRef}
            isLoading={isLoading}
            isEditMode={true}
          />
        )}
      </div>
    </div>
  )
}

export default EditarCvScreen

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import FormularioCv from "../components/formulariocv/FormularioCv";
import { API_URL } from "../config";
import { Spinner, useToast } from "@chakra-ui/react";
import {FaArrowLeft} from "react-icons/fa";

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
    lista: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  const validateDuplicate = async (field, value) => {
    try {
      const response = await fetch(`${API_URL}/api/curriculums/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        const result = await response.json();
        if (result.error === "Duplicado") {
          return `${field === "apellido" ? "Apellido" : "Celular"} ya está registrado.`;
        }
      }
      return true;
    } catch (error) {
      console.error("Error al validar duplicados:", error);
      return "Error al validar duplicados.";
    }
  };

  const validationSchema = Yup.object().shape({
  nombre: Yup.string().min(3, "Debe tener al menos 3 caracteres").required("El nombre es obligatorio"),
  apellido: Yup.string()
    .min(2, "Debe tener al menos 2 caracteres")
    .required("El apellido es obligatorio")
    .test(
      "check-duplicate",
      "Apellido ya está registrado.",
      async (value, context) => {
        const excludeId = context?.parent?.id || ""; // Extraer el ID del CV desde el formulario
        const originalValue = context?.parent?.originalApellido || ""; // Valor original del apellido
        if (value === originalValue) {
          return true; // Si no se ha cambiado, pasa la validación
        }
        const result = await validateDuplicate("apellido", value, excludeId);
        return result === true;
      }
    ),
  celular: Yup.string()
    .required("El teléfono celular es obligatorio")
    .test(
      "check-duplicate",
      "Celular ya está registrado.",
      async (value, context) => {
        const excludeId = context?.parent?.id || ""; // Extraer el ID del CV desde el formulario
        const originalValue = context?.parent?.originalCelular || ""; // Valor original del celular
        if (value === originalValue) {
          return true; // Si no se ha cambiado, pasa la validación
        }
        const result = await validateDuplicate("celular", value, excludeId);
        return result === true;
      }
    ),
  email: Yup.string().email("Debe ser un email válido").nullable(true).notRequired(),
  genero: Yup.string().oneOf(["Masculino", "Femenino", ""], "Opción inválida"),
  edad: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .typeError("Debe ingresar un número válido")
    .min(18, "Debe ser mayor o igual a 18 años")
    .max(100, "Debe ser menor o igual a 100 años"),
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
    .test("required-if-no-existing", "La imagen o archivo es obligatorio", function (value) {
      const { imagen } = this.parent; // Acceder a la imagen actual
      return imagen || value; // Si hay una imagen existente o se carga una nueva, pasa la validación
    }),
  rubro: Yup.string().required("El rubro es obligatorio"),
  puesto: Yup.string().required("El puesto es obligatorio"),
  subrubro: Yup.string(),
});

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));

    try {
      await validationSchema.validateAt(name, { ...formData, [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrors((prevErrors) => ({ ...prevErrors, imagen: "La imagen o archivo es obligatorio." }));
      return;
    }

    const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedFormats.includes(file.type)) {
      setErrors((prevErrors) => ({ ...prevErrors, imagen: "Formato de archivo no permitido." }));
      return;
    }

    setFormData((prevData) => ({ ...prevData, imagen: file }));
    setErrors((prevErrors) => ({ ...prevErrors, imagen: "" }));
  };

  const handleCheckboxChange = (language) => {
    setFormData((prevData) => {
      const updatedIdiomas = prevData.idiomas.includes(language)
        ? prevData.idiomas.filter((idioma) => idioma !== language)
        : [...prevData.idiomas, language];
      return { ...prevData, idiomas: updatedIdiomas };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
  
    try {
      // Validar formulario
      await validationSchema.validate(formData, { abortEarly: false });
  
      // Preparar datos para enviar
      const formDataToSend = new FormData();
      const sanitizedIdiomas = Array.isArray(formData.idiomas)
        ? formData.idiomas.filter((idioma) => typeof idioma === "string").map((idioma) => idioma.trim())
        : [];
      const updatedFormData = { ...formData, idiomas: sanitizedIdiomas };
  
      Object.entries(updatedFormData).forEach(([key, value]) => {
        if (key === "imagen" && value instanceof File) {
          formDataToSend.append(key, value); // Agregar solo si es un archivo nuevo
        } else if (Array.isArray(value)) {
          value.forEach((v) => formDataToSend.append(`${key}[]`, v));
        } else {
          formDataToSend.append(key, value || "");
        }
      });
  
      // Enviar datos al servidor para crear el nuevo CV
      const response = await fetch(`${API_URL}/api/curriculums`, {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) throw new Error("Error al crear el CV");
  
      // Obtener la respuesta JSON, que debería contener el curriculum y el id
      const result = await response.json();
  
      // Verificar que la respuesta contiene el id
      if (result && result.curriculum && result.curriculum._id) {
        toast({
          title: "Éxito",
          description: "El CV se creó correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
  
        // Redirigir al usuario al CV creado utilizando el id correcto
        navigate(`/ver-cv/${result.curriculum._id}`); // Redirigir usando el id correcto
      } else {
        throw new Error("El ID del CV no se ha recibido correctamente");
      }
  
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
      toast({
        title: "Error",
        description: "Hubo un problema al crear el CV.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div>
      <div className="flex items-center mt-1 gap-3">
      <button
          onClick={() => navigate("/")}
          className="text-[#293e68] hover:text-[#1c2a46] text-xl"
        >
          <FaArrowLeft />
        </button>
      <h2 className="text-2xl font-bold text-gray-800">Ingresar Curriculum</h2>
     
      </div>
      
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
  );
};

export default CrearCvScreen;

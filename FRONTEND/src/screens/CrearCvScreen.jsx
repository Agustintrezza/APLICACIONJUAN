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
  apellido: Yup.string().min(2, "Debe tener al menos 2 caracteres").required("El apellido es obligatorio"),
  celular: Yup.string()
  .required("El teléfono celular es obligatorio")
  .matches(/^\d+$/, "El teléfono celular debe contener solo números") // Validación para solo números
  .min(6, "El teléfono celular debe tener entre 6 y 15 dígitos") // Mínimo de 6 caracteres
  .max(15, "El teléfono celular no puede tener más de 15 dígitos") // Máximo de 15 caracteres
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
    genero: Yup.string()
    .oneOf(["Masculino", "Femenino", ""], "Género inválido")  // No es obligatorio, así que no es necesario usar `.required()`
    .default(''),
  email: Yup.string().email("Debe ser un email válido").nullable(true).notRequired(),
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
  .test("fileType", "El archivo debe ser una imagen JPG, JPEG, PNG o un PDF", (value) => {
    return !value || ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(value?.type);
  })
  .required("Es necesario ingresar una imagen del curriculum.")
  .required("Es necesario ingresar una imagen del curriculum."),
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
    
    // Si no se selecciona ningún archivo, se muestra un mensaje de error
    if (!file) {
      setErrors((prevErrors) => ({ ...prevErrors, imagen: "La imagen o archivo es obligatorio." }));
      return;
    }
  
    // Si el tipo de archivo no es válido, mostramos un error
    const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedFormats.includes(file.type)) {
      setErrors((prevErrors) => ({ ...prevErrors, imagen: "Formato de archivo no permitido." }));
      return;
    }
  
    // Si es válido, actualizamos el estado y eliminamos el mensaje de error
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
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setIsSubmitting(true); // Indica que se está enviando el formulario
    setErrors({}); // Limpia los errores anteriores
  
    try {
      // Validar el formulario completo usando Yup
      await validationSchema.validate(formData, { abortEarly: false }); // abortEarly: false asegura que todos los errores se devuelvan
  
      // Si el formulario pasa la validación, preparar el FormData para enviarlo
      const formDataToSend = new FormData();
  
      // Procesar y preparar los datos para ser enviados
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "imagen" && value instanceof File) {
          formDataToSend.append(key, value); // Solo agregamos la imagen si es un archivo válido
        } else if (Array.isArray(value)) {
          value.forEach((v) => formDataToSend.append(`${key}[]`, v)); // Si es un array (ej. idiomas), agregamos cada valor individualmente
        } else {
          formDataToSend.append(key, value || ""); // Si el valor es vacío, lo pasamos como cadena vacía
        }
      });
  
      // Enviar los datos al servidor
      const response = await fetch(`${API_URL}/api/curriculums`, {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) throw new Error("Error al crear el CV"); // Si la respuesta no es OK, lanzamos un error
  
      const result = await response.json(); // Obtenemos la respuesta JSON
      if (result && result.curriculum && result.curriculum._id) {
        // Si el servidor respondió correctamente
        toast({
          title: "Éxito",
          description: "El CV se creó correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
  
        // Redirigimos al usuario al CV recién creado usando su ID
        navigate(`/ver-cv/${result.curriculum._id}`);
      } else {
        throw new Error("El ID del CV no se ha recibido correctamente"); // Si no se recibe el ID, lanzamos un error
      }
  
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      if (error.name === "ValidationError") {
        // Si la validación falla, procesamos los errores y los mostramos
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors); // Actualizamos el estado de errores
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
      setIsSubmitting(false); // Indicamos que hemos terminado de procesar
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

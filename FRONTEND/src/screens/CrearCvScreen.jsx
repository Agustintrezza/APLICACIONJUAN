import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import FormularioCv from "../components/formulariocv/FormularioCv";
import { API_URL } from "../config";
import { Spinner, useToast } from "@chakra-ui/react";
import {FaArrowLeft} from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

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
  
  // const [isDuplicate, setIsDuplicate] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Para mostrar el AlertDialog
  // const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

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

  useEffect(() => {
    if (formData.nombre && formData.apellido) {
      const timeout = setTimeout(async () => {
        try {
          const response = await fetch(`${API_URL}/api/curriculums/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: formData.nombre, apellido: formData.apellido }),
          });

          const result = await response.json();

          if (result.error === "Duplicado" && result.duplicadoEn === "nombre-apellido") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              nombre: "⚠️ Este nombre y apellido ya están registrados.",
              apellido: "⚠️ Este nombre y apellido ya están registrados.",
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              nombre: "",
              apellido: "",
            }));
          }
        } catch (error) {
          console.error("Error al validar duplicado:", error);
        }
      }, 800);

      return () => clearTimeout(timeout); // 🔹 Limpia el timeout si el usuario sigue escribiendo
    }
  }, [formData.nombre, formData.apellido]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      // 🔹 Validar duplicados antes de enviar
      const duplicateResponse = await fetch(`${API_URL}/api/curriculums/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: formData.nombre, apellido: formData.apellido, celular: formData.celular }),
      });

      const duplicateResult = await duplicateResponse.json();
      if (duplicateResult.error === "Duplicado" && duplicateResult.duplicadoEn === "nombre-apellido") {
        setShowConfirmDialog(true);
        setIsSubmitting(false);
        return;
      }

      // 🔹 Si no hay duplicados, proceder a enviar el formulario
      submitForm();
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

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "imagen" && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => formDataToSend.append(`${key}[]`, v));
        } else {
          formDataToSend.append(key, value || "");
        }
      });

      const response = await fetch(`${API_URL}/api/curriculums`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Error al crear el CV");

      const result = await response.json();
      toast({
        title: "Éxito",
        description: "El CV se creó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });

      navigate(`/ver-cv/${result.curriculum._id}`);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
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
       {/* 🔹 Confirmación si el nombre y apellido ya están registrados */}
    <AlertDialog
      isOpen={showConfirmDialog}
      leastDestructiveRef={null}
      onClose={() => setShowConfirmDialog(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Nombre y Apellido ya registrados
          </AlertDialogHeader>
          <AlertDialogBody>
            Ya hay un registro con este Nombre y Apellido. ¿Deseas continuar de todas formas?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={() => setShowConfirmDialog(false)}>Cancelar</Button>
            <Button colorScheme="red" onClick={() => {
              setShowConfirmDialog(false);
              submitForm();
            }} ml={3}>
              Sí, continuar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
    </div>
  );
};

export default CrearCvScreen;

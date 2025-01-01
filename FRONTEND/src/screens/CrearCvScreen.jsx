import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import FormularioCv from "../components/formulariocv/FormularioCv";
import { API_URL } from "../config";
import { Spinner, useToast } from "@chakra-ui/react";

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

  // Validación de duplicados en el backend
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
      console.error("Error al validar duplicados:", error); // Log del error
      return "Error al validar duplicados.";
    }
  };

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().min(3, "Debe tener al menos 3 caracteres").required("El nombre es obligatorio"),
    apellido: Yup.string()
      .min(2, "Debe tener al menos 2 caracteres")
      .required("El apellido es obligatorio")
      .test("check-duplicate", "Apellido ya está registrado.", async (value) => {
        const result = await validateDuplicate("apellido", value);
        return result === true;
      }),
    celular: Yup.string()
      .required("El teléfono celular es obligatorio")
      .test("check-duplicate", "Celular ya está registrado.", async (value) => {
        const result = await validateDuplicate("celular", value);
        return result === true;
      }),
      email: Yup.string()
      .email("Debe ser un email válido")
      .nullable(true) // Permitir que el campo exista aunque esté vacío
      .notRequired(), // No es obligatorio si así lo prefieres
    genero: Yup.string().oneOf(["Masculino", "Femenino", ""], "Opción inválida"),
    edad: Yup.number()
      .transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
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
      .required("La imagen o archivo es obligatorio"),
    rubro: Yup.string().required("El rubro es obligatorio"),
    puesto: Yup.string().required("El puesto es obligatorio"),
    subrubro: Yup.string(),
    lista: Yup.string().required("Debe seleccionar una lista"),
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "", // Asegurarte de que el valor nunca sea undefined
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value || "");
      });

      const response = await fetch(`${API_URL}/api/curriculums`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }

      toast({
        title: "Éxito",
        description: "CV creado exitosamente.",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });

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
        lista: "",
      });
      fileInputRef.current.value = "";
      navigate("/");
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        toast({
          title: "Error",
          description: "Error al crear el CV.",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mt-1">Ingresar Curriculum</h2>
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
          handleSubmit={handleSubmit}
          fileInputRef={fileInputRef}
        />
      </div>
    </div>
  );
};

export default CrearCvScreen;

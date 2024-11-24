import { useState, useRef } from "react";
import * as Yup from "yup";
import FormularioCv from "../components/formulariocv/FormularioCv";

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
  });

  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Spinner control
  const fileInputRef = useRef(null);

  // Esquema de validación
  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(3, "Debe tener al menos 3 caracteres")
      .required("El nombre es obligatorio"),
    apellido: Yup.string()
      .min(2, "Debe tener al menos 2 caracteres")
      .required("El apellido es obligatorio"),
    genero: Yup.string().oneOf(["Masculino", "Femenino", ""], "Opción inválida"),
    edad: Yup.number()
      .transform((value, originalValue) =>
        originalValue.trim() === "" ? null : value
      )
      .nullable()
      .typeError("Debe ingresar un número válido")
      .min(18, "Debe ser mayor o igual a 18 años")
      .max(100, "Debe ser menor o igual a 100 años"),
    celular: Yup.string().required("El teléfono celular es obligatorio"),
    pais: Yup.string().required("El país es obligatorio"),
    provincia: Yup.string().required("La provincia es obligatoria"),
    calificacion: Yup.string()
      .oneOf(["1- Muy bueno", "2- Bueno", "3- Regular"], "Opción inválida")
      .required("La calificación es obligatoria"),
    imagen: Yup.mixed()
      .test(
        "fileType",
        "El archivo debe ser una imagen JPG, JPEG, PNG o un PDF",
        (value) =>
          !value || ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(value.type)
      )
      .required("La imagen o archivo es obligatorio"),
  });

  // Manejar cambios en los campos del formulario
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    try {
      await validationSchema.validateAt(name, { ...formData, [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
    }
  };

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        imagen: "La imagen o archivo es obligatorio.",
      }));
      return;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxFileSize) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        imagen: "El archivo es demasiado grande. Máximo 5 MB.",
      }));
      return;
    }

    const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedFormats.includes(file.type)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        imagen: "Formato de archivo no permitido. Solo JPG, JPEG, PNG y PDF.",
      }));
      return;
    }

    setFormData((prevData) => ({ ...prevData, imagen: file }));
    setErrors((prevErrors) => ({ ...prevErrors, imagen: "" }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "imagen" && value instanceof File) {
          formDataToSend.append("imagen", value);
        } else {
          formDataToSend.append(key, value || "");
        }
      });

      const response = await fetch("http://localhost:5000/api/curriculums", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }

      setAlertMessage("Se creó el registro exitosamente.");
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
      });
      setErrors({});
      fileInputRef.current.value = ""; // Resetear el input de archivo
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setAlertMessage("Error al crear el CV. Por favor, intente de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOutsideClick = () => setAlertMessage("");

  return (
    <div onClick={handleOutsideClick}>
      <h2 className="text-2xl font-bold text-gray-800 mt-1">Ingresar CV</h2>
      {alertMessage && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {alertMessage}
        </div>
      )}
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
          <div className="w-12 h-12 border-4 border-[#293e68] border-t-transparent rounded-full animate-spin"></div>
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

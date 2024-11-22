import { useState } from "react";
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
    nivelEstudios: "",
    experiencia: "",
    idiomas: [],
    imagen: null,
    comentarios: "",
  });

  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");

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
      .nullable()
      .test(
        "is-optional-or-valid",
        "Debe ser mayor de 18 años si se ingresa",
        (value) => !value || value >= 18
      ),
    celular: Yup.string().required("El teléfono celular es obligatorio"),
    pais: Yup.string().required("El país es obligatorio"),
    provincia: Yup.string().required("La provincia es obligatoria"),
    imagen: Yup.mixed().required("La imagen o archivo es obligatorio"),
  });

  // Función para convertir archivos a Base64
  const convertirBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

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
  const handleFileChange = async (e) => {
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
        imagen: "Formato de archivo no permitido. Solo se permiten PDF, JPG y PNG.",
      }));
      return;
    }

    try {
      const base64Image = await convertirBase64(file);
      setFormData((prevData) => ({ ...prevData, imagen: base64Image }));
      setErrors((prevErrors) => ({ ...prevErrors, imagen: "" }));
    } catch (error) {
      console.error("Error al convertir archivo a base64:", error);
    }
  };

  // Manejar cambio de checkbox para idiomas
  const handleCheckboxChange = (language) => {
    setFormData((prevData) => {
      const idiomas = prevData.idiomas.includes(language)
        ? prevData.idiomas.filter((lang) => lang !== language)
        : [...prevData.idiomas, language];
      return { ...prevData, idiomas };
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const response = await fetch("http://localhost:5000/api/curriculums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }

      const data = await response.json();
      console.log("Respuesta de la API:", data);

      // Mostrar el mensaje de éxito
      setAlertMessage("¡Se creó el Registro correctamente!");

      // Mover la vista al tope de la pantalla
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Resetear formulario
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
        nivelEstudios: "",
        experiencia: "",
        idiomas: [],
        imagen: null,
        comentarios: "",
      });
      setErrors({});
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Ocultar alerta al hacer clic fuera de ella
  const handleOutsideClick = () => {
    setAlertMessage("");
  };

  return (
    <div onClick={handleOutsideClick}>
      <h2 className="text-2xl font-bold text-gray-800 mt-1">Ingresar CV</h2>
      {/* Mensaje de alerta */}
      {alertMessage && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {alertMessage}
        </div>
      )}
      <div className="flex bg-gray-100 py-4">
        <FormularioCv
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleCheckboxChange={handleCheckboxChange}
          handleSubmit={handleSubmit}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};

export default CrearCvScreen;

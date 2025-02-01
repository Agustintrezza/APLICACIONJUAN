import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioCv from "../components/formulariocv/FormularioCv";
import { API_URL } from "../config";
import { FaArrowLeft } from "react-icons/fa";
import { Skeleton, Spinner, useToast } from "@chakra-ui/react";
import * as Yup from "yup";

const EditarCvScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

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
    originalImagen: null, // Imagen original cargada
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCvData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/curriculums/${id}`);
        if (!response.ok) throw new Error("Error al cargar los datos del CV");
        const data = await response.json();

        setFormData({
          ...data,
          originalApellido: data.apellido || "",
          originalCelular: data.celular || "",
          originalNombre: data.nombre || "",
          originalGenero: data.genero || "",
          originalEdad: data.edad || "",
          originalPais: data.pais || "",
          originalProvincia: data.provincia || "",
          originalZona: data.zona || "",
          originalCalificacion: data.calificacion || "",
          originalRubro: data.rubro || "",
          originalPuesto: data.puesto || "",
          originalSubrubro: data.subrubro || "",
          originalIdiomas: data.idiomas || [],
          originalImagen: data.imagen || null,
          originalUbicacionManual: data.ubicacionManual || "",
          originalComentarios: data.comentarios || "", // Agregado
          originalTelefonoFijo: data.telefonoFijo || "", // Agregado
          originalExperiencia: data.experiencia || "", // Agregado
          originalNivelEstudios: data.nivelEstudios || "", // Agregado
        });
      } catch (error) {
        console.error("Error al cargar los datos del CV:", error);
        toast({
          title: "Error",
          description: "Hubo un problema al cargar los datos del CV.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCvData();
  }, [id, toast]);

  const validateDuplicate = async (field, value, excludeId) => {
    try {
      const response = await fetch(`${API_URL}/api/curriculums/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value, excludeId }),
      });

      if (!response.ok) {
        const result = await response.json();
        if (result.error === "Duplicado") {
          return `${
            field === "apellido" ? "Apellido" : "Celular"
          } ya está registrado.`;
        }
      }
      return true;
    } catch (error) {
      console.error("Error al validar duplicados:", error);
      return "Error al validar duplicados.";
    }
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(3, "Debe tener al menos 3 caracteres")
      .required("El nombre es obligatorio"),
    apellido: Yup.string()
    .min(3, "Debe tener al menos 2 caracteres")
    .required("El apellido es obligatorio"),
    celular: Yup.string()
      .required("El teléfono celular es obligatorio")
      .matches(/^\d+$/, "El teléfono celular debe contener solo números") // Validación  para solo números
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
      .oneOf(["Masculino", "Femenino", ""], "Género inválido") // No es obligatorio, así que no es necesario usar `.required()`
      .default(""),
    pais: Yup.string()
      .required("El país es obligatorio")
      .oneOf(
        ["Argentina", "Estados Unidos", "Chile", "Uruguay", "Brasil"],
        "Seleccione un país válido"
      ),
    provincia: Yup.string()
      .nullable()
      .when("pais", {
        is: "Argentina",
        then: () =>
          Yup.string().required("La provincia es obligatoria para Argentina"),
        otherwise: () => Yup.string().notRequired(),
      }),
    edad: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .nullable()
      .typeError("Debe ingresar un número válido")
      .min(18, "Debe ser mayor o igual a 18 años")
      .max(100, "Debe ser menor o igual a 100 años"),
    calificacion: Yup.string()
      .oneOf(["1- Muy bueno", "2- Bueno", "3- Regular"], "Opción inválida")
      .required("La calificación es obligatoria"),
    rubro: Yup.string().required("El rubro es obligatorio"),
    puesto: Yup.string().required("El puesto es obligatorio"),
    subrubro: Yup.string(),
    // imagen: Yup.mixed()
    //   .test("fileType", "El archivo debe ser una imagen JPG, JPEG, PNG o un PDF", (value) =>
    //     !value || ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(value?.type)
    //   )
    //   .test("required-if-no-existing", "La imagen o archivo es obligatorio", function (value) {
    //     const { originalImagen } = this.parent;
    //     return originalImagen || value;
    //   }),
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Actualizar el estado del formulario
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    try {
      // Validar el campo modificado
      await validationSchema.validateAt(name, {
        ...formData,
        [name]: value,
        id,
      });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Limpiar errores si la validación pasa
    } catch (validationError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationError.message,
      })); // Actualizar error
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      imagen: file,
    }));
  };

  const handleCheckboxChange = (language) => {
    setFormData((prevData) => {
      const updatedIdiomas = prevData.idiomas.includes(language)
        ? prevData.idiomas.filter((idioma) => idioma !== language) // Elimina si ya está seleccionado
        : [...prevData.idiomas, language]; // Agrega si no está seleccionado
      return { ...prevData, idiomas: updatedIdiomas };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Verificar si la imagen cambió
      const isImageChanged =
        (formData.imagen && formData.imagen instanceof File) || // Nueva imagen cargada
        (!formData.imagen && formData.originalImagen !== formData.imagen); // URL de imagen cambió

      console.log("¿Imagen cambió?:", isImageChanged);

      // Verificar si el formulario cambió
      const isUnchanged =
      formData.apellido === formData.originalApellido &&
      formData.celular === formData.originalCelular &&
      formData.nombre === formData.originalNombre &&
      (formData.genero === formData.originalGenero || formData.genero === "") &&
      (formData.edad === formData.originalEdad || formData.edad === null) &&
      formData.pais === formData.originalPais &&
      formData.provincia === formData.originalProvincia &&
      formData.zona === formData.originalZona &&
      formData.calificacion === formData.originalCalificacion &&
      formData.rubro === formData.originalRubro &&
      formData.puesto === formData.originalPuesto &&
      formData.subrubro === formData.originalSubrubro &&
      formData.ubicacionManual === formData.originalUbicacionManual &&
      JSON.stringify(formData.idiomas) === JSON.stringify(formData.originalIdiomas) &&
      formData.comentarios === formData.originalComentarios && // Agregado
      formData.telefonoFijo === formData.originalTelefonoFijo && // Agregado
      formData.experiencia === formData.originalExperiencia && // Agregado
      formData.nivelEstudios === formData.originalNivelEstudios && // Agregado
      !isImageChanged;

      console.log("Resultado de isUnchanged:", isUnchanged);

      if (isUnchanged) {
        console.log("Formulario sin cambios. Mostrando toast de información.");
        toast({
          title: "Sin cambios",
          description: "No se realizaron cambios en el curriculum.",
          status: "info", // Azul cuando no hubo cambios
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        setIsSubmitting(false);
        navigate(`/ver-cv/${id}`);
        return;
      }

      // Validar formulario
      console.log("Validando formulario...");
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("Validación exitosa.");

      // Preparar datos para enviar
      const formDataToSend = new FormData();
      const sanitizedIdiomas = Array.isArray(formData.idiomas)
        ? formData.idiomas
            .filter((idioma) => typeof idioma === "string")
            .map((idioma) => idioma.trim())
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

      console.log("Datos preparados para envío al backend:", [
        ...formDataToSend.entries(),
      ]);

      const response = await fetch(`${API_URL}/api/curriculums/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Error al actualizar el CV");

      toast({
        title: "Éxito",
        description: "El CV se actualizó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });

      navigate(`/ver-cv/${id}`);
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
        description: "Hubo un problema al actualizar el CV.",
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
    <div className="w-full">
      {/* Título y botón de regresar */}
      <div className="bg-transparent mb-4">
        <div className="flex items-center gap-4">
          {isLoading ? (
            ""
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
  );
};

export default EditarCvScreen;

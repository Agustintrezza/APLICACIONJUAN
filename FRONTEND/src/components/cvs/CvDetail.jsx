import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Asignaciones from "./Asignaciones";
import {
  FaArrowLeft,
  FaShareAlt,
  FaTrashAlt,
  FaPhoneSlash,
  FaPencilAlt,
} from "react-icons/fa";
import {
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { API_URL } from "../../config";
import FloatingButtonCvDetail from "../floating-buttons/FlotatingButtonCvDetail";

const CvDetail = ({ cv, onToggleNoLlamar }) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingNoLlamar, setIsUpdatingNoLlamar] = useState(false);
  const [isNoLlamarDialogOpen, setIsNoLlamarDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1026);
  const cancelRef = useRef();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cvData, setCvData] = useState(cv);

  const toggleSidebar = () => {
    console.log("Toggling Sidebar"); // Para depuración
    setIsSidebarOpen((prev) => !prev);
  };
  useEffect(() => {
    setCvData(cv); // Actualiza el estado interno cuando cambian los props
  }, [cv]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1026);
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [cv]);

  const getValueOrDefault = (value) =>
    value !== undefined && value !== null && value !== "" ? value : "-";

  const isImage = (url) => /\.(jpg|jpeg|png)$/i.test(url);
  const isPDF = (url) => /\.pdf$/i.test(url);

  const getPDFThumbnail = (url) => {
    if (isPDF(url)) {
      const parts = url.split("/upload/");
      return `${parts[0]}/upload/w_150,h_150,c_fit/${parts[1].replace(
        ".pdf",
        ".jpg"
      )}`;
    }
    return null;
  };

  const onBack = () => {
    navigate("/curriculums"); // Navega a la ruta '/curriculums'
  };

  const handleDeleteCv = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/curriculums/${cv._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el CV");
      }

      toast({
        title: "Éxito",
        description: "El CV se eliminó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/");
    } catch {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el CV.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  const handleListTagClick = (listId) => {
    navigate(`/listas/${listId}`, { state: { from: `/ver-cv/${cv._id}` } });
  };

  const handleToggleNoLlamar = async () => {
    if (!cv || !cv._id) return;
    setIsUpdatingNoLlamar(true);
    try {
      const updatedNoLlamar = !cvData.noLlamar;
      const response = await fetch(
        `${API_URL}/api/curriculums/${cvData._id}/no-llamar`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noLlamar: updatedNoLlamar }),
        }
      );

      if (!response.ok)
        throw new Error("Error al actualizar el estado de No Llamar");

      setCvData((prev) => ({ ...prev, noLlamar: updatedNoLlamar }));
      toast({
        title: "Éxito",
        description: "El estado de 'No Llamar' se actualizó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar el estado de No Llamar:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de 'No Llamar'.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdatingNoLlamar(false);
      setIsNoLlamarDialogOpen(false);
    }
  };

  const formatWhatsappMessage = () => {
    const message = `
      🚀 *Curriculum Vitae* 🚀
      ${getValueOrDefault(cv.nombre)}
      ${getValueOrDefault(cv.apellido)}
      ${getValueOrDefault(cv.imagen)}
          `;
    return encodeURIComponent(message.trim());
  };

  const handleWhatsappShare = () => {
    const message = formatWhatsappMessage();
    const whatsappUrl = `https://wa.me/1132368312?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const renderAssignedLists = () => (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-[#293e68] mb-2">
        Listas Asignadas
      </h3>
      <div className="flex flex-wrap gap-2">
        {cvData.listas.length > 0 ? (
          cvData.listas.map((list) => (
            <Tag
              key={list._id}
              bg={list.color}
              color="white"
              borderRadius="full"
              className="flex items-center cursor-pointer"
              onClick={() => handleListTagClick(list._id)}
            >
              <TagLabel>{list.cliente || "Sin nombre"}</TagLabel>
            </Tag>
          ))
        ) : (
          <p className="text-sm text-gray-600">No asignado a ninguna lista.</p>
        )}
      </div>
    </div>
  );

  if (!cv) {
    return <p>CV no encontrado.</p>; // Si no se pasa un CV, mostramos un mensaje de error.
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-300 w-5/5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#293e68]">
          {isDataLoading ? (
            <Skeleton width={150} height={40} />
          ) : (
            `${getValueOrDefault(cv.nombre)} ${getValueOrDefault(cv.apellido)}`
          )}
        </h2>
        <div className="flex gap-4">
          {isDataLoading ? (
            isDesktop ? (
              <>
                <Skeleton width={100} height={40} />{" "}
                {/* Botones de escritorio */}
                <Skeleton width={100} height={40} />
                <Skeleton width={100} height={40} />
                <Skeleton width={100} height={40} />
              </>
            ) : (
              <div className="flex gap-2 me-10">
                <Skeleton width={40} height={40} circle={true} />{" "}
                {/* Botones redondos */}
                <Skeleton width={40} height={40} circle={true} />
              </div>
            )
          ) : isDesktop ? (
            <>
              <Button
                leftIcon={<FaArrowLeft />}
                onClick={onBack}
                bg="#293e68"
                color="white"
                _hover={{ bg: "#1f2d4b" }}
              >
                Volver
              </Button>
              <button
                className="bg-[#293e68] text-white px-4 py-2 rounded-lg"
                onClick={() => navigate(`/editar-cv/${cv._id}`)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsDialogOpen(true)}
              >
                Eliminar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handleWhatsappShare}
              >
                WhatsApp
              </button>
              <button
                onClick={onToggleNoLlamar}
                className={`p-3 text-white rounded-full ${
                  cv.noLlamar ? "bg-red-500" : "bg-gray-500"
                }`}
                title={
                  cv.noLlamar
                    ? "Marcado como No Llamar"
                    : "No está marcado como No Llamar"
                }
              >
                <FaPhoneSlash />
              </button>
            </>
          ) : (
            <div className="me-8">
              <div className="mb-2 gap-2 flex">
                <button
                  onClick={onBack}
                  className="p-2 bg-blue-500 text-white rounded-full"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={() => navigate(`/editar-cv/${cv._id}`)}
                  className="p-2 bg-blue-500 text-white rounded-full"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="p-2 bg-red-500 text-white rounded-full"
                >
                  <FaTrashAlt />
                </button>
              </div>
              <div className="mb-2 gap-2 flex">
                <button
                  onClick={onToggleNoLlamar}
                  className={`p-2 text-white rounded-full ${
                    cv.noLlamar ? "bg-red-500" : "bg-gray-500"
                  }`}
                  title={
                    cv.noLlamar
                      ? "Marcado como No Llamar"
                      : "No está marcado como No Llamar"
                  }
                >
                  <FaPhoneSlash />
                </button>
                <button
                  onClick={handleWhatsappShare}
                  className="p-2 bg-green-500 text-white rounded-full"
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isDesktop && (
        <FloatingButtonCvDetail
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      )}
      {isSidebarOpen && (
        <div className="w-full">
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          ></div>
          <div className="fixed top-0 right-0 h-full w-80 bg-blue-100 shadow-lg z-50 overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Asignaciones
              </h3>
              <button onClick={toggleSidebar} title="Cerrar">
                ✖
              </button>
            </div>
            <div>
              <p className="text-sm mb-4 font-semibold text-gray-800">
                Asigná y desasigná el curriculum a las listas
              </p>
            </div>

            <Asignaciones
              curriculumId={cvData._id}
              onUpdateCvLists={(updatedLists) => {
                setCvData((prev) => ({
                  ...prev,
                  listas: updatedLists,
                }));
              }}
            />
          </div>
        </div>
      )}
      <AlertDialog
        isOpen={isNoLlamarDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsNoLlamarDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {cv.noLlamar ? "Quitar No Llamar" : "Marcar No Llamar"}
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro que deseas {cv.noLlamar ? "quitar" : "marcar"} este
              CV como {cv.noLlamar ? "`No" : "`No"} Llamar`?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsNoLlamarDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleToggleNoLlamar}
                ml={3}
                isLoading={isUpdatingNoLlamar}
              >
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <div className="mb-6">{renderAssignedLists()}</div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          {isDataLoading ? (
            <Skeleton count={7} height={20} className="mb-2" />
          ) : (
            <>
              <p className="text-sm text-gray-600">
                <strong>Edad:</strong> {getValueOrDefault(cv.edad)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Género:</strong> {getValueOrDefault(cv.genero)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Teléfono Fijo:</strong>{" "}
                {getValueOrDefault(cv.telefonoFijo)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Celular:</strong> {getValueOrDefault(cv.celular)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {getValueOrDefault(cv.email)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>País:</strong> {getValueOrDefault(cv.pais)}
              </p>
              {cv.pais === "Argentina" && (
                <p className="text-sm text-gray-600">
                  <strong>Provincia:</strong> {getValueOrDefault(cv.provincia)}
                </p>
              )}
              {cv.provincia !== "Buenos Aires" && (
                <p className="text-sm text-gray-600">
                  <strong>Ubicación Manual:</strong>{" "}
                  {getValueOrDefault(cv.ubicacionManual)}
                </p>
              )}

              {cv.pais === "Argentina" && cv.provincia === "Buenos Aires" && (
                <p className="text-sm text-gray-600">
                  <strong>Localidad:</strong> {getValueOrDefault(cv.localidad)}
                </p>
              )}
              {cv.pais === "Argentina" && cv.provincia === "Buenos Aires" && (
                <p className="text-sm text-gray-600">
                  <strong>Zona:</strong> {getValueOrDefault(cv.zona)}
                </p>
              )}
            </>
          )}
        </div>
        <div>
          {isDataLoading ? (
            <Skeleton count={7} height={20} className="mb-2" />
          ) : (
            <>
              <p className="text-sm text-gray-600">
                <strong>Rubro:</strong> {getValueOrDefault(cv.rubro)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Subrubro:</strong> {getValueOrDefault(cv.puesto)}
              </p>
              {cv.rubro === "Gastronomía" && cv.subrubro && (
                <p className="text-sm text-gray-600">
                  <strong>Puesto:</strong> {getValueOrDefault(cv.subrubro)}
                </p>
              )}

              <p className="text-sm text-gray-600">
                <strong>Calificación:</strong>{" "}
                {getValueOrDefault(cv.calificacion)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Nivel de Estudios:</strong>{" "}
                {getValueOrDefault(cv.nivelEstudios)}
              </p>
              <p className="text-sm text-gray-600"></p>
              <p className="text-sm text-gray-600">
                <strong>Experiencia:</strong>{" "}
                {getValueOrDefault(cv.experiencia)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Idiomas:</strong>{" "}
                {getValueOrDefault(cv.idiomas?.filter((i) => i).join(", "))}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Comentarios:</strong>{" "}
                {getValueOrDefault(cv.comentarios)}
              </p>
            </>
          )}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#293e68] mb-4">Archivo</h3>
        {isDataLoading ? (
          <Skeleton height={240} width={240} borderRadius="8px" />
        ) : (
          <>
            {isImage(cv.imagen) && (
              <div className="w-10/12">
                <a href={cv.imagen} target="_blank" rel="noopener noreferrer">
                  <img
                    src={cv.imagen}
                    alt="Archivo del CV"
                    className={`rounded-md shadow-md transition-transform transform hover:scale-105 cursor-pointer ${
                      isDesktop ? "w-60 h-60 object-cover" : "w-full h-auto"
                    }`}
                  />
                </a>
              </div>
            )}
            {isPDF(cv.imagen) && (
              <a href={cv.imagen} target="_blank" rel="noopener noreferrer">
                <img
                  src={getPDFThumbnail(cv.imagen)}
                  alt="Archivo PDF del CV"
                  className={`rounded-md shadow-md transition-transform transform hover:scale-105 cursor-pointer ${
                    isDesktop ? "w-60 h-60 object-cover" : "w-full h-auto"
                  }`}
                />
              </a>
            )}
          </>
        )}
      </div>
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar eliminación
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar este CV? Esta acción no se
              puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteCv}
                ml={3}
                isLoading={isDeleting}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

CvDetail.propTypes = {
  cv: PropTypes.object.isRequired,
  onToggleNoLlamar: PropTypes.func.isRequired,
};

export default CvDetail;

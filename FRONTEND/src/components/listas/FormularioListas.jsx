import { useState, useEffect } from "react"
import { Input, Textarea, Button, FormLabel, useToast, Skeleton } from "@chakra-ui/react"
import PropTypes from "prop-types"
import { API_URL } from "../../config"

const FormularioListas = ({ onCreate, listaToEdit, onUpdate }) => {
  const [formData, setFormData] = useState({
    posicion: "",
    cliente: "",
    comentario: "",
    fechaLimite: "",
    color: "#E53E3E",
  })
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (listaToEdit) {
      setFormData({
        posicion: listaToEdit.posicion || "",
        cliente: listaToEdit.cliente || "",
        comentario: listaToEdit.comentario || "",
        fechaLimite: listaToEdit.fechaLimite || "",
        color: listaToEdit.color || "#E53E3E",
      })
    } else {
      // Reiniciar el formulario cuando no haya una lista seleccionada
      setFormData({
        posicion: "",
        cliente: "",
        comentario: "",
        fechaLimite: "",
        color: "#E53E3E",
      })
    }
  }, [listaToEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = listaToEdit
        ? `${API_URL}/api/listas/${listaToEdit._id}`
        : `${API_URL}/api/listas`
      const method = listaToEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error(listaToEdit ? "Error al actualizar la lista" : "Error al crear la lista")

      const updatedLista = await response.json()

      toast({
        title: "Éxito",
        description: listaToEdit ? "Lista actualizada correctamente" : "Lista creada correctamente",
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      if (listaToEdit) {
        onUpdate(updatedLista)
      } else {
        onCreate(updatedLista)
      }
    } catch {
      toast({
        title: "Error",
        description: listaToEdit ? "No se pudo actualizar la lista" : "No se pudo crear la lista",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const colors = ["#E53E3E", "#3E8FE5", "#FFB042", "#FFF01A", "#51E302", "#8FE3FF"]

  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, color }))
  }

  if (isLoading) return <Skeleton height="400px" />

  return (
    <div
      className="w-5/5 xl:w-1/5"
      style={{ position: "sticky", top: "0px", maxHeight: "100vh", overflowY: "auto" }}
    >
      <div className="border border-blue-300 bg-[#e9f0ff] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#293e68]">
          {listaToEdit ? "Editar Lista" : "Crear nueva Lista"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormLabel>Posición</FormLabel>
            <Input
              placeholder="Posición"
              value={formData.posicion}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, posicion: e.target.value }))
              }
              borderColor="#8bb1ff"
              focusBorderColor="#293e68"
            />
          </div>
          <div>
            <FormLabel>Cliente</FormLabel>
            <Input
              placeholder="Cliente"
              value={formData.cliente}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cliente: e.target.value }))
              }
              borderColor="#8bb1ff"
              focusBorderColor="#293e68"
            />
          </div>
          <div>
            <FormLabel>Comentario</FormLabel>
            <Textarea
              placeholder="Comentario"
              value={formData.comentario}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comentario: e.target.value }))
              }
              borderColor="#8bb1ff"
              focusBorderColor="#293e68"
            />
          </div>
          <div>
            <FormLabel>Fecha Límite</FormLabel>
            <Input
              type="date"
              value={formData.fechaLimite}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fechaLimite: e.target.value }))
              }
              borderColor="#8bb1ff"
              focusBorderColor="#293e68"
            />
          </div>
          <div>
            <FormLabel>Color</FormLabel>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: color,
                    borderRadius: "50%",
                    border: formData.color === color ? "2px solid black" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            bg="#293e68"
            color="white"
            _hover={{ bg: "#1f2d4b" }}
            className="w-full"
          >
            {listaToEdit ? "Guardar Cambios" : "Crear Lista"}
          </Button>
        </form>
      </div>
    </div>
  )
}

FormularioListas.propTypes = {
  onCreate: PropTypes.func.isRequired,
  listaToEdit: PropTypes.object,
  onUpdate: PropTypes.func,
}

export default FormularioListas

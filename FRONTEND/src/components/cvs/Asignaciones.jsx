import { useState, useEffect } from "react"
import Select from "react-select"
import { Spinner, useToast } from "@chakra-ui/react"
import { API_URL } from "../../config"
import PropTypes from "prop-types"

const Asignaciones = ({ curriculumId, onUpdateCvLists }) => {
  const [lists, setLists] = useState([])
  const [selectedLists, setSelectedLists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listsResponse = await fetch(`${API_URL}/api/listas`)
        if (!listsResponse.ok) throw new Error("Error al cargar las listas")
        const listsData = await listsResponse.json()

        const curriculumResponse = await fetch(`${API_URL}/api/curriculums/${curriculumId}`)
        if (!curriculumResponse.ok) throw new Error("Error al cargar el curriculum")
        const curriculumData = await curriculumResponse.json()

        const mappedLists = listsData.map((list) => ({
          value: list._id,
          label: list.cliente || "Sin nombre",
          color: list.color,
        }))

        const assignedLists = curriculumData.listas.map((list) => ({
          value: list._id,
          label: list.cliente || "Sin nombre",
          color: list.color,
        }))

        setLists(mappedLists)
        setSelectedLists(assignedLists)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos",
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [curriculumId, toast])

  const handleChange = async (selectedOptions) => {
    const listIds = selectedOptions.map((option) => option.value)
    setSelectedLists(selectedOptions)

    try {
      const response = await fetch(`${API_URL}/api/curriculums/${curriculumId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listIds }),
      })

      if (!response.ok) throw new Error("Error al actualizar las listas seleccionadas")

      toast({
        title: "Éxito",
        description: "Curriculum actualizado correctamente",
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      // Actualizar listas en tiempo real
      onUpdateCvLists(selectedOptions.map((option) => ({ _id: option.value, cliente: option.label, color: option.color })))
    } catch (error) {
      console.error("Error al asignar el curriculum:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el curriculum",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const customOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          width: "10px",
          height: "10px",
          backgroundColor: data.color,
          borderRadius: "50%",
          marginRight: "8px",
        }}
      ></span>
      {data.label}
    </div>
  )

  const customSingleValue = ({ data }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{
          width: "10px",
          height: "10px",
          backgroundColor: data.color,
          borderRadius: "50%",
          marginRight: "8px",
        }}
      ></span>
      {data.label}
    </div>
  )

  return (
    <div
      className="w-full h-full"
      style={{ position: "sticky", top: "0", maxHeight: "100vh", overflowY: "auto" }}
    >
      <div className="border border-blue-300 bg-[#e9f0ff] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#293e68]">Asignaciones</h3>
        {isLoading ? (
          <Spinner size="lg" color="blue.500" />
        ) : (
          <Select
            isMulti
            value={selectedLists}
            onChange={handleChange}
            options={lists}
            components={{ Option: customOption, SingleValue: customSingleValue }}
            placeholder="Seleccionar listas"
            className="w-full"
          />
        )}
      </div>
    </div>
  )
}

Asignaciones.propTypes = {
  curriculumId: PropTypes.string.isRequired,
  onUpdateCvLists: PropTypes.func.isRequired,
}

export default Asignaciones
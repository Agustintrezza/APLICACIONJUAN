import { useState, useEffect } from "react"
import CvDetail from "./CvDetail"
import Asignaciones from "./Asignaciones"
import { API_URL } from "../../config"
import { Spinner, useToast } from "@chakra-ui/react"
import PropTypes from "prop-types"

const CvContainer = ({ curriculumId }) => {
  const [cvData, setCvData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchCvData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/curriculums/${curriculumId}`)
        if (!response.ok) throw new Error("Error al cargar el curriculum")
        const data = await response.json()
        setCvData(data)
      } catch (error) {
        console.error("Error al cargar datos del CV:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del CV",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCvData()
  }, [curriculumId, toast])

  const handleUpdateCvLists = (updatedLists) => {
    if (cvData) {
      setCvData((prevData) => ({ ...prevData, listas: updatedLists }))
    }
  }

  if (isLoading) {
    return <Spinner size="lg" />
  }

  return (
    <div className="flex">
      <CvDetail cv={cvData} />
      <Asignaciones curriculumId={curriculumId} onUpdateCvLists={handleUpdateCvLists} />
    </div>
  )
}

CvContainer.propTypes = {
  curriculumId: PropTypes.string.isRequired,
}

export default CvContainer

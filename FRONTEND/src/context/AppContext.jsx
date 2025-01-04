import PropTypes from "prop-types"
import { useState, createContext } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import { useCallback } from "react"

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const navigate = useNavigate()

  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("user"),
    isSidebarExpanded: true,
    favoritos: [],
    listas: [],
  })

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setState({
      ...state,
      user: userData,
      isAuthenticated: true,
    })
    navigate("/")
  }

  const logout = () => {
    localStorage.removeItem("user")
    setState({
      ...state,
      user: null,
      isAuthenticated: false,
      favoritos: [],
      listas: [],
    })
    navigate("/signin")
  }

  const toggleSidebar = () => {
    setState((prevState) => ({
      ...prevState,
      isSidebarExpanded: !prevState.isSidebarExpanded,
    }))
  }

  const loadLists = useCallback(async () => {
    try {
      console.log("AppContext: Cargando listas desde el backend...")
      const response = await fetch(`${API_URL}/api/listas`)
      if (!response.ok) throw new Error("Error al cargar las listas")
      const data = await response.json()
      console.log("AppContext: Listas cargadas:", data)
      setState((prevState) => ({ ...prevState, listas: data }))
    } catch (error) {
      console.error("AppContext: Error al cargar listas:", error)
    }
  }, [])

  const createList = async (newList) => {
    try {
      console.log("Iniciando creación de lista con datos:", newList)
      const response = await fetch(`${API_URL}/api/listas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.error || "Error al crear la lista")
      console.log("Lista creada con éxito, recargando listas...")
      await loadLists()
      return result.data
    } catch (error) {
      console.error("Error al crear lista:", error)
      throw error
    }
  }

  const updateList = async (id, updatedData) => {
    console.log("AppContext: Actualizando lista con ID:", id, "y datos:", updatedData)
    try {
      const response = await fetch(`${API_URL}/api/listas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (!response.ok) throw new Error("Error al actualizar la lista")
  
      const updatedList = await response.json()
      console.log("AppContext: Lista actualizada con éxito:", updatedList)
  
      // Actualizar estado global
      setState((prevState) => ({
        ...prevState,
        listas: prevState.listas.map((lista) =>
          lista._id === id ? updatedList : lista
        ),
      }))
  
      await loadLists() // Refrescar listas para asegurar sincronización global
      return updatedList
    } catch (error) {
      console.error("AppContext: Error al actualizar lista:", error)
      throw error
    }
  }

  const deleteList = async (listId) => {
    try {
      console.log("Eliminando lista con ID:", listId)
      const response = await fetch(`${API_URL}/api/listas/${listId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar la lista")
      console.log("Lista eliminada con éxito")
      setState((prevState) => ({
        ...prevState,
        listas: prevState.listas.filter((list) => list._id !== listId),
      }))
    } catch (error) {
      console.error("Error al eliminar lista:", error)
      throw error
    }
  }
  console.log('Hola')

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        toggleSidebar,
        loadLists,
        createList,
        updateList,
        deleteList,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
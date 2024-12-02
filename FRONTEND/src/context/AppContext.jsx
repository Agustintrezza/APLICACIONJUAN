// src/context/AppContext.js
import PropTypes from "prop-types"
import { useState, createContext } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const navigate = useNavigate()

  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("user"),
    isSidebarExpanded: true,
    favoritos: [],
    listas: [], // Estado inicial de listas
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

  const addToFavorites = (cv) => {
    setState((prevState) => ({
      ...prevState,
      favoritos: [...prevState.favoritos, cv],
    }))
  }

  const removeFromFavorites = (cvId) => {
    setState((prevState) => ({
      ...prevState,
      favoritos: prevState.favoritos.filter((cv) => cv.id !== cvId),
    }))
  }

  // Funciones para manejar las listas
  const loadLists = async () => {
    try {
      const response = await fetch(`${API_URL}/api/listas`)
      if (!response.ok) throw new Error("Error al cargar las listas")
      const data = await response.json()
      setState((prevState) => ({ ...prevState, listas: data }))
    } catch (error) {
      console.error("Error al cargar listas:", error)
    }
  }

  const createList = async (newList) => {
    try {
      const response = await fetch(`${API_URL}/api/listas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList),
      })
      if (!response.ok) throw new Error("Error al crear la lista")
      const createdList = await response.json()
      setState((prevState) => ({
        ...prevState,
        listas: [...prevState.listas, createdList],
      }))
    } catch (error) {
      console.error("Error al crear lista:", error)
    }
  }

  const updateList = async (listId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/api/listas/${listId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (!response.ok) throw new Error("Error al actualizar la lista")
      const updatedList = await response.json()
      setState((prevState) => ({
        ...prevState,
        listas: prevState.listas.map((list) =>
          list._id === updatedList._id ? updatedList : list
        ),
      }))
    } catch (error) {
      console.error("Error al actualizar lista:", error)
    }
  }

  const deleteList = async (listId) => {
    try {
      const response = await fetch(`${API_URL}/api/listas/${listId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar la lista")
      setState((prevState) => ({
        ...prevState,
        listas: prevState.listas.filter((list) => list._id !== listId),
      }))
    } catch (error) {
      console.error("Error al eliminar lista:", error)
    }
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        toggleSidebar,
        addToFavorites,
        removeFromFavorites,
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

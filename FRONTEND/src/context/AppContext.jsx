// src/context/AppContext.js
import PropTypes from 'prop-types';
import { useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    isSidebarExpanded: true,
    favoritos: [], // Estado inicial de favoritos
  });

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setState({
      ...state,
      user: userData,
      isAuthenticated: true,
    });
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('user');
    setState({
      ...state,
      user: null,
      isAuthenticated: false,
      favoritos: [],
    });
    navigate('/signin');
  };

  const toggleSidebar = () => {
    setState((prevState) => ({
      ...prevState,
      isSidebarExpanded: !prevState.isSidebarExpanded,
    }));
  };

  const addToFavorites = (cv) => {
    setState((prevState) => ({
      ...prevState,
      favoritos: [...prevState.favoritos, cv],
    }));
  };

  const removeFromFavorites = (cvId) => {
    setState((prevState) => ({
      ...prevState,
      favoritos: prevState.favoritos.filter((cv) => cv.id !== cvId),
    }));
  };

  return (
    <AppContext.Provider value={{ ...state, login, logout, toggleSidebar, addToFavorites, removeFromFavorites }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

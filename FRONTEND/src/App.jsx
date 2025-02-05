// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import SignInScreen from './screens/SignInScreen';
import ProtectedRoute from './components/ProtectedRoutes';
import PublicRoute from './components/PublicRoutes';
import Layout from './components/layout/Layout';
import Home from './screens/HomeScreen';
import CrearCvScreen from './screens/CrearCvScreen'
import PerfilScreen from './screens/PerfilScreen'
import ComunicacionesScreen from './screens/ComunicacionesScreen'
import FavoritosScreen from './screens/FavoritosScreen';
import VerCvScreen from './screens/VerCvScreen'
import EditarCvScreen from "./screens/EditarCvScreen";
import ListasScreen from './screens/ListasContainerScreen';
import ListasDetailScreen from './components/listas/ListasDetailScreen'

function AppContent() {
  return (
    <Routes>
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <SignInScreen />
          </PublicRoute>
        }
      />
      
      {/* Rutas protegidas dentro del Layout - PRUEBA*/}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Home />} />
        <Route path="/crear-cv" element={<CrearCvScreen/>} />
        <Route path="/editar-cv/:id" element={<EditarCvScreen />} />
        <Route path="/listas" element={<ListasScreen />} />
        <Route path="/perfil" element={<PerfilScreen/>} />
        <Route path="/ver-cv/:id" element={<VerCvScreen />} />
        <Route path="/comunicaciones" element={<ComunicacionesScreen/>} />
        <Route path="/favoritos" element={<FavoritosScreen/>} />
        <Route path="/listas/:id" element={<ListasDetailScreen />} />

      </Route>

      {/* Redirige cualquier ruta desconocida a la principal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;

import React, { useEffect } from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import JuradoPage from './pages/JuradoPage';
import NotFound from './pages/NotFound';
import SemestrePage from './pages/SemestrePage';
import FacultadPage from './pages/FacultadPage';
import UsuariosPage from './pages/UsuariosPage';
import GrupoPage from './pages/GrupoPage';
import NuevaPage from './pages/NuevaPage';

import { UserProvider,useUser } from './contexts/UserContext';

const App = () => {
  const { user, setUser } = useUser();

  useEffect(() => {
    // Cargar el usuario desde sessionStorage si existe
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  return (
    <div className="h-screen">
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/jurado" element={<JuradoPage />} />
        <Route path="/facultad" element={<FacultadPage />} />

        <Route path="*" element={<NotFound />} />
        <Route path="/semestre" element={<SemestrePage />} />
        <Route path="/usuario" element={<UsuariosPage />} />
        <Route path="/grupo" element={<GrupoPage />} />
        <Route path="/nueva-pagina" element={<NuevaPage />} />

      </Routes>
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default AppWrapper;

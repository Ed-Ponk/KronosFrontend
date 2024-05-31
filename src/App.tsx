import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import JuradoPage from './pages/JuradoPage';
import NotFound from './pages/NotFound';
import PrivateRoute from './routes/PrivateRoutes';
import AdminRoutes from './routes/AdminRoutes';
import JuradoRoutes from './routes/JuradoRoutes';
import { useAuth } from './contexts/AuthContext';
import SemestrePage from './pages/SemestrePage';
import UsuariosPage from './pages/UsuariosPage';

const App = () => {
  const { user } = useAuth();

  return (
    <div className="h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />}>
          {user?.role === 'admin' && (
            <Route path="admin/*" element={<AdminPage />}>
              <Route path="/*" element={<AdminRoutes />} />
            </Route>
          )}
          {user?.role === 'jurado' && (
            <Route path="jurado/*" element={<JuradoPage />}>
              <Route path="/*" element={<JuradoRoutes />} />
            </Route>
          )}
        </Route>

        <Route path="/jurado" element={<JuradoPage />} />

        <Route path="*" element={<NotFound />} />
        <Route path="/semestre" element={<SemestrePage />} />
        <Route path="/usuario" element={<UsuariosPage />} />


      </Routes>
    </div>
  );
};

export default App;

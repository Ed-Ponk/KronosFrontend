import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import UsuariosPage from './UsuariosPage';
import SemestrePage from './SemestrePage'; // Importa tu otra página aquí
import GrupoPage from './GrupoPage';

import { useUser } from '../contexts/UserContext';
import JuradoComponent from '../components/jurado/JuradoComponent';

const AdminPage: React.FC = () => {
  const { user } = useUser();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('currentPage') || 'Home');

  const changePage = (page: string) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, []);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Usuarios':
        return <UsuariosPage />;
      case 'Semestres':
        return <SemestrePage />;
      case 'Jurado':
        return <JuradoComponent />;
      case 'Grupo':
        return <GrupoPage />;

      default:
        return <UsuariosPage />;
    }
  };

  if (!user) {
    return (
      <div>
        <p>Usted no se ha identificado</p>
        <div>
          <a href="/login">
            <button>Login</button>
          </a>
        </div>
      </div>
    );
  }

  if (user.rol !== 'Administrador') {
    return (
      <div>
        <p>No tiene permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className='flex h-screen'>
      <Sidebar 
        isSideMenuOpen={isSideMenuOpen} 
        toggleSideMenu={toggleSideMenu} 
        setCurrentPage={changePage} // Usa la función changePage aquí
        currentPage={currentPage} // Pasa la página actual
      />
      <div className='flex flex-col flex-1 w-full'>
        <Navbar toggleSideMenu={toggleSideMenu} />
        <div className='flex-1 overflow-auto h-full'>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

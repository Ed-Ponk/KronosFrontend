import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import UsuariosPage from './UsuariosPage';
import SemestrePage from './SemestrePage'; // Importa tu otra página aquí

const AdminPage = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Usuarios'); // Estado para controlar la página actual

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Usuarios':
        return <UsuariosPage />;
      case 'Semestres':
        return <SemestrePage />;
      default:
        return <UsuariosPage />;
    }
  };

  return (
    <div className='flex h-screen'>
      <Sidebar 
        isSideMenuOpen={isSideMenuOpen} 
        toggleSideMenu={toggleSideMenu} 
        setCurrentPage={setCurrentPage} 
        currentPage={currentPage} // Pasa la página actual
      />
      <div className='flex flex-col  flex-1 w-full'>
        <Navbar toggleSideMenu={toggleSideMenu} />
        <div className='flex-1 overflow-auto h-full'>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

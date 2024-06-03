import React, { useState,useEffect } from 'react';

import Navbar from '../components/Navbar';

import { useUser } from '../contexts/UserContext';
import JuradoComponent from '../components/jurado/JuradoComponent';
import SidebarJurado from '../components/SidebarJurado';
import HorarioSeleccionMultiple from '../components/jurado/HorarioSeleccionMultiple ';



const JuradoPage = () =>{
  const { user } = useUser();

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('currentPage') || 'Horario Jurado');

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
      case 'Horario Jurado':
        return <HorarioSeleccionMultiple />;
        case 'Reportes':
          return <JuradoComponent />;
      default:
        return <JuradoComponent />;
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

  if (user.rol !== 'Jurado') {
    return (
      <div>
        <p>No tiene permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className='flex  h-screen'>
      <SidebarJurado 
        isSideMenuOpen={isSideMenuOpen} 
        toggleSideMenu={toggleSideMenu} 
        setCurrentPage={changePage} 
        currentPage={currentPage} // Pasa la página actual
      />
      <div className='flex flex-col  flex-1 w-full'>
        <Navbar toggleSideMenu={toggleSideMenu} />
        <div className='flex-1 dark:bg-slate-900   bg-gray-100 overflow-auto h-full'>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default JuradoPage;

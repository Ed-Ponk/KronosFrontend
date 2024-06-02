import React, { useState ,useEffect} from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import UsuariosPage from './UsuariosPage';
import SemestrePage from './SemestrePage'; // Importa tu otra página aquí
import httpClient from '../hooks/httpClient';
import { User } from '../types/User';

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Usuarios'); // Estado para controlar la página actual

  useEffect(() => {
    (async () => {
      try {
        
        const resp = await httpClient.get("http://127.0.0.1:5000/usuarios/session", { withCredentials: true });
        console.log(resp)
        setUser(resp.data.data);
        console.log(user)
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

  useEffect(() => {
    const listarCookies = () => {
      
      console.log("++++"+ document.cookie);
      
    };
  
    listarCookies();
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

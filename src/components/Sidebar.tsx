import React from 'react';

interface SidebarProps {
  isSideMenuOpen: boolean;
  toggleSideMenu: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSideMenuOpen, toggleSideMenu, currentPage, setCurrentPage }) => {
  const menuItems = [
    { name: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', page: 'Home' },
    { name: 'Gestionar Usuarios', icon: 'M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z', page: 'Usuarios' },
    { name: 'Gestionar Semestre', icon: 'M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z', page: 'Semestres' },
    { name: 'Registrar Jurado', icon: 'M20.5393 19.0413C20.3893 19.1913 20.1993 19.2613 20.0093 19.2613C19.8193 19.2613 19.6293 19.1913 19.4793 19.0413L14.5293 14.0913L15.0593 13.5613L15.5893 13.0312L20.5393 17.9812C20.8293 18.2712 20.8293 18.7513 20.5393 19.0413Z M6.46937 9.27814L12.2694 15.0781C12.6594 15.4681 12.6594 16.0981 12.2694 16.4881L11.3694 17.3981C10.5594 18.1981 9.27938 18.1981 8.47937 17.3981L4.13938 13.0581C3.34938 12.2681 3.34938 10.9781 4.13938 10.1781L5.04938 9.26814C5.43938 8.88814 6.07937 8.88814 6.46937 9.27814Z M18.5898 10.1897L14.7798 13.9897C14.3798 14.3897 13.7398 14.3897 13.3398 13.9897L7.55977 8.20969C7.15977 7.80969 7.15977 7.16969 7.55977 6.76969L11.3698 2.95969C12.1598 2.16969 13.4498 2.16969 14.2498 2.95969L18.5898 7.29969C19.3798 8.09969 19.3798 9.37969 18.5898 10.1897Z M8 21.75H2C1.59 21.75 1.25 21.41 1.25 21C1.25 20.59 1.59 20.25 2 20.25H8C8.41 20.25 8.75 20.59 8.75 21C8.75 21.41 8.41 21.75 8 21.75Z', page: 'Jurado' },
    { name: 'Registrar Estudiantes', icon: 'M20.5393 19.0413C20.3893 19.1913 20.1993 19.2613 20.0093 19.2613C19.8193 19.2613 19.6293 19.1913 19.4793 19.0413L14.5293 14.0913L15.0593 13.5613L15.5893 13.0312L20.5393 17.9812C20.8293 18.2712 20.8293 18.7513 20.5393 19.0413Z M6.46937 9.27814L12.2694 15.0781C12.6594 15.4681 12.6594 16.0981 12.2694 16.4881L11.3694 17.3981C10.5594 18.1981 9.27938 18.1981 8.47937 17.3981L4.13938 13.0581C3.34938 12.2681 3.34938 10.9781 4.13938 10.1781L5.04938 9.26814C5.43938 8.88814 6.07937 8.88814 6.46937 9.27814Z M18.5898 10.1897L14.7798 13.9897C14.3798 14.3897 13.7398 14.3897 13.3398 13.9897L7.55977 8.20969C7.15977 7.80969 7.15977 7.16969 7.55977 6.76969L11.3698 2.95969C12.1598 2.16969 13.4498 2.16969 14.2498 2.95969L18.5898 7.29969C19.3798 8.09969 19.3798 9.37969 18.5898 10.1897Z M8 21.75H2C1.59 21.75 1.25 21.41 1.25 21C1.25 20.59 1.59 20.25 2 20.25H8C8.41 20.25 8.75 20.59 8.75 21C8.75 21.41 8.41 21.75 8 21.75Z', page: 'Estudiante' },
    { name: 'Gestionar Cursos', icon: 'M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z', page: 'Curso' },
    { name: 'Gestionar Facultades', icon: 'M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z', page: 'Facultad' }
  ];

  return (
    <div>
      <aside className={`z-20 hidden h-full w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0`}>
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="flex items-center ml-6 text-lg font-bold dark:text-gray-200" href="#">
            <span className="text-2xl text-red-600">USAT</span> <span className="ml-2 text-2xl text-gray-800 dark:text-white">ADMIN</span>
          </a>
          <ul className="mt-6">
            {menuItems.map((item) => (
              <li className="relative px-6 py-3 cursor-pointer" key={item.page} onClick={() => setCurrentPage(item.page)}>
                {currentPage === item.page && (
                  <span className="absolute inset-y-0 left-0 w-1 bg-customRed rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
                )}
                <a className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                  currentPage === item.page ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                } hover:text-gray-800 dark:hover:text-gray-200`}>
                  <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d={item.icon}></path>
                  </svg>
                  <span className="ml-4">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
          
        </div>
      </aside>
      <aside className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden ${isSideMenuOpen ? 'block' : 'hidden'}`}>
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Usat
          </a>
          <ul className="mt-6">
            {menuItems.map((item) => (
              <li className="relative px-6 py-3 cursor-pointer" key={item.page} onClick={() => setCurrentPage(item.page)}>
                {currentPage === item.page && (
                  <span className="absolute inset-y-0 left-0 w-1 bg-customRed rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
                )}
                <a className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                  currentPage === item.page ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                } hover:text-gray-800 dark:hover:text-gray-200`}>
                  <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d={item.icon}></path>
                  </svg>
                  <span className="ml-4">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
          
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

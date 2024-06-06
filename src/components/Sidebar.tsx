import React from 'react';

interface SidebarProps {
  isSideMenuOpen: boolean;
  toggleSideMenu: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSideMenuOpen, toggleSideMenu, currentPage, setCurrentPage }) => {
  const menuItems = [
    { name: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', page: 'Home' },
    { name: 'Gestionar usuarios', icon: 'M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z', page: 'Usuarios' },
    { name: 'Gestionar facultades', icon: 'M6 11.4999H7M6 15.4999H7M17 15.4999H18M17 11.4999H18M11.5 11.4999H12.5M10 20.9999V16.9999C10 15.8954 10.8954 14.9999 12 14.9999C13.1046 14.9999 14 15.8954 14 16.9999V20.9999M17 7.49995L18.5761 7.89398C19.4428 8.11064 19.8761 8.21898 20.1988 8.46057C20.4834 8.67373 20.7061 8.95895 20.8439 9.28682C21 9.65843 21 10.1051 21 10.9984V17.7999C21 18.9201 21 19.4801 20.782 19.9079C20.5903 20.2843 20.2843 20.5902 19.908 20.782C19.4802 20.9999 18.9201 20.9999 17.8 20.9999H6.2C5.0799 20.9999 4.51984 20.9999 4.09202 20.782C3.71569 20.5902 3.40973 20.2843 3.21799 19.9079C3 19.4801 3 18.9201 3 17.7999V10.9984C3 10.1051 3 9.65843 3.15613 9.28682C3.29388 8.95895 3.51657 8.67373 3.80124 8.46057C4.12389 8.21898 4.55722 8.11064 5.42388 7.89398L7 7.49995L9.85931 4.92657C10.6159 4.2456 10.9943 3.90512 11.4221 3.77598C11.799 3.66224 12.201 3.66224 12.5779 3.77598C13.0057 3.90512 13.3841 4.2456 14.1407 4.92657L17 7.49995Z', page: 'Facultad' },
    { name: 'Gestionar semestres', icon: 'M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z', page: 'Semestres' },
    { name: 'Gestionar cursos', icon: 'M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20M9 7H15M9 11H15M19 17V21', page: 'Curso' },
    { name: 'Registrar jurados', icon: 'M20.5393 19.0413C20.3893 19.1913 20.1993 19.2613 20.0093 19.2613C19.8193 19.2613 19.6293 19.1913 19.4793 19.0413L14.5293 14.0913L15.0593 13.5613L15.5893 13.0312L20.5393 17.9812C20.8293 18.2712 20.8293 18.7513 20.5393 19.0413Z M6.46937 9.27814L12.2694 15.0781C12.6594 15.4681 12.6594 16.0981 12.2694 16.4881L11.3694 17.3981C10.5594 18.1981 9.27938 18.1981 8.47937 17.3981L4.13938 13.0581C3.34938 12.2681 3.34938 10.9781 4.13938 10.1781L5.04938 9.26814C5.43938 8.88814 6.07937 8.88814 6.46937 9.27814Z M18.5898 10.1897L14.7798 13.9897C14.3798 14.3897 13.7398 14.3897 13.3398 13.9897L7.55977 8.20969C7.15977 7.80969 7.15977 7.16969 7.55977 6.76969L11.3698 2.95969C12.1598 2.16969 13.4498 2.16969 14.2498 2.95969L18.5898 7.29969C19.3798 8.09969 19.3798 9.37969 18.5898 10.1897Z M8 21.75H2C1.59 21.75 1.25 21.41 1.25 21C1.25 20.59 1.59 20.25 2 20.25H8C8.41 20.25 8.75 20.59 8.75 21C8.75 21.41 8.41 21.75 8 21.75Z', page: 'Jurado' },
    { name: 'Gestionar grupos horarios', icon: 'M18,2 C19.3807,2 20.5,3.11929 20.5,4.5 L20.5,18.75 C20.5,19.1642 20.1642,19.5 19.75,19.5 L5.5,19.5 C5.5,20.0523 5.94772,20.5 6.5,20.5 L19.75,20.5 C20.1642,20.5 20.5,20.8358 20.5,21.25 C20.5,21.6642 20.1642,22 19.75,22 L6.5,22 C5.11929,22 4,20.8807 4,19.5 L4,4.5 C4,3.11929 5.11929,2 6.5,2 L18,2 Z M12.375,6.00488 C9.75165,6.00488 7.625,8.13153 7.625,10.7549 C7.625,13.3782 9.75165,15.5049 12.375,15.5049 C14.9984,15.5049 17.125,13.3782 17.125,10.7549 C17.125,8.13153 14.9984,6.00488 12.375,6.00488 Z M12.375,8.5 C12.6888182,8.5 12.9485868,8.7312562 12.9932239,9.03264162 L13,9.125 L13,10.75 L13.75,10.75 C14.0952,10.75 14.375,11.0298 14.375,11.375 C14.375,11.6888182 14.1437603,11.9485868 13.8423629,11.9932239 L13.75,12 L12.5,12 C12.4789,12 12.4581,11.999 12.4375,11.9969 L12.375,12 L12.375,12 C12.0611818,12 11.8014132,11.7687603 11.7567761,11.4673629 L11.75,11.375 L11.75,9.125 C11.75,8.77982 12.0298,8.5 12.375,8.5 Z', page: 'Grupo' },
    { name: 'Gestionar semanas de sustentación', icon: '', page: 'Semanas' },
    { name: 'Registrar estudiantes', icon: 'M17.9424,12.1272c0-0.4476-0.2532-0.8256-0.6156-1.0368V8.88l1.308-0.6384L9.4716,3.6132L0,8.2404l4.2516,2.0784v3.258c0,0,1.9044,1.7544,5.2884,1.7544c3.384,0,5.1492-1.7544,5.1492-1.7544v-3.258l2.3364-1.1424v2.4312c-0.3612,0.2124-0.6156,0.5892-0.6156,1.0368c0,0.3996,0.2016,0.7332,0.4956,0.9576l-0.3456,1.9008h1.4196l-0.3456-1.9008C17.7408,12.5244,17.9424,12.2884,17.9424,12.1272z', page: 'Estudiante' },
    { name: 'Asignación de sustentaciones', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', page: 'Sustentacion' },

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

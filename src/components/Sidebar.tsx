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
    { name: 'Gestionar Semestre', icon: 'M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z', page: 'Semestres' }
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

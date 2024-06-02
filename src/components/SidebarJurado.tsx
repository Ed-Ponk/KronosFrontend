import React from 'react';

interface SidebarProps {
  isSideMenuOpen: boolean;
  toggleSideMenu: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const SidebarJurado: React.FC<SidebarProps> = ({ isSideMenuOpen, toggleSideMenu, currentPage, setCurrentPage }) => {
  const menuItems = [
    { name: 'Registrar Horario', icon: 'M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z', page: 'Horario Jurado' },
    { name: 'Reportes', icon: 'M10 17H9.2C8.07989 17 7.51984 17 7.09202 16.782C6.71569 16.5903 6.40973 16.2843 6.21799 15.908C6 15.4802 6 14.9201 6 13.8V11C6 11.9319 6 12.3978 6.15224 12.7654C6.35523 13.2554 6.74458 13.6448 7.23463 13.8478C7.60218 14 8.06812 14 9 14M3 8H21M12 11H18M13 14H18M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z', page: 'Reportes' }
  ];

  return (
    <div>
      <aside className={`z-20 hidden h-full w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0`}>
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="flex items-center ml-6 text-lg font-bold dark:text-gray-200" href="#">
            <span className="text-2xl text-red-600">USAT</span> <span className="ml-2 text-2xl text-gray-800 dark:text-white">DOCENTE</span>
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

export default SidebarJurado;

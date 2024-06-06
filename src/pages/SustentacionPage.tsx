import React from 'react';
import FormAsignacion from '../components/sustentaciones/FormAsignacion';
import TablaReportes from '../components/TablaReportes';
import { DataProvider } from '../contexts/DataContextProps '; // Importa el DataProvider

const SustenacionPage: React.FC = () => {
  return (
    <DataProvider>  {/* Envuelve los componentes en el DataProvider */}
      <div className='pt-5 w-full  overflow-auto h-full md:w-auto bg-gray-100 dark:bg-slate-900 '>
        <FormAsignacion />
        <TablaReportes/>
      </div>
    </DataProvider>
  );
};

export default SustenacionPage;

import React from 'react';
import FormAsignacion from '../components/sustentaciones/FormAsignacion';
import TablaReportes from '../components/TablaReportes';
import FechaTablaReportes from '../components/FechaTablaReportes';

const ReporteJuradoPage: React.FC = () => {
  return (
    <div className='pt-5 w-full  overflow-auto h-full md:w-auto bg-gray-100 dark:bg-slate-900 '>
      <FechaTablaReportes/>
    </div>
  );
};

export default ReporteJuradoPage;

import React from 'react';
import FormAsignacion from '../components/sustentaciones/FormAsignacion';

const SustenacionPage: React.FC = () => {
  return (
    <div className='pt-5 w-full  overflow-auto h-full md:w-auto bg-gray-100 dark:bg-slate-900 '>
      <FormAsignacion />
    </div>
  );
};

export default SustenacionPage;

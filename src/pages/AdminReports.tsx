import React, { useEffect, useState } from 'react';

import FormHomeWSP from '../components/Home/FormHomeWSP';


import FilteredTablaReportes from '../components/FilteredTablaReportes';
import PageReportAdmin from '../components/PageReportAdmin';

const AdminReports: React.FC = () => {
  
  return (
    <div className='pt-5 w-full overflow-auto h-full md:w-auto bg-gray-100 dark:bg-slate-900'>
      

      <PageReportAdmin />
    </div>
  );
};

export default AdminReports;

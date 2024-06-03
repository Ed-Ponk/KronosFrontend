
import { FormEstudiante } from '../components/estudiante/EstudianteForm';
import TablaEstudiante from '../components/estudiante/TablaEstudiante';

const EstudiantePage = () =>{
  
  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <div className='flex-1 flex flex-col'>
        <FormEstudiante />
        <TablaEstudiante />
      </div>
    </div>
  );
};

export default EstudiantePage;

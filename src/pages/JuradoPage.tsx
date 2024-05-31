import { FormJurado } from '../components/JuradoForm';
import TablaJurado from '../components/TablaJurado';

const JuradoPage = () => {
 

  return (
    <div className='w-full h-full md:w-auto bg-gray-100 '>
      <FormJurado />
      <TablaJurado  />
    </div>
  );
};

export default JuradoPage;

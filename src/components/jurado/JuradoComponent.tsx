import FormJurado from "./JuradoForm";
import TablaJurado from "./TablaJurado";




const JuradoComponent = () =>{

  return (
    <div className='min-h-screen flex flex-col  bg-gray-100 dark:bg-slate-900 '>
      <div className='flex-1 flex flex-col'>
        <FormJurado />
        <TablaJurado />
      </div>
    </div>
  );
};

export default JuradoComponent;

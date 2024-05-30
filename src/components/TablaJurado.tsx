import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import axios from 'axios';

const TablaJurado: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('TU_API_URL');
        setData(response.data); // Asigna los datos de la respuesta al estado 'data'
        setLoading(false); // Cambia el estado de carga a falso
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Llama a la función fetchData al montar el componente
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Nombre',
        accessor: 'nombre',
      },
      {
        Header: 'Edad',
        accessor: 'edad',
      },
     
    ],
    []
  );

  return (
    <div className='mt-5 flex flex-col w-full max-w-lg   mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5'>
      <h1>Mi tabla de datos</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default TablaJurado;
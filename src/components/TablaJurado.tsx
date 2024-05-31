import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import axios from 'axios';

interface Jurado {
  jurado_id: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  semestre: string;
  dedicacion: string;
  hora_asesoria_semanal: number;
}

const TablaJurado: React.FC = () => {
  const [data, setData] = useState<Jurado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/jurados/obtener-jurado-semestre');
        const jsonData = JSON.parse(response.data);
        const data = jsonData.data;
        console.log(data)
        setData(data); // Asigna los datos de la respuesta al estado 'data'
        
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
        accessor: 'jurado_id',
      },
      {
        Header: 'Nombre',
        accessor: 'nombre_completo',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Teléfono',
        accessor: 'telefono',
      },
      {
        Header: 'Semestre',
        accessor: 'semestre',
      },
      {
        Header: 'Dedicación',
        accessor: 'dedicacion',
      },
      {
        Header: 'Hora de Asesoría Semanal',
        accessor: 'hora_asesoria_semanal',
      },
    ],
    []
  );

  return (
    <div className='mt-5 flex flex-col w-full max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5'>
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

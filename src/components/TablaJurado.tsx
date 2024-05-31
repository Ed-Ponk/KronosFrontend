import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';

// Define un tipo genérico para tus datos
type DataItem = {
  jurado_id: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  semestre: string;
  dedicacion: string;
  hora_asesoria_semanal: number;
};

const TablaJurado: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/jurados/obtener-jurado-semestre');
        const jsonData = JSON.parse(response.data);
        const data = jsonData.data;
        setData(data);
        setLoading(false); // Cambia el estado de carga a falso
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Llama a la función fetchData al montar el componente
  }, []);

  const columns: TableColumn<DataItem>[] = [
    {
      name: 'ID',
      selector: (row: DataItem) => row.jurado_id,
      sortable: true
    },
    {
      name: 'Nombre',
      selector: (row: DataItem) => row.nombre_completo,
    },
    {
      name: 'Email',
      selector: (row: DataItem) => row.email,
    },
    {
      name: 'Teléfono',
      selector: (row: DataItem) => row.telefono,
    },
    {
      name: 'Semestre',
      selector: (row: DataItem) => row.semestre,
    },
    {
      name: 'Dedicación',
      selector: (row: DataItem) => row.dedicacion,
    },
    {
      name: 'Hora de Asesoría Semanal',
      selector: (row: DataItem) => row.hora_asesoria_semanal,
    },
  ];

  return (
    <div className='mt-5 flex flex-col w-full max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5'>
      <h1>Mi tabla de datos</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DataTable className='text-color-black' columns={columns} data={data} />
      )}
    </div>
  );
};

export default TablaJurado;

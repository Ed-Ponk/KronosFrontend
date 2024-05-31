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
  const [records, setRecords] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/jurados/obtener-jurado-semestre');
        const jsonData = JSON.parse(response.data);
        const data = jsonData.data;
        setData(data);
        setRecords(data);
        setLoading(false); // Cambia el estado de carga a falso
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Llama a la función fetchData al montar el componente
  }, []);

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLocaleLowerCase();
    if (query === '') {
      setRecords(data); // Restablece los datos completos si el input está vacío
    } else {
      const newData = data.filter(row => {
        return row.nombre_completo.toLocaleLowerCase().includes(query);
      });
      setRecords(newData);
    }
  };

  const paginationOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const columns: TableColumn<DataItem>[] = [
    {
      name: 'ID',
      selector: (row: DataItem) => row.jurado_id,
      sortable: true
    },
    {
      name: 'Nombre',
      selector: (row: DataItem) => row.nombre_completo,
      sortable: true
    },
    {
      name: 'Email',
      selector: (row: DataItem) => row.email,
      sortable: true
    },
    {
      name: 'Teléfono',
      selector: (row: DataItem) => row.telefono,
      sortable: true
    },
    {
      name: 'Semestre',
      selector: (row: DataItem) => row.semestre,
      sortable: true
    },
    {
      name: 'Dedicación',
      selector: (row: DataItem) => row.dedicacion,
      sortable: true
    },
    {
      name: 'Hora de Asesoría Semanal',
      selector: (row: DataItem) => row.hora_asesoria_semanal,
      sortable: true
    },
  ];

  return (
    <div className='mt-5 flex flex-col w-full max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5'>
      <h1>Mi tabla de datos</h1>

      <div className='w-100 flex justify-end'>
         <input name='buscar' onChange={handleFilter} className='block px-1.5  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' placeholder='Ingresa un Nombre' type='search'></input>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
       
        <DataTable className='text-color-black' columns={columns} data={records} fixedHeader pagination paginationComponentOptions={paginationOptions} />
      )}
    </div>
  );
};

export default TablaJurado;

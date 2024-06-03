import React, { useState, useEffect, ChangeEvent } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';
import SelectSemestre from '../semestre/SelectSemestre';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
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
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<DataItem[]>([]);
  const [selectedSemestre, setSelectedSemestre] = useState<number | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);

  const fetchData = async (semestreId: number) => {

    setLoading(true);
    try {
      const url = `http://127.0.0.1:5000/jurados/obtener-jurado-semestre?semestre_id=${semestreId}`;
      const response = await axios.get(url);
     
      if (!response.data.status || !response.data) {
        MySwal.fire({
          title: 'Sin registros',
          text: 'No hay datos para el semestre seleccionado',
          icon: 'info',
        });
        setShowTable(false);
      } else {
        const data = response.data.data;
        setData(data);
        setRecords(data);
        setShowTable(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      MySwal.fire({
        title: 'Error',
        text: 'Hubo un error al obtener los datos',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleBuscar = () => {
    if (selectedSemestre !== null) {
      fetchData(selectedSemestre);
    }
  };

  const handleSemestreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const semestreId = parseInt(event.target.value);
    setSelectedSemestre(semestreId);
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
      sortable: true,
      width: '70px',
    },
    {
      name: 'Nombre',
      selector: (row: DataItem) => row.nombre_completo,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Email',
      selector: (row: DataItem) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Teléfono',
      selector: (row: DataItem) => row.telefono,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Semestre',
      selector: (row: DataItem) => row.semestre,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Dedicación',
      selector: (row: DataItem) => row.dedicacion,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Hora de Asesoría Semanal',
      selector: (row: DataItem) => row.hora_asesoria_semanal,
      sortable: true,
      width: '150px',
    },
  ];

  return (
    <div className='mt-5 flex flex-col w-3/5 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-5'>
      <h1 className='font-medium text-gray-900 dark:text-gray-200'>Lista de Jurados</h1>
      <hr />
      <div className="sm:col-span-3 mt-2">
        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Semestres</label>
        <div className='flex'>
          <div className="mt-2 w-1/2">
            <SelectSemestre onChange={handleSemestreChange} />
          </div>
          <div className="mt-2 w-1/2 flex justify-end">
            <button
              name='filtrarJurado'
              className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              type="button"
              onClick={handleBuscar}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {showTable && (
        <>
          <div className='w-100 mt-5 mb-2 flex '>
            <input
              name='buscar'
              onChange={handleFilter}
              className='block px-1.5 w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder='Ingresar nombre del jurado'
              type='search'
            />
          </div>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <DataTable
              className='text-color-black'
              columns={columns}
              data={records}
              fixedHeader
              pagination
              paginationComponentOptions={paginationOptions}
              noDataComponent={<div className='mt-2'>No hay registros para mostrar</div>}
              responsive
              fixedHeaderScrollHeight="400px"
            />
          )}
        </>
      )}
    </div>
  );
};

export default TablaJurado;

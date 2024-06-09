import React, { useState, useEffect, ChangeEvent } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';
import SelectSemestre from '../semestre/SelectSemestre';
import SelectEscuela from '../escuela/selectEscuela';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalJurado from './ModalJurado';

const MySwal = withReactContent(Swal);

type DataItem = {
  jurado_id: number;
  semestre: string;
  escuela: string; // Nombre de la escuela
  nombre_completo: string;
  email: string;
  telefono: string;
  dedicacion: string;
  hora_asesoria_semanal: number;
};

type JuradoFormState = {
  jurado_id?: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  escuela_id: number | string;
  semestre_id: number | string;
  dedicacion: string;
  hora_asesoria_semanal: number | string;
};

const initialFormState: JuradoFormState = {
  nombre_completo: '',
  email: '',
  telefono: '',
  escuela_id: '',
  semestre_id: '',
  dedicacion: '',
  hora_asesoria_semanal: '',
};

const TablaJurado: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<DataItem[]>([]);
  const [selectedSemestre, setSelectedSemestre] = useState<number | null>(null);
  const [selectedEscuela, setSelectedEscuela] = useState<number | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJurado, setCurrentJurado] = useState<JuradoFormState>(initialFormState);
  const [semestreMap, setSemestreMap] = useState<{ [key: string]: number }>({});
  const [escuelaMap, setEscuelaMap] = useState<{ [key: string]: number }>({});

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentJurado(initialFormState);
    setIsEditing(false);
  };

  const fetchData = async (semestreId: number | null, escuelaId: number | null) => {
    setLoading(true);
    try {
      let url = '';
      const params = new URLSearchParams();
      if (semestreId) params.append('semestre_id', semestreId.toString());
      if (escuelaId) params.append('escuela_id', escuelaId.toString());

      if (escuelaId || (semestreId && escuelaId)) {
        url = `http://127.0.0.1:5000/jurados/obtener-jurado-escuela-semestre?${params.toString()}`;
      } else if (semestreId) {
        url = `http://127.0.0.1:5000/jurados/obtener-jurado-semestre?${params.toString()}`;
      }

      const response = await axios.get(url);

      if (!response.data.status || !response.data.data) {
        MySwal.fire({
          title: 'Sin registros',
          text: 'No hay datos para la combinación seleccionada',
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
    const query = event.target.value.toLocaleUpperCase();
    if (query === '') {
      setRecords(data); // Restablece los datos completos si el input está vacío
    } else {
      const newData = data.filter(row => row.nombre_completo.toLocaleUpperCase().includes(query));
      setRecords(newData);
    }
  };

  const handleBuscar = () => {
    if (selectedSemestre || selectedEscuela) {
      fetchData(selectedSemestre, selectedEscuela);
    } else {
      MySwal.fire({
        title: 'Error',
        text: 'Debes seleccionar un semestre o una escuela',
        icon: 'warning',
      });
    }
  };

  const handleSemestreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const semestreId = parseInt(event.target.value);
    setSelectedSemestre(semestreId);
  };

  const handleEscuelaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const escuelaId = parseInt(event.target.value);
    setSelectedEscuela(escuelaId);
  };

  const handleEdit = (jurado: DataItem) => {
    setIsEditing(true);
    const escuelaId = escuelaMap[jurado.escuela] || ''; // Obtener el ID de la escuela a partir del nombre
    const semestreId = semestreMap[jurado.semestre] || ''; // Obtener el ID del semestre a partir del nombre
    setCurrentJurado({
      jurado_id: jurado.jurado_id,
      nombre_completo: jurado.nombre_completo,
      email: jurado.email,
      telefono: jurado.telefono,
      escuela_id: escuelaId,
      semestre_id: semestreId,
      dedicacion: jurado.dedicacion,
      hora_asesoria_semanal: jurado.hora_asesoria_semanal,
    });
    openModal();
  };

 /* const handleDelete = async (id: number) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        
        axios.delete('http://127.0.0.1:5000/jurados/eliminar', {
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({ jurado_id: id })
        })
          .then(() => {
            MySwal.fire(
              'Eliminado!',
              'El jurado ha sido eliminado.',
              'success'
            );
            fetchData(selectedSemestre, selectedEscuela); // Refresh the data
          })
          .catch(error => {
            MySwal.fire(
              'Error!',
              'Hubo un problema al eliminar el jurado.',
              'error'
            );
          });

        
      }
    });
    
  };*/

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
      name: 'Semestre',
      selector: (row: DataItem) => row.semestre,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Escuela',
      selector: (row: DataItem) => row.escuela,
      sortable: true,
    },
    {
      name: 'Nombres',
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
    {
      name: 'Acciones',
      cell: (row: DataItem) => (
        <div>
          <button
            className="text-blue-600 hover:text-blue-900 mr-2"
            onClick={() => handleEdit(row)}
          >
            Editar
          </button>
         
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <div className='mt-5 flex flex-col w-4/5 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-5'>
      <div className='mt-4 mb-2 flex justify-between'>
        <h1 className='font-medium text-gray-900 dark:text-gray-200'>Lista de Jurados</h1>
        <button
          className='rounded-md bg-green-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500'
          onClick={openModal}
        >
          Agregar Jurado
        </button>
      </div>
      <hr />
      <div className='mt-2 flex flex-col md:flex-row md:items-center md:space-x-4'>
        <div className="flex-1">
          <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Semestres</label>
          <SelectSemestre onChange={handleSemestreChange} setSemestreMap={setSemestreMap} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Escuela</label>
          <SelectEscuela onChange={handleEscuelaChange} setEscuelaMap={setEscuelaMap} />
        </div>
        <div className="flex justify-end mt-4 md:mt-0">
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

      {showTable && (
        <>
          <div className='w-100 mt-5 mb-2 flex'>
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

      <ModalJurado
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        isEditing={isEditing}
        jurado={currentJurado}
        setJurado={setCurrentJurado}
        fetchData={() => fetchData(selectedSemestre, selectedEscuela)}
      />
    </div>
  );
};

export default TablaJurado;
